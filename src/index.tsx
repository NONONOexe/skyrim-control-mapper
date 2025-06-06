import React from 'react'
import { createRoot } from 'react-dom/client';

interface BindingFile {
    name: string
    groups: BindingGroup[]
}

interface BindingGroup {
    name: string
    bindings: Binding[]
}

type BindingValue = { type: 'none' } | { type: 'code', code: number } | { type: 'alias', alias: string } | { type: 'and', and: BindingValue[] } | { type: 'or', or: BindingValue[] }

interface Binding {
    name: string
    codes: {
        keyboard: BindingValue
        mouse: BindingValue
        gamepad: BindingValue
    }
    remappable: {
        keyboard: boolean
        mouse: boolean
        gamepad: boolean
    }
    flags: number
}

function parseNumber(s: string): number {
    return s.startsWith('0x') ? parseInt(s.substring(2), 16) : parseInt(s, 10)
}

function parseBoolean(s: string): boolean {
    return s === '1'
}

function parseToken(s: string, ptr: { x: number }) {
    const commaIndex = s.indexOf(',', ptr.x)
    const plusIndex = s.indexOf('+', ptr.x)
    const end = Math.min(commaIndex >= 0 ? commaIndex : Infinity, plusIndex >= 0 ? plusIndex : Infinity, s.length)
    const token = s.substring(ptr.x, end)
    ptr.x = end
    return token
}

function parseSimpleBindingValue(s: string, ptr: { x: number }): BindingValue {
    let left: BindingValue
    if (s.substring(ptr.x, ptr.x + 3) === '!0,') {
        ptr.x += 3
        const alias = parseToken(s, ptr)
        left = { type: 'alias', alias }
    } else if (s.substring(ptr.x, ptr.x + 2) === '0x') {
        const code = parseNumber(parseToken(s, ptr))
        if (code === 0xff)
            left = { type: 'none' }
        else
            left = { type: 'code', code }
    } else {
        left = { type: 'none' }
    }
    return left
}

function parseComplexBindingValue(left: BindingValue, s: string, ptr: { x: number }): BindingValue {
    if (s[ptr.x] === ',') {
        const or: BindingValue[] = [left]
        while (s[ptr.x] === ',') {
            ptr.x++
            const right = parseBindingValue(s, ptr)
            if (right.type === 'or')
                or.push(...right.or)
            else
                or.push(right)
        }
        return { type: 'or', or }
    } else if (s[ptr.x] === '+') {
        let newParent: BindingValue | null = null
        const and: BindingValue[] = [left]
        while (s[ptr.x] === '+') {
            ptr.x++
            const right = parseBindingValue(s, ptr)
            if (right.type === 'or') {
                newParent = right
                and.push(right.or[0])
            } else if (right.type === 'and')
                and.push(...right.and)
            else
                and.push(right)
        }
        if (newParent) {
            newParent.or[0] = { type: 'and', and }
            return newParent
        }
        return { type: 'and', and }
    } else {
        return left
    }
}

function parseBindingValue(s: string, ptr: { x: number }): BindingValue {
    const left = parseSimpleBindingValue(s, ptr)
    const right = parseComplexBindingValue(left, s, ptr)
    return right
}

function parseBinding(s: string): Binding {
    const args = s.split(/\t+/)
    return {
        name: args[0],
        codes: {
            keyboard: parseBindingValue(args[1], { x: 0 }),
            mouse: parseBindingValue(args[2], { x: 0 }),
            gamepad: parseBindingValue(args[3], { x: 0 }),
        },
        remappable: {
            keyboard: parseBoolean(args[4]),
            mouse: parseBoolean(args[5]),
            gamepad: parseBoolean(args[6]),
        },
        flags: parseNumber(args[7] ?? '0'),
    }
}

function parseBindingGroup(lines: string[], ptr: { y: number }): BindingGroup {
    const name = lines[ptr.y - 1].substring(3).trim()
    const bindings: Binding[] = []
    while (ptr.y < lines.length && lines[ptr.y].trim()) {
        const binding = parseBinding(lines[ptr.y++])
        bindings.push(binding)
    }
    return { name, bindings }
}

