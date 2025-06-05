import React from 'react';
import { BindingValue } from '../types';
import { codes } from '../constants';
import { parseNumber } from '../utils/parseUtils'; // parseNumber も必要になります

export function BindingValueCell({ v, type, aliases, onChange }: { v: BindingValue, type: 'keyboard' | 'mouse' | 'gamepad', aliases: Record<string, string[]>, onChange: (v: BindingValue) => void }) {

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