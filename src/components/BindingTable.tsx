import React from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { BindingFile, CodeType, BindingValue, BindingGroup } from "../types";
import { BindingValueCell } from "./BindingValueCell";
import { getBit } from "../utils/bitUtils";

interface BindingTableProps {
    group: BindingGroup;
    mode: "kbm" | "pad" | "all";
    showFlags: boolean;
    aliases: Record<string, string[]>;
    setBindingValue: (
        type: CodeType,
        value: BindingValue,
        bindingIndex: number
    ) => void;
    setRemappable: (
        type: CodeType,
        checked: boolean,
        bindingIndex: number
    ) => void;
    setFlagBit: (bit: number, checked: boolean, bindingIndex: number) => void;
}

export const BindingTable: React.FC<BindingTableProps> = ({
    group,
    mode,
    showFlags,
    aliases,
    setBindingValue,
    setRemappable,
    setFlagBit,
}) => {
    return (
        <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
            <Table stickyHeader aria-label="binding table">
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell
                            colSpan={
                                mode === "all" ? 3 : mode === "kbm" ? 2 : 1
                            }
                        >
                            Bindings
                        </TableCell>
                        {showFlags ? (
                            <>
                                <TableCell colSpan={3}>Remappable?</TableCell>
                                <TableCell colSpan={8}>Flags</TableCell>
                            </>
                        ) : null}
                    </TableRow>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>Binding Name</TableCell>
                        {mode === "all" || mode === "kbm" ? (
                            <>
                                <TableCell>Keyboard</TableCell>
                                <TableCell>Mouse</TableCell>
                            </>
                        ) : null}
                        {mode === "all" || mode === "pad" ? (
                            <>
                                <TableCell>Gamepad</TableCell>
                            </>
                        ) : null}
                        {showFlags ? (
                            <>
                                <TableCell>Keyboard</TableCell>
                                <TableCell>Mouse</TableCell>
                                <TableCell>Gamepad</TableCell>
                                <TableCell title="Movement">M*</TableCell>
                                <TableCell title="Look">L*</TableCell>
                                <TableCell title="Activate">A*</TableCell>
                                <TableCell title="Interface">I*</TableCell>
                                <TableCell title="Debug">D*</TableCell>
                                <TableCell title="Zoom">Z*</TableCell>
                                <TableCell title="Combat">C*</TableCell>
                                <TableCell title="Sneak">S*</TableCell>
                            </>
                        ) : null}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {group.bindings.map((b, j) => (
                        <TableRow key={group.name + "_" + b.name}>
                            <TableCell></TableCell>
                            <TableCell>{b.name}</TableCell>
                            {mode === "all" || mode === "kbm" ? (
                                <>
                                    <TableCell>
                                        <BindingValueCell
                                            v={b.codes.keyboard}
                                            type="keyboard"
                                            aliases={aliases}
                                            onChange={(v) =>
                                                setBindingValue(
                                                    "keyboard",
                                                    v,
                                                    j
                                                )
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <BindingValueCell
                                            v={b.codes.mouse}
                                            type="mouse"
                                            aliases={aliases}
                                            onChange={(v) =>
                                                setBindingValue("mouse", v, j)
                                            }
                                        />
                                    </TableCell>
                                </>
                            ) : null}
                            {mode === "all" || mode === "pad" ? (
                                <>
                                    <TableCell>
                                        <BindingValueCell
                                            v={b.codes.gamepad}
                                            type="gamepad"
                                            aliases={aliases}
                                            onChange={(v) =>
                                                setBindingValue("gamepad", v, j)
                                            }
                                        />
                                    </TableCell>
                                </>
                            ) : null}
                            {showFlags ? (
                                <>
                                    <TableCell>
                                        <Checkbox
                                            checked={b.remappable.keyboard}
                                            onChange={(e) =>
                                                setRemappable(
                                                    "keyboard",
                                                    e.target.checked,
                                                    j
                                                )
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Checkbox
                                            checked={b.remappable.mouse}
                                            onChange={(e) =>
                                                setRemappable(
                                                    "mouse",
                                                    e.target.checked,
                                                    j
                                                )
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Checkbox
                                            checked={b.remappable.gamepad}
                                            onChange={(e) =>
                                                setRemappable(
                                                    "gamepad",
                                                    e.target.checked,
                                                    j
                                                )
                                            }
                                        />
                                    </TableCell>
                                    {Array.from({ length: 8 }).map(
                                        (_, bitIndex) => (
                                            <TableCell key={bitIndex}>
                                                <Checkbox
                                                    checked={getBit(
                                                        b.flags,
                                                        bitIndex
                                                    )}
                                                    onChange={(e) =>
                                                        setFlagBit(
                                                            bitIndex,
                                                            e.target.checked,
                                                            j
                                                        )
                                                    }
                                                />
                                            </TableCell>
                                        )
                                    )}
                                </>
                            ) : null}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
