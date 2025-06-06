import React from "react";
import { createRoot } from "react-dom/client";
import { Button } from "@mui/material";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    RadioGroup,
    FormControlLabel,
    Radio,
    Checkbox,
    FormLabel,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
} from "@mui/material";
import { DEFAULTS_KEYS } from "./constants";
import { getBit } from "./utils/bitUtils";
import { BindingValueCell } from "./components/BindingValueCell";
import { useControlMapper } from "./hooks/useControlMapper";

function App() {
    const {
        file,
        mode,
        setMode,
        showFlags,
        setShowFlags,
        defaultsKey,
        setDefaultsKey,
        onUpload,
        loadDefaults,
        setBindingValue,
        setRemappable,
        setFlagBit,
        aliases,
        downloadUrl,
    } = useControlMapper();

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            <Button
                variant="contained"
                component="label"
                onClick={handleFileButtonClick}
            >
                Upload controlmap.txt
                <input
                    type="file"
                    accept=".txt"
                    hidden
                    onChange={async (e) => onUpload(e.target.files?.item(0))}
                    ref={fileInputRef}
                />
            </Button>
            <br />
            <FormControl sx={{ minWidth: 200, mt: 2 }}>
                <InputLabel id="defaults-select-label">
                    Load Defaults
                </InputLabel>
                <Select
                    labelId="defaults-select-label"
                    id="defaults-select"
                    value={defaultsKey}
                    label="Load Defaults"
                    onChange={(e) => setDefaultsKey(e.target.value as string)}
                >
                    {DEFAULTS_KEYS.map((k) => (
                        <MenuItem key={k} value={k}>
                            {k}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button
                variant="contained"
                onClick={async () => loadDefaults()}
                sx={{ mt: 2, ml: 2 }}
            >
                Load Defaults
            </Button>
            <br />
            {file ? (
                <>
                    <Button
                        variant="contained"
                        href={downloadUrl}
                        download="controlmap.txt"
                        sx={{ mt: 2 }}
                    >
                        Download controlmap.txt
                    </Button>
                    <h3>{file.name}</h3>
                    <FormControl component="fieldset" sx={{ mt: 2 }}>
                        <FormLabel component="legend">
                            Show Bindings For:
                        </FormLabel>
                        <RadioGroup
                            row
                            value={mode}
                            onChange={(e) =>
                                setMode(e.target.value as "kbm" | "pad" | "all")
                            }
                        >
                            <FormControlLabel
                                value="kbm"
                                control={<Radio />}
                                label="Keyboard and Mouse"
                            />
                            <FormControlLabel
                                value="pad"
                                control={<Radio />}
                                label="Gamepad"
                            />
                            <FormControlLabel
                                value="all"
                                control={<Radio />}
                                label="All"
                            />
                        </RadioGroup>
                    </FormControl>
                    <div>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={showFlags}
                                    onChange={(e) =>
                                        setShowFlags(e.target.checked)
                                    }
                                />
                            }
                            label="Show Other Flags"
                        />
                    </div>
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table
                            sx={{ minWidth: 650 }}
                            aria-label="binding table"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell
                                        colSpan={
                                            mode === "all"
                                                ? 3
                                                : mode === "kbm"
                                                  ? 2
                                                  : 1
                                        }
                                    >
                                        Bindings
                                    </TableCell>
                                    {showFlags ? (
                                        <>
                                            <TableCell colSpan={3}>
                                                Remappable?
                                            </TableCell>
                                            <TableCell colSpan={8}>
                                                Flags
                                            </TableCell>
                                        </>
                                    ) : null}
                                </TableRow>
                                <TableRow>
                                    <TableCell>Binding Group</TableCell>
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
                                            <TableCell title="Movement">
                                                M*
                                            </TableCell>
                                            <TableCell title="Look">
                                                L*
                                            </TableCell>
                                            <TableCell title="Activate">
                                                A*
                                            </TableCell>
                                            <TableCell title="Interface">
                                                I*
                                            </TableCell>
                                            <TableCell title="Debug">
                                                D*
                                            </TableCell>
                                            <TableCell title="Zoom">
                                                Z*
                                            </TableCell>
                                            <TableCell title="Combat">
                                                C*
                                            </TableCell>
                                            <TableCell title="Sneak">
                                                S*
                                            </TableCell>
                                        </>
                                    ) : null}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {file.groups.map((g, i) => (
                                    <React.Fragment key={g.name}>
                                        {g.bindings.map((b, j) => (
                                            <TableRow
                                                key={g.name + "_" + b.name}
                                            >
                                                <TableCell>{g.name}</TableCell>
                                                <TableCell>{b.name}</TableCell>
                                                {mode === "all" ||
                                                mode === "kbm" ? (
                                                    <>
                                                        <TableCell>
                                                            <BindingValueCell
                                                                v={
                                                                    b.codes
                                                                        .keyboard
                                                                }
                                                                type="keyboard"
                                                                aliases={
                                                                    aliases
                                                                }
                                                                onChange={(v) =>
                                                                    setBindingValue(
                                                                        "keyboard",
                                                                        v,
                                                                        j,
                                                                        i
                                                                    )
                                                                }
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <BindingValueCell
                                                                v={
                                                                    b.codes
                                                                        .mouse
                                                                }
                                                                type="mouse"
                                                                aliases={
                                                                    aliases
                                                                }
                                                                onChange={(v) =>
                                                                    setBindingValue(
                                                                        "mouse",
                                                                        v,
                                                                        j,
                                                                        i
                                                                    )
                                                                }
                                                            />
                                                        </TableCell>
                                                    </>
                                                ) : null}
                                                {mode === "all" ||
                                                mode === "pad" ? (
                                                    <>
                                                        <TableCell>
                                                            <BindingValueCell
                                                                v={
                                                                    b.codes
                                                                        .gamepad
                                                                }
                                                                type="gamepad"
                                                                aliases={
                                                                    aliases
                                                                }
                                                                onChange={(v) =>
                                                                    setBindingValue(
                                                                        "gamepad",
                                                                        v,
                                                                        j,
                                                                        i
                                                                    )
                                                                }
                                                            />
                                                        </TableCell>
                                                    </>
                                                ) : null}
                                                {showFlags ? (
                                                    <>
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={
                                                                    b.remappable
                                                                        .keyboard
                                                                }
                                                                onChange={(e) =>
                                                                    setRemappable(
                                                                        "keyboard",
                                                                        e.target
                                                                            .checked,
                                                                        j,
                                                                        i
                                                                    )
                                                                }
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={
                                                                    b.remappable
                                                                        .mouse
                                                                }
                                                                onChange={(e) =>
                                                                    setRemappable(
                                                                        "mouse",
                                                                        e.target
                                                                            .checked,
                                                                        j,
                                                                        i
                                                                    )
                                                                }
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={
                                                                    b.remappable
                                                                        .gamepad
                                                                }
                                                                onChange={(e) =>
                                                                    setRemappable(
                                                                        "gamepad",
                                                                        e.target
                                                                            .checked,
                                                                        j,
                                                                        i
                                                                    )
                                                                }
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={getBit(
                                                                    b.flags,
                                                                    0
                                                                )}
                                                                onChange={(e) =>
                                                                    setFlagBit(
                                                                        0,
                                                                        e.target
                                                                            .checked,
                                                                        j,
                                                                        i
                                                                    )
                                                                }
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={getBit(
                                                                    b.flags,
                                                                    1
                                                                )}
                                                                onChange={(e) =>
                                                                    setFlagBit(
                                                                        1,
                                                                        e.target
                                                                            .checked,
                                                                        j,
                                                                        i
                                                                    )
                                                                }
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={getBit(
                                                                    b.flags,
                                                                    2
                                                                )}
                                                                onChange={(e) =>
                                                                    setFlagBit(
                                                                        2,
                                                                        e.target
                                                                            .checked,
                                                                        j,
                                                                        i
                                                                    )
                                                                }
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={getBit(
                                                                    b.flags,
                                                                    3
                                                                )}
                                                                onChange={(e) =>
                                                                    setFlagBit(
                                                                        3,
                                                                        e.target
                                                                            .checked,
                                                                        j,
                                                                        i
                                                                    )
                                                                }
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={getBit(
                                                                    b.flags,
                                                                    4
                                                                )}
                                                                onChange={(e) =>
                                                                    setFlagBit(
                                                                        4,
                                                                        e.target
                                                                            .checked,
                                                                        j,
                                                                        i
                                                                    )
                                                                }
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={getBit(
                                                                    b.flags,
                                                                    5
                                                                )}
                                                                onChange={(e) =>
                                                                    setFlagBit(
                                                                        5,
                                                                        e.target
                                                                            .checked,
                                                                        j,
                                                                        i
                                                                    )
                                                                }
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={getBit(
                                                                    b.flags,
                                                                    6
                                                                )}
                                                                onChange={(e) =>
                                                                    setFlagBit(
                                                                        6,
                                                                        e.target
                                                                            .checked,
                                                                        j,
                                                                        i
                                                                    )
                                                                }
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={getBit(
                                                                    b.flags,
                                                                    7
                                                                )}
                                                                onChange={(e) =>
                                                                    setFlagBit(
                                                                        7,
                                                                        e.target
                                                                            .checked,
                                                                        j,
                                                                        i
                                                                    )
                                                                }
                                                            />
                                                        </TableCell>
                                                    </>
                                                ) : null}
                                            </TableRow>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <pre>{downloadUrl.substring("data:,".length)}</pre>
                </>
            ) : null}
        </>
    );
}

const container = document.getElementById("root");
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
