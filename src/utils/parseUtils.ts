import { BindingValue, BindingGroup, Binding, BindingFile } from "../types";

export function parseNumber(s: string): number {
    return s.startsWith("0x") ? parseInt(s.substring(2), 16) : parseInt(s, 10);
}

export function parseBoolean(s: string): boolean {
    return s === "1";
}

export function parseToken(s: string, ptr: { x: number }) {
    const commaIndex = s.indexOf(",", ptr.x);
    const plusIndex = s.indexOf("+", ptr.x);
    const end = Math.min(
        commaIndex >= 0 ? commaIndex : Infinity,
        plusIndex >= 0 ? plusIndex : Infinity,
        s.length
    );
    const token = s.substring(ptr.x, end);
    ptr.x = end;
    return token;
}

export function parseSimpleBindingValue(
    s: string,
    ptr: { x: number }
): BindingValue {
    let left: BindingValue;
    if (s.substring(ptr.x, ptr.x + 3) === "!0,") {
        ptr.x += 3;
        const alias = parseToken(s, ptr);
        left = { type: "alias", alias };
    } else if (s.substring(ptr.x, ptr.x + 2) === "0x") {
        const code = parseNumber(parseToken(s, ptr));
        if (code === 0xff) left = { type: "none" };
        else left = { type: "code", code };
    } else {
        left = { type: "none" };
    }
    return left;
}

export function parseComplexBindingValue(
    left: BindingValue,
    s: string,
    ptr: { x: number }
): BindingValue {
    if (s[ptr.x] === ",") {
        const or: BindingValue[] = [left];
        while (s[ptr.x] === ",") {
            ptr.x++;
            const right = parseBindingValue(s, ptr);
            if (right.type === "or") or.push(...right.or);
            else or.push(right);
        }
        return { type: "or", or };
    } else if (s[ptr.x] === "+") {
        let newParent: BindingValue | null = null;
        const and: BindingValue[] = [left];
        while (s[ptr.x] === "+") {
            ptr.x++;
            const right = parseBindingValue(s, ptr);
            if (right.type === "or") {
                newParent = right;
                and.push(right.or[0]);
            } else if (right.type === "and") and.push(...right.and);
            else and.push(right);
        }
        if (newParent) {
            newParent.or[0] = { type: "and", and };
            return newParent;
        }
        return { type: "and", and };
    } else {
        return left;
    }
}

export function parseBindingValue(s: string, ptr: { x: number }): BindingValue {
    const left = parseSimpleBindingValue(s, ptr);
    const right = parseComplexBindingValue(left, s, ptr);
    return right;
}

export function parseBinding(s: string): Binding {
    const args = s.split(/\t+/);
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
        flags: parseNumber(args[7] ?? "0"),
    };
}

export function parseBindingGroup(
    lines: string[],
    ptr: { y: number }
): BindingGroup {
    const name = lines[ptr.y - 1].substring(3).trim();
    const bindings: Binding[] = [];
    while (ptr.y < lines.length && lines[ptr.y].trim()) {
        const binding = parseBinding(lines[ptr.y++]);
        bindings.push(binding);
    }
    return { name, bindings };
}

export function parseBindingFile(s: string, name: string): BindingFile {
    const lines = s.split(/\r?\n/);
    const ptr = { y: 0 };
    const groups: BindingGroup[] = [];
    while (
        ptr.y < lines.length &&
        (!lines[ptr.y].trim() || lines[ptr.y].startsWith("//"))
    )
        ptr.y++;
    while (ptr.y < lines.length) {
        groups.push(parseBindingGroup(lines, ptr));
        while (
            ptr.y < lines.length &&
            (!lines[ptr.y].trim() || lines[ptr.y].startsWith("//"))
        )
            ptr.y++;
    }
    return { name, groups };
}
