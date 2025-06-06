import React from "react";
import {
    BindingFile,
    BindingGroup,
    Binding,
    StoredState,
    BindingValue,
} from "../types";
import { parseBindingFile } from "../utils/parseUtils";
import { setBit } from "../utils/bitUtils";
import {
    LOCAL_STORAGE_KEY,
    DEFAULT_NEW_FORMAT_OPTION,
    DEFAULT_OLD_FORMAT_OPTION,
} from "../constants";
import { printBindingFile } from "../utils/printUtils";

export function useControlMapper() {
    const [file, setFile] = React.useState<BindingFile | null>(null);
    const [mode, setMode] = React.useState<"kbm" | "pad" | "all">("pad");
    const [showFlags, setShowFlags] = React.useState(false);
    const [defaultsKey, setDefaultsKey] = React.useState(
        DEFAULT_NEW_FORMAT_OPTION.filename
    );

    React.useEffect(() => {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
            const data = JSON.parse(stored) as StoredState;
            setFile(data.file);
            setMode(data.mode);
            setShowFlags(data.showFlags);
        }
    }, []);

    React.useEffect(() => {
        const state: StoredState = {
            file,
            mode,
            showFlags,
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    }, [file, mode, showFlags]);

    const onUpload = async (f?: File | null) => {
        const s = await f?.text();
        if (!f || !s) return;
        const file = parseBindingFile(s, f.name);
        setFile(file);
    };

    const loadDefaults = async (keyToLoad?: string) => {
        const assetBasePath = import.meta.env.DEV
            ? "/"
            : import.meta.env.BASE_URL;
        console.log(`import.meta.env.DEV: ${import.meta.env.DEV}`);
        console.log(`import.meta.env.BASE_URL: ${import.meta.env.BASE_URL}`);
        const targetKey = keyToLoad ?? defaultsKey;
        const allDefaultOptions = [
            DEFAULT_NEW_FORMAT_OPTION,
            DEFAULT_OLD_FORMAT_OPTION,
        ];
        const selectedOption = allDefaultOptions.find(
            (option) => option.filename === targetKey
        );
        if (!selectedOption) {
            console.error("Selected default option not found.");
            return;
        }
        const url = `${assetBasePath}defaults/${selectedOption.filename}.txt`;
        console.log(`Attempting to fetch URL: ${url}`);
        const res = await fetch(url);
        const text = await res.text();
        const file = parseBindingFile(text, selectedOption.filename);
        setFile(file);
        setDefaultsKey(targetKey);
    };

    const setGroup = (g: Partial<BindingGroup>, i: number) => {
        if (!file) return;
        setFile({
            ...file,
            groups: [
                ...file.groups.slice(0, i),
                { ...file.groups[i], ...g },
                ...file.groups.slice(i + 1),
            ],
        });
    };

    const setBinding = (b: Partial<Binding>, j: number, i: number) => {
        if (!file) return;
        const g = file.groups[i];
        setGroup(
            {
                ...g,
                bindings: [
                    ...g.bindings.slice(0, j),
                    { ...g.bindings[j], ...b },
                    ...g.bindings.slice(j + 1),
                ],
            },
            i
        );
    };

    const setBindingValue = (
        type: "keyboard" | "mouse" | "gamepad",
        value: BindingValue,
        j: number,
        i: number
    ) => {
        if (!file) return;
        setBinding(
            {
                codes: {
                    ...file.groups[i].bindings[j].codes,
                    [type]: value,
                },
            },
            j,
            i
        );
    };

    const setRemappable = (
        type: "keyboard" | "mouse" | "gamepad",
        value: boolean,
        j: number,
        i: number
    ) => {
        if (!file) return;
        setBinding(
            {
                remappable: {
                    ...file.groups[i].bindings[j].remappable,
                    [type]: value,
                },
            },
            j,
            i
        );
    };

    const setFlagBit = (bit: number, value: boolean, j: number, i: number) => {
        if (!file) return;
        setBinding(
            {
                flags: setBit(file.groups[i].bindings[j].flags, bit, value),
            },
            j,
            i
        );
    };

    const aliases =
        file?.groups.reduce(
            (p, g) => ({ ...p, [g.name]: g.bindings.map((b) => b.name) }),
            {} as Record<string, string[]>
        ) ?? {};

    const downloadUrl = file ? "data:," + printBindingFile(file) : "data:,";

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    return {
        file,
        setFile,
        mode,
        setMode,
        showFlags,
        setShowFlags,
        defaultsKey,
        setDefaultsKey,
        onUpload,
        loadDefaults,
        setGroup,
        setBinding,
        setBindingValue,
        setRemappable,
        setFlagBit,
        aliases,
        downloadUrl,
        fileInputRef,
    };
}
