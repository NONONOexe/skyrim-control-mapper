import { BindingFile, BindingGroup, BindingValue, Binding } from "../types";
import { FILE_HEADER } from "../constants/controlmap";

export function printBindingFile(file: BindingFile) {
    return (
        FILE_HEADER +
        file.groups.flatMap((g) => printBindingGroup(g)).join("\r\n")
    );
}

export function printBindingGroup(group: BindingGroup) {
    const columnTabs = [
        group.bindings.map((b) => b.name),
        group.bindings.map((b) => formatBindingValue(b.codes.keyboard, 2)),
        group.bindings.map((b) => formatBindingValue(b.codes.mouse, 1)),
        group.bindings.map((b) => formatBindingValue(b.codes.gamepad, 4)),
        group.bindings.map((b) => formatBoolean(b.remappable.keyboard)),
        group.bindings.map((b) => formatBoolean(b.remappable.mouse)),
        group.bindings.map((b) => formatBoolean(b.remappable.gamepad)),
        group.bindings.map((b) => (b.flags ? formatNumber(b.flags, 1) : "")),
    ].map((c) => getColumnTabCount(c));
    return `// ${group.name}\r\n${printColumns(
        group.bindings.length,
        [
            group.bindings.map((b) => b.name),
            group.bindings.map((b) => formatBindingValue(b.codes.keyboard, 2)),
            group.bindings.map((b) => formatBindingValue(b.codes.mouse, 1)),
            group.bindings.map((b) => formatBindingValue(b.codes.gamepad, 4)),
            group.bindings.map((b) => formatBoolean(b.remappable.keyboard)),
            group.bindings.map((b) => formatBoolean(b.remappable.mouse)),
            group.bindings.map((b) => formatBoolean(b.remappable.gamepad)),
            group.bindings.map((b) =>
                b.flags ? formatNumber(b.flags, 1) : ""
            ),
        ],
        columnTabs
    )}\r\n`;
}

export function formatBindingValue(v: BindingValue, digits: number): string {
    switch (v.type) {
        case "code":
            return formatNumber(v.code, digits);
        case "alias":
            return `!0,${v.alias}`;
        case "and":
            return v.and.map((o) => formatBindingValue(o, digits)).join("+");
        case "or":
            return v.or.map((o) => formatBindingValue(o, digits)).join(",");
        case "none":
            return "0xff";
        default:
            return JSON.stringify(v);
    }
}

export function formatNumber(n: number, digits: number) {
    return `0x${n.toString(16).padStart(digits, "0")}`;
}

export function formatBoolean(b: boolean) {
    return b ? "1" : "0";
}

export function padColumnValue(value: string, tabs: number) {
    const padding = Math.ceil((tabs * 4 - value.length) / 4);
    return value + "\t".repeat(padding);
}

export function getColumnTabCount(values: string[]): number {
    const maxLength = values.reduce((p, c) => Math.max(p, c.length), 0);
    const tabs = Math.ceil((maxLength + 1) / 4);
    return tabs;
}

export function printColumns(
    count: number,
    columns: string[][],
    columnTabs: number[]
) {
    return new Array(count)
        .fill(null)
        .map((_, i) =>
            columns
                .map((c, j) => padColumnValue(c[i], columnTabs[j]))
                .join("")
                .trim()
        )
        .join("\r\n");
}
