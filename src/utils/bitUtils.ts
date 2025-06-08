export function setBit(f: number, b: number, v: boolean): number {
    return getBit(f, b) === v ? f : (f ^= 1 << b);
}

export function getBit(f: number, b: number): boolean {
    return (f & (1 << b)) !== 0;
}