function parseBindingFile(s: string, name: string): BindingFile {
    const lines = s.split(/\r?\n/)
    const ptr = { y: 0 }
    const groups: BindingGroup[] = []
    while (ptr.y < lines.length && (!lines[ptr.y].trim() || lines[ptr.y].startsWith('//'))) ptr.y++
    while (ptr.y < lines.length) {
        groups.push(parseBindingGroup(lines, ptr))
        while (ptr.y < lines.length && (!lines[ptr.y].trim() || lines[ptr.y].startsWith('//'))) ptr.y++
    }
    return { name, groups }
}

function printBindingFile(file: BindingFile) {
    return file.groups.flatMap(g => printBindingGroup(g)).join('\r\n')
}

function printBindingGroup(group: BindingGroup) {
    return `// ${group.name}\r\n${printColumns(group.bindings.length, [
        group.bindings.map(b => b.name),
        group.bindings.map(b => formatBindingValue(b.codes.keyboard, 2)),
        group.bindings.map(b => formatBindingValue(b.codes.mouse, 1)),
        group.bindings.map(b => formatBindingValue(b.codes.gamepad, 4)),
        group.bindings.map(b => formatBoolean(b.remappable.keyboard)),
        group.bindings.map(b => formatBoolean(b.remappable.mouse)),
        group.bindings.map(b => formatBoolean(b.remappable.gamepad)),
        group.bindings.map(b => b.flags ? formatNumber(b.flags, 1) : ''),
    ])}\r\n`
}

function formatBindingValue(v: BindingValue, digits: number): string {
    switch (v.type) {
        case 'code': return formatNumber(v.code, digits)
        case 'alias': return `!0,${v.alias}`
        case 'and': return v.and.map(o => formatBindingValue(o, digits)).join('+')
        case 'or': return v.or.map(o => formatBindingValue(o, digits)).join(',')
        case 'none': return '0xff'
        default: return JSON.stringify(v)
    }
}

function formatNumber(n: number, digits: number) {
    return `0x${n.toString(16).padStart(digits, '0')}`
}

function formatBoolean(b: boolean) {
    return b ? '1' : '0'
}

function padColumnValue(value: string, tabs: number) {
    const padding = Math.ceil((tabs * 4 - value.length) / 4)
    return value + '\t'.repeat(padding)
}

function getColumnTabCount(values: string[]): number {
    const maxLength = values.reduce((p, c) => Math.max(p, c.length), 0)
    const tabs = Math.ceil((maxLength + 1) / 4)
    return tabs
}

function printColumns(count: number, columns: string[][]) {
    const columnTabs = columns.map(c => getColumnTabCount(c))
    return new Array(count).fill(null).map((_, i) => columns.map((c, j) => padColumnValue(c[i], columnTabs[j])).join('').trim()).join('\r\n')
}

const mouseCodes = {
    'Mouse1': 0x0,
    'Mouse2': 0x1,
    'Mouse3': 0x2,
    'Mouse4': 0x3,
    'Mouse5': 0x4,
    'Mouse6': 0x5,
    'Mouse7': 0x6,
    'Mouse8': 0x7,
    'MouseWheelUp': 0x8,
    'MouseWheelDown': 0x9,
    'MouseMove': 0xa,
}

const gamepadCodes = {
    'Up': 0x0001,
    'Down': 0x0002,
    'Left': 0x0004,
    'Right': 0x008,
    '360_Start': 0x0010,
    '360_Back': 0x0020,
    '360_L3': 0x0040,
    '360_R3': 0x0080,
    '360_LB': 0x0100,
    '360_RB': 0x0200,
    '360_A': 0x1000,
    '360_B': 0x2000,
    '360_X': 0x4000,
    '360_Y': 0x8000,
    '360_LT': 0x0009,
    '360_RT': 0x000a,
    '360_LS': 0x000b,
    '360_RS': 0x000c,
}

