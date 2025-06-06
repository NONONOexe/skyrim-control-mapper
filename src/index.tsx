import React from 'react'
import { createRoot } from 'react-dom/client';
import { Button } from '@mui/material';
import { BindingFile, BindingGroup, BindingValue, Binding, StoredState } from './types';
import { parseBindingFile } from './utils/parseUtils';
import { standardFileHeader, LOCAL_STORAGE_KEY, DEFAULTS_KEYS } from './constants';
import { printBindingFile } from './utils/printUtils';
import { setBit, getBit } from './utils/bitUtils';
import { BindingValueCell } from './components/BindingValueCell';

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
        const assetBasePath = import.meta.env.DEV
            ? '/'
            : import.meta.env.BASE_URL;
        const res = await fetch(`${assetBasePath}defaults/${defaultsKey}.txt`)
        const text = await res.text()
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
        <Button variant="contained" onClick={async () => loadDefaults()}>
            Load Defaults
        </Button>
        <br />
        {file ? <>
            <Button variant="contained" href={downloadUrl} download="controlmap.txt">
                Download controlmap.txt
            </Button>
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
