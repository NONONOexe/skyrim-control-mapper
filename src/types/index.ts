export interface BindingFile {
    name: string;
    groups: BindingGroup[];
}

export interface BindingGroup {
    name: string;
    bindings: Binding[];
}

export type BindingValue =
    | { type: "none" }
    | { type: "code"; code: number }
    | { type: "alias"; alias: string }
    | { type: "and"; and: BindingValue[] }
    | { type: "or"; or: BindingValue[] };

export type CodeType = "keyboard" | "mouse" | "gamepad";

export interface Binding {
    name: string;
    codes: {
        keyboard: BindingValue;
        mouse: BindingValue;
        gamepad: BindingValue;
    };
    remappable: {
        keyboard: boolean;
        mouse: boolean;
        gamepad: boolean;
    };
    flags: number;
}

export interface StoredState {
    file: BindingFile | null;
    mode: "kbm" | "pad" | "all";
    showFlags: boolean;
    originalFileContent: string | null;
}

export interface UploadControlmapSectionProps {
    onUpload: (file: File | null | undefined) => Promise<void>;
    loadDefaults: (keyToLoad: string) => Promise<void>;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export interface DownloadControlmapSectionProps {
    file: BindingFile | null;
    downloadUrl: string;
    originalFileContent: string | null;
}

export interface ModifySettingsSectionProps {
    file: BindingFile;
    mode: StoredState["mode"];
    setMode: (mode: StoredState["mode"]) => void;
    showFlags: StoredState["showFlags"];
    setShowFlags: (showFlags: StoredState["showFlags"]) => void;
    aliases: Record<string, string[]>;
    setBindingValue: (
        type: CodeType,
        value: BindingValue,
        bindingIndex: number,
        groupIndex: number
    ) => void;
    setRemappable: (
        type: CodeType,
        checked: boolean,
        bindingIndex: number,
        groupIndex: number
    ) => void;
    setFlagBit: (
        bit: number,
        checked: boolean,
        bindingIndex: number,
        groupIndex: number
    ) => void;
}