const keyboardCodes = {
    'Esc': 0x01,
    '1': 0x02,
    '2': 0x03,
    '3': 0x04,
    '4': 0x05,
    '5': 0x06,
    '6': 0x07,
    '7': 0x08,
    '8': 0x09,
    '9': 0x0a,
    '0': 0x0b,
    'Hyphen': 0x0c,
    'Equal': 0x0d,
    'Backspace': 0x0e,
    'Tab': 0x0f,
    'Q': 0x10,
    'W': 0x11,
    'E': 0x12,
    'R': 0x13,
    'T': 0x14,
    'Y': 0x15,
    'U': 0x16,
    'I': 0x17,
    'O': 0x18,
    'P': 0x19,
    'Bracketleft': 0x1a,
    'Bracketright': 0x1b,
    'Enter': 0x1c,
    'L-Ctrl': 0x1d,
    'A': 0x1e,
    'S': 0x1f,
    'D': 0x20,
    'F': 0x21,
    'G': 0x22,
    'H': 0x23,
    'J': 0x24,
    'K': 0x25,
    'L': 0x26,
    'Semicolon': 0x27,
    'Quotesingle': 0x28,
    'Tilde': 0x29,
    'L-Shift': 0x2a,
    'Backslash': 0x2b,
    'Z': 0x2c,
    'X': 0x2d,
    'C': 0x2e,
    'V': 0x2f,
    'B': 0x30,
    'N': 0x31,
    'M': 0x32,
    'Comma': 0x33,
    'Period': 0x34,
    'Slash': 0x35,
    'R-Shift': 0x36,
    'NumPadMult': 0x37,
    'L-Alt': 0x38,
    'Space': 0x39,
    'CapsLock': 0x3a,
    'F1': 0x3b,
    'F2': 0x3c,
    'F3': 0x3d,
    'F4': 0x3e,
    'F5': 0x3f,
    'F6': 0x40,
    'F7': 0x41,
    'F8': 0x42,
    'F9': 0x43,
    'F10': 0x44,
    'NumLock': 0x45,
    'ScrollLock': 0x46,
    'NumPad7': 0x47,
    'NumPad8': 0x48,
    'NumPad9': 0x49,
    'NumPadMinus': 0x4a,
    'NumPad4': 0x4b,
    'NumPad5': 0x4c,
    'NumPad6': 0x4d,
    'NumPadPlus': 0x4e,
    'NumPad1': 0x4f,
    'NumPad2': 0x50,
    'NumPad3': 0x51,
    'NumPad0': 0x52,
    'NumPadDec': 0x53,
    'DIK_OEM_102': 0x56,
    'F11': 0x57,
    'F12': 0x58,
    'F13': 0x64,
    'F14': 0x65,
    'F15': 0x66,
    'DIK_KANA': 0x70,
    'DIK_ABNT_C1': 0x73,
    'DIK_CONVERT': 0x79,
    'DIK_NOCONVERT': 0x7b,
    '�': 0x7d,
    'DIK_ABNT_C2': 0x7e,
    'NumPadEqual': 0x8d,
    'Prev Track': 0x90,
    'DIK_AT': 0x91,
    ':': 0x92,
    'DIK_UNDERLINE': 0x93,
    'DIK_KANJI': 0x94,
    'DIK_STOP': 0x95,
    'DIK_AX': 0x96,
    'DIK_UNLABELED': 0x97,
    'Next Track': 0x99,
    'NumPadEnter': 0x9c,
    'R-Ctrl': 0x9d,
    'Mute': 0xa0,
    'Calc': 0xa1,
    'Play/Pause': 0xa2,
    'MediaStop': 0xa4,
    'Vol-': 0xae,
    'Vol+': 0xb0,
    'WebHome': 0xb2,
    'NumPadComma': 0xb3,
    'NumPadDivide': 0xb5,
    'PrintSrc': 0xb7,
    'R-Alt': 0xb8,
    'Pause': 0xc5,
    'Home': 0xc7,
    'Up': 0xc8,
    'PgUp': 0xc9,
    'Left': 0xcb,
    'Right': 0xcd,
    'End': 0xcf,
    'Down': 0xd0,
    'PgDn': 0xd1,
    'Insert': 0xd2,
    'Delete': 0xd3,
    'L-Windows': 0xdb,
    'R-Windows': 0xdc,
    'Apps': 0xdd,
    'Power': 0xde,
    'Sleep': 0xdf,
    'Wake': 0xe3,
    'WebSearch': 0xe5,
    'WebFavorites': 0xe6,
    'WebRefresh': 0xe7,
    'WebStop': 0xe8,
    'WebForward': 0xe9,
    'WebBack': 0xea,
    'My Computer': 0xeb,
    'Mail': 0xec,
    'MediaSelect': 0xed,
}

const codes = {
    keyboard: keyboardCodes,
    mouse: mouseCodes,
    gamepad: gamepadCodes,
}

