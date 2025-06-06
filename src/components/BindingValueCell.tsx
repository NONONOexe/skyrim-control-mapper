import React from "react";
import { BindingValue } from "../types";
import { codes } from "../constants";
import { parseNumber } from "../utils/parseUtils";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export function BindingValueCell({
    v,
    type,
    aliases,
    onChange,
}: {
    v: BindingValue;
    type: "keyboard" | "mouse" | "gamepad";
    aliases: Record<string, string[]>;
    onChange: (v: BindingValue) => void;
}) {
    const onChangeType = (type: string) => {
        switch (type) {
            case "code":
                return onChange({ type, code: 0xff });
            case "alias":
                return onChange({ type, alias: "" });
            case "and":
                return onChange({ type, and: [] });
            case "or":
                return onChange({ type, or: [] });
            case "none":
                return onChange({ type });
        }
    };

    const onChangeCode = (code: number) => {
        if (v.type !== "code") return;
        return onChange({ type: "code", code });
    };

    const onChangeAlias = (alias: string) => {
        if (v.type !== "alias") return;
        return onChange({ type: "alias", alias });
    };

    const onChangeAnd = (o: BindingValue, i: number) => {
        if (v.type !== "and") return;
        return onChange({
            type: "and",
            and: [...v.and.slice(0, i), o, ...v.and.slice(i + 1)],
        });
    };

    const onDeleteAnd = (i: number) => {
        if (v.type !== "and") return;
        return onChange({
            type: "and",
            and: [...v.and.slice(0, i), ...v.and.slice(i + 1)],
        });
    };

    const onAppendAnd = () => {
        if (v.type !== "and") return;
        return onChange({
            type: "and",
            and: [...v.and, { type: "none" }],
        });
    };

    const onChangeOr = (o: BindingValue, i: number) => {
        if (v.type !== "or") return;
        return onChange({
            type: "or",
            or: [...v.or.slice(0, i), o, ...v.or.slice(i + 1)],
        });
    };

    const onDeleteOr = (i: number) => {
        if (v.type !== "or") return;
        return onChange({
            type: "or",
            or: [...v.or.slice(0, i), ...v.or.slice(i + 1)],
        });
    };

    const onAppendOr = () => {
        if (v.type !== "or") return;
        return onChange({
            type: "or",
            or: [...v.or, { type: "none" }],
        });
    };

    return (
        <>
            <FormControl variant="standard">
                <InputLabel id={`value-type-label-${type}`}>Type</InputLabel>
                <Select
                    labelId={`value-type-label-${type}`}
                    value={v.type}
                    onChange={(e: SelectChangeEvent<string>) =>
                        onChangeType(e.target.value as string)
                    }
                    label="Type"
                >
                    <MenuItem value="none">None</MenuItem>
                    <MenuItem value="code">Code</MenuItem>
                    <MenuItem value="alias">Alias</MenuItem>
                    <MenuItem value="and">All Of</MenuItem>
                    <MenuItem value="or">Any Of</MenuItem>
                </Select>
            </FormControl>
            {v.type === "code" ? (
                <FormControl variant="standard">
                    <InputLabel id={`code-value-label-${type}`}>
                        Code
                    </InputLabel>
                    <Select
                        labelId={`code-value-label-${type}`}
                        value={String(v.code)}
                        onChange={(e: SelectChangeEvent<string>) =>
                            onChangeCode(parseNumber(e.target.value as string))
                        }
                        label="Code"
                    >
                        {Object.entries(codes[type]).map(([key, value]) => (
                            <MenuItem value={String(value)} key={value}>
                                {key}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            ) : null}
            {v.type === "alias" ? (
                <FormControl variant="standard">
                    <InputLabel id={`alias-value-label-${type}`}>
                        Alias
                    </InputLabel>
                    <Select
                        labelId={`alias-value-label-${type}`}
                        value={v.alias}
                        onChange={(e: SelectChangeEvent<string>) =>
                            onChangeAlias(e.target.value as string)
                        }
                        label="Alias"
                    >
                        {Object.keys(aliases).map((k) => (
                            <optgroup key={k} label={k}>
                                {aliases[k].map((a) => (
                                    <MenuItem key={a}>{a}</MenuItem>
                                ))}
                            </optgroup>
                        ))}
                    </Select>
                </FormControl>
            ) : null}
            {v.type === "and" ? (
                <>
                    (
                    {v.and.map((o, i) => (
                        <React.Fragment key={i}>
                            {i > 0 ? <>,&nbsp;</> : null}
                            <BindingValueCell
                                v={o}
                                type={type}
                                aliases={aliases}
                                onChange={(o) => onChangeAnd(o, i)}
                            />
                            <button onClick={() => onDeleteAnd(i)}>x</button>
                        </React.Fragment>
                    ))}
                    , <button onClick={() => onAppendAnd()}>+</button>)
                </>
            ) : null}
            {v.type === "or" ? (
                <>
                    (
                    {v.or.map((o, i) => (
                        <React.Fragment key={i}>
                            {i > 0 ? <>,&nbsp;</> : null}
                            <BindingValueCell
                                v={o}
                                type={type}
                                aliases={aliases}
                                onChange={(o) => onChangeOr(o, i)}
                            />
                            <button onClick={() => onDeleteOr(i)}>x</button>
                        </React.Fragment>
                    ))}
                    , <button onClick={() => onAppendOr()}>+</button>)
                </>
            ) : null}
        </>
    );
}
