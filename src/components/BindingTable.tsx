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
        <TableContainer
            component={Paper}
            sx={{ height: "100%", overflowY: "auto" }}
        >
            <Table stickyHeader sx={{ padding: "0 40px" }}>
                <TableHead>
                    <TableRow>
                        <TableCell
                            sx={{
                                fontWeight: "800",
                                width: "100px",
                                minWidth: "100px",
                            }}
                        >
                            Binding Name
                        </TableCell>
                        {mode === "all" || mode === "kbm" ? (
                            <>
                                <TableCell sx={{ fontWeight: "800" }}>
                                    Keyboard
                                </TableCell>
                                <TableCell sx={{ fontWeight: "800" }}>
                                    Mouse
                                </TableCell>
                            </>
                        ) : null}
                        {mode === "all" || mode === "pad" ? (
                            <>
                                <TableCell sx={{ fontWeight: "800" }}>
                                    Gamepad
                                </TableCell>
                            </>
                        ) : null}
                        {showFlags ? (
                            <>
                                <TableCell
                                    align="center"
                                    sx={{
                                        fontWeight: "800",
                                        width: "80px",
                                        minWidth: "80px",
                                    }}
                                >
                                    Keyboard
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{
                                        fontWeight: "800",
                                        width: "80px",
                                        minWidth: "80px",
                                    }}
                                >
                                    Mouse
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{
                                        fontWeight: "800",
                                        width: "80px",
                                        minWidth: "80px",
                                    }}
                                >
                                    Gamepad
                                </TableCell>
                                <TableCell
                                    align="center"
                                    title="Movement"
                                    sx={{ fontWeight: "800" }}
                                >
                                    M*
                                </TableCell>
                                <TableCell
                                    align="center"
                                    title="Look"
                                    sx={{ fontWeight: "800" }}
                                >
                                    L*
                                </TableCell>
                                <TableCell
                                    align="center"
                                    title="Activate"
                                    sx={{ fontWeight: "800" }}
                                >
                                    A*
                                </TableCell>
                                <TableCell
                                    align="center"
                                    title="Interface"
                                    sx={{ fontWeight: "800" }}
                                >
                                    I*
                                </TableCell>
                                <TableCell
                                    align="center"
                                    title="Debug"
                                    sx={{ fontWeight: "800" }}
                                >
                                    D*
                                </TableCell>
                                <TableCell
                                    align="center"
                                    title="Zoom"
                                    sx={{ fontWeight: "800" }}
                                >
                                    Z*
                                </TableCell>
                                <TableCell
                                    align="center"
                                    title="Combat"
                                    sx={{ fontWeight: "800" }}
                                >
                                    C*
                                </TableCell>
                                <TableCell
                                    align="center"
                                    title="Sneak"
                                    sx={{ fontWeight: "800" }}
                                >
                                    S*
                                </TableCell>
                            </>
                        ) : null}
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {group.bindings.map((b, j) => (
                        <TableRow key={group.name + "_" + b.name}>
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
                                    <TableCell align="center">
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
                                    <TableCell align="center">
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
                                    <TableCell align="center">
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
                                            <TableCell
                                                key={bitIndex}
                                                align="center"
                                            >
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