const standardFileHeader = `// 1st field: User event name.  DO NOT ALTER!  This field is used to ID events in the code							
// 2nd: Keyboard key ID that will proc this event.  A value of 0xff means the event is unmapped for this device.							
// 3rd: Mouse button ID that will proc this event.							
// 4th: Gamepad button ID that will proc this event.							
// 5th: If set to 1, this event can be remapped to a keyboard key
// 6th: If set to 1, this event can be remapped to a mouse button
// 7th: If set to 1, this event can be remapped to a gamepad button
// 8th (Optional): User event binary flag.  Used to group together related user events, like "Movement" or
// "Menu", so they can be toggled on and off together
//							
// Blank lines signify the start of a new input context.							
// See ControlMap.h for more details on input contexts.							
//							
`

function setBit(f: number, b: number, v: boolean): number {
    return getBit(f, b) === v ? f : f ^= (1 << b)
}

function getBit(f: number, b: number): boolean {
    return (f & (1 << b)) !== 0
}

function BindingValueCell({ v, type, aliases, onChange }: { v: BindingValue, type: 'keyboard' | 'mouse' | 'gamepad', aliases: Record<string, string[]>, onChange: (v: BindingValue) => void }) {

    const onChangeType = (type: string) => {
        switch (type) {
            case 'code': return onChange({ type, code: 0xff })
            case 'alias': return onChange({ type, alias: '' })
            case 'and': return onChange({ type, and: [] })
            case 'or': return onChange({ type, or: [] })
            case 'none': return onChange({ type })
        }
    }

    const onChangeCode = (code: number) => {
        if (v.type !== 'code') return
        return onChange({ type: 'code', code })
    }

    const onChangeAlias = (alias: string) => {
        if (v.type !== 'alias') return
        return onChange({ type: 'alias', alias })
    }

    const onChangeAnd = (o: BindingValue, i: number) => {
        if (v.type !== 'and') return
        return onChange({
            type: 'and',
            and: [
                ...v.and.slice(0, i),
                o,
                ...v.and.slice(i + 1),
            ]
        })
    }

    const onDeleteAnd = (i: number) => {
        if (v.type !== 'and') return
        return onChange({
            type: 'and',
            and: [
                ...v.and.slice(0, i),
                ...v.and.slice(i + 1),
            ]
        })
    }

    const onAppendAnd = () => {
        if (v.type !== 'and') return
        return onChange({
            type: 'and',
            and: [
                ...v.and,
                { type: 'none' },
            ]
        })
    }

    const onChangeOr = (o: BindingValue, i: number) => {
        if (v.type !== 'or') return
        return onChange({
            type: 'or',
            or: [
                ...v.or.slice(0, i),
                o,
                ...v.or.slice(i + 1),
            ]
        })
    }

    const onDeleteOr = (i: number) => {
        if (v.type !== 'or') return
        return onChange({
            type: 'or',
            or: [
                ...v.or.slice(0, i),
                ...v.or.slice(i + 1),
            ]
        })
    }

    const onAppendOr = () => {
        if (v.type !== 'or') return
        return onChange({
            type: 'or',
            or: [
                ...v.or,
                { type: 'none' },
            ]
        })
    }

    return <>
        <select value={v.type} onChange={e => onChangeType(e.target.value)}>
            <option value="none">None</option>
            <option value="code">Code</option>
            <option value="alias">Alias</option>
            <option value="and">All Of</option>
            <option value="or">Any Of</option>
        </select>
        {v.type === 'code' ? <select value={v.code} onChange={e => onChangeCode(parseNumber(e.target.value))}>
            {Object.entries(codes[type]).map(([key, value]) => <option value={value} key={value}>{key}</option>)}
        </select> : null}
        {v.type === 'alias' ? <select value={v.alias} onChange={e => onChangeAlias(e.target.value)}>
            {Object.keys(aliases).map(k => <optgroup key={k} label={k}>{aliases[k].map(a => <option key={a}>{a}</option>)}</optgroup>)}
        </select> : null}
        {v.type === 'and' ? <>
            ({v.and.map((o, i) => <React.Fragment key={i}>
            {i > 0 ? <>,&nbsp;</> : null}
            <BindingValueCell v={o} type={type} aliases={aliases} onChange={o => onChangeAnd(o, i)} />
            <button onClick={() => onDeleteAnd(i)}>x</button>
        </React.Fragment>)}, <button onClick={() => onAppendAnd()}>+</button>)
        </> : null}
        {v.type === 'or' ? <>
            ({v.or.map((o, i) => <React.Fragment key={i}>
            {i > 0 ? <>,&nbsp;</> : null}
            <BindingValueCell v={o} type={type} aliases={aliases} onChange={o => onChangeOr(o, i)} />
            <button onClick={() => onDeleteOr(i)}>x</button>
        </React.Fragment>)}, <button onClick={() => onAppendOr()}>+</button>)
        </> : null}
    </>
}

