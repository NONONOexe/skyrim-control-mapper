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
}
