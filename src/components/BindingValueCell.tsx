import React from "react";
import { BindingValue } from "../types";
import { codes } from "../constants/inputCodes";
import { parseNumber } from "../utils/parseUtils";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import Box from "@mui/material/Box";

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
        <Box sx={{ display: "flex", alignItems: "center", flexWrap: "nowrap" }}>
            <FormControl
                variant="standard"
                sx={{
                    minWidth: 0,
                    whiteSpace: "nowrap",
                    marginRight: 1,
                    flexShrink: 1,
                    flexGrow: 0,
                }}
            >
                <Select
                    value={v.type}
                    onChange={(e: SelectChangeEvent<string>) =>
                        onChangeType(e.target.value as string)
                    }
                    sx={{ minWidth: 0 }}
                >
                    <MenuItem value="none">None</MenuItem>
                    <MenuItem value="code">Code</MenuItem>
                    <MenuItem value="alias">Alias</MenuItem>
                    <MenuItem value="and">All Of</MenuItem>
                    <MenuItem value="or">Any Of</MenuItem>
                </Select>
            </FormControl>
            {v.type === "code" ? (
                <FormControl
                    variant="standard"
                    sx={{
                        minWidth: 0,
                        whiteSpace: "nowrap",
                        marginRight: 1,
                        flexShrink: 1,
                        flexGrow: 0,
                    }}
                >
                    <Select
                        value={String(v.code)}
                        onChange={(e: SelectChangeEvent<string>) =>
                            onChangeCode(parseNumber(e.target.value as string))
                        }
                        sx={{ minWidth: 0 }}
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
                <FormControl
                    variant="standard"
                    sx={{
                        minWidth: 0,
                        whiteSpace: "nowrap",
                        marginRight: 1,
                        flexShrink: 1,
                        flexGrow: 0,
                    }}
                >
                    <Select
                        value={v.alias}
                        onChange={(e: SelectChangeEvent<string>) =>
                            onChangeAlias(e.target.value as string)
                        }
                        sx={{ minWidth: 0 }}
                    >
                        {Object.keys(aliases).map((k) => [
                            <MenuItem
                                key={k}
                                disabled
                                sx={{ fontWeight: "bold" }}
                            >
                                {k}
                            </MenuItem>,
                            ...aliases[k].map((a) => (
                                <MenuItem key={a} value={a}>
                                    {a}
                                </MenuItem>
                            )),
                        ])}
                    </Select>
                </FormControl>
            ) : null}
            {v.type === "and" ? (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "nowrap",
                        whiteSpace: "nowrap",
                        marginRight: 1,
                        flexShrink: 1,
                        flexGrow: 0,
                    }}
                >
                    (
                    {v.and.map((o, i) => (
                        <Box
                            key={i}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                whiteSpace: "nowrap",
                                marginRight: 1,
                                flexShrink: 1,
                                flexGrow: 0,
                            }}
                        >
                            {i > 0 ? <>,&nbsp;</> : null}
                            <BindingValueCell
                                v={o}
                                type={type}
                                aliases={aliases}
                                onChange={(o) => onChangeAnd(o, i)}
                            />
                            <IconButton
                                onClick={() => onDeleteAnd(i)}
                                size="small"
                                sx={{ marginRight: 1 }}
                            >
                                <RemoveCircleOutlineIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    ))}
                    ,{" "}
                    <IconButton onClick={() => onAppendAnd()} size="small">
                        <AddCircleOutlineIcon fontSize="small" />
                    </IconButton>
                    )
                </Box>
            ) : null}
            {v.type === "or" ? (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "nowrap",
                        whiteSpace: "nowrap",
                        marginRight: 1,
                        flexShrink: 1,
                        flexGrow: 0,
                    }}
                >
                    (
                    {v.or.map((o, i) => (
                        <Box
                            key={i}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                whiteSpace: "nowrap",
                                marginRight: 1,
                                flexShrink: 1,
                                flexGrow: 0,
                            }}
                        >
                            {i > 0 ? <>,&nbsp;</> : null}
                            <BindingValueCell
                                v={o}
                                type={type}
                                aliases={aliases}
                                onChange={(o) => onChangeOr(o, i)}
                            />
                            <IconButton
                                onClick={() => onDeleteOr(i)}
                                size="small"
                                sx={{ marginRight: 1 }}
                            >
                                <RemoveCircleOutlineIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    ))}
                    ,{" "}
                    <IconButton onClick={() => onAppendOr()} size="small">
                        <AddCircleOutlineIcon fontSize="small" />
                    </IconButton>
                    )
                </Box>
            ) : null}
        </Box>
    );
}