interface StoredState {
    file: BindingFile | null
    mode: 'kbm' | 'pad' | 'all'
    showFlags: boolean
}

const LOCAL_STORAGE_KEY = 'skyrim-control-mapper-file'

const DEFAULTS_KEYS = [
    'Skyrim AE 1.6.640',
    'Skyrim SE 1.5.97'
]

function App() {
    const [file, setFile] = React.useState<BindingFile | null>(null)
    const [mode, setMode] = React.useState<'kbm' | 'pad' | 'all'>('pad')
    const [showFlags, setShowFlags] = React.useState(false)
    const [defaultsKey, setDefaultsKey] = React.useState(DEFAULTS_KEYS[0])

    React.useEffect(() => {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (stored) {
            const data = JSON.parse(stored) as StoredState
            setFile(data.file)
            setMode(data.mode)
            setShowFlags(data.showFlags)
        }
    }, [])

    React.useEffect(() => {
        const state: StoredState = {
            file,
            mode,
            showFlags,
        }
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state))
    }, [file, mode, showFlags])

    const onUpload = async (f?: File | null) => {
        const s = await f?.text()
        if (!f || !s) return
        const file = parseBindingFile(s, f.name)
        setFile(file)
    }

    const loadDefaults = async () => {
        var res = await fetch(`defaults/${defaultsKey}.txt`)
        var text = await res.text()
        const file = parseBindingFile(text, defaultsKey)
        setFile(file)
    }

    const setGroup = (g: Partial<BindingGroup>, i: number) => {
        if (!file) return
        setFile({
            ...file,
            groups: [
                ...file.groups.slice(0, i),
                { ...file.groups[i], ...g },
                ...file.groups.slice(i + 1),
            ]
        })
    }

    const setBinding = (b: Partial<Binding>, j: number, i: number) => {
        if (!file) return
        const g = file.groups[i]
        setGroup({
            ...g,
            bindings: [
                ...g.bindings.slice(0, j),
                { ...g.bindings[j], ...b },
                ...g.bindings.slice(j + 1),
            ]
        }, i)
    }

    const setBindingValue = (type: 'keyboard' | 'mouse' | 'gamepad', value: BindingValue, j: number, i: number) => {
        if (!file) return
        setBinding({
            codes: {
                ...file.groups[i].bindings[j].codes,
                [type]: value,
            }
        }, j, i)
    }

    const setRemappable = (type: 'keyboard' | 'mouse' | 'gamepad', value: boolean, j: number, i: number) => {
        if (!file) return
        setBinding({
            remappable: {
                ...file.groups[i].bindings[j].remappable,
                [type]: value,
            }
        }, j, i)
    }

    const setFlagBit = (bit: number, value: boolean, j: number, i: number) => {
        if (!file) return
        setBinding({
            flags: setBit(file.groups[i].bindings[j].flags, bit, value),
        }, j, i)
    }

    const aliases = file?.groups.reduce((p, g) => ({ ...p, [g.name]: g.bindings.map(b => b.name) }), {} as Record<string, string[]>) ?? {}

    const downloadUrl = React.useMemo(() => {
        if (!file) return ''
        return `data:,${encodeURIComponent(`${standardFileHeader}${printBindingFile(file)}`)}`
    }, [file])

    return <>
        <label>
            Upload controlmap.txt
            &nbsp;
            <input type="file" accept=".txt" onChange={async e => onUpload(e.target.files?.item(0))} />
        </label>
        <br />
        <select value={defaultsKey} onChange={e => setDefaultsKey(e.target.value)}>
            {DEFAULTS_KEYS.map(k => <option key={k}>{k}</option>)}
        </select>
        <button onClick={async () => loadDefaults()}>
            Load Defaults
        </button>
        <br />
        {file ? <>
            <a href={downloadUrl} download="controlmap.txt">
                Download controlmap.txt
            </a>
            <h3>{file.name}</h3>
            <div onChange={e => setMode((e.target as any).value)}>
                <label>Show Bindings For:&nbsp;</label>
                <label><input type="radio" value="kbm" checked={mode === 'kbm'} />Keyboard and Mouse</label>
                <label><input type="radio" value="pad" checked={mode === 'pad'} />Gamepad</label>
                <label><input type="radio" value="all" checked={mode === 'all'} />All</label>
            </div>
            <div>
                <label><input type="checkbox" checked={showFlags} onChange={e => setShowFlags(e.target.checked)} />&nbsp;Show Other Flags</label>
            </div>
            <table>
                <tr>
                    <th></th>
                    <th></th>
                    <th colSpan={mode === 'all' ? 3 : mode === 'kbm' ? 2 : 1}>Bindings</th>
                    {showFlags ? <>
                        <th colSpan={3}>Remappable?</th>
                        <th colSpan={8}>Flags</th>
                    </> : null}
                </tr>
                <tr>
                    <th>Binding Group</th>
                    <th>Binding Name</th>
                    {mode === 'all' || mode === 'kbm' ? <>
                        <th>Keyboard</th>
                        <th>Mouse</th>
                    </> : null}
                    {mode === 'all' || mode === 'pad' ? <>
                        <th>Gamepad</th>
                    </> : null}
                    {showFlags ? <>
                        <th>Keyboard</th>
                        <th>Mouse</th>
                        <th>Gamepad</th>
                        <th title="Movement">M*</th>
                        <th title="Look">L*</th>
                        <th title="Activate">A*</th>
                        <th title="Interface">I*</th>
                        <th title="Debug">D*</th>
                        <th title="Zoom">Z*</th>
                        <th title="Combat">C*</th>
                        <th title="Sneak">S*</th>
                    </> : null}
                </tr>
                {file.groups.map((g, i) => <React.Fragment key={g.name}>
                    {g.bindings.map((b, j) => <tr key={g.name + '_' + b.name}>
                        <td>{g.name}</td>
                        <td>{b.name}</td>
                        {mode === 'all' || mode === 'kbm' ? <>
                            <td><BindingValueCell v={b.codes.keyboard} type="keyboard" aliases={aliases} onChange={v => setBindingValue('keyboard', v, j, i)} /></td>
                            <td><BindingValueCell v={b.codes.mouse} type="mouse" aliases={aliases} onChange={v => setBindingValue('mouse', v, j, i)} /></td>
                        </> : null}
                        {mode === 'all' || mode === 'pad' ? <>
                            <td><BindingValueCell v={b.codes.gamepad} type="gamepad" aliases={aliases} onChange={v => setBindingValue('gamepad', v, j, i)} /></td>
                        </> : null}
                        {showFlags ? <>
                            <td><input type="checkbox" checked={b.remappable.keyboard} onChange={e => setRemappable('keyboard', e.target.checked, j, i)} /></td>
                            <td><input type="checkbox" checked={b.remappable.mouse} onChange={e => setRemappable('mouse', e.target.checked, j, i)} /></td>
                            <td><input type="checkbox" checked={b.remappable.gamepad} onChange={e => setRemappable('gamepad', e.target.checked, j, i)} /></td>
                            <td><input type="checkbox" checked={getBit(b.flags, 0)} onChange={e => setFlagBit(0, e.target.checked, j, i)} /></td>
                            <td><input type="checkbox" checked={getBit(b.flags, 1)} onChange={e => setFlagBit(1, e.target.checked, j, i)} /></td>
                            <td><input type="checkbox" checked={getBit(b.flags, 2)} onChange={e => setFlagBit(2, e.target.checked, j, i)} /></td>
                            <td><input type="checkbox" checked={getBit(b.flags, 3)} onChange={e => setFlagBit(3, e.target.checked, j, i)} /></td>
                            <td><input type="checkbox" checked={getBit(b.flags, 4)} onChange={e => setFlagBit(4, e.target.checked, j, i)} /></td>
                            <td><input type="checkbox" checked={getBit(b.flags, 5)} onChange={e => setFlagBit(5, e.target.checked, j, i)} /></td>
                            <td><input type="checkbox" checked={getBit(b.flags, 6)} onChange={e => setFlagBit(6, e.target.checked, j, i)} /></td>
                            <td><input type="checkbox" checked={getBit(b.flags, 7)} onChange={e => setFlagBit(7, e.target.checked, j, i)} /></td>
                        </> : null}
                    </tr>)}
                </React.Fragment>)}
            </table>
            <pre>{downloadUrl.substring('data:,'.length)}</pre>
        </> : null}
    </>
}

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
