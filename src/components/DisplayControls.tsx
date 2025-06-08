import React from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Checkbox from "@mui/material/Checkbox";
import Stack from "@mui/material/Stack";

interface DisplayControlsProps {
    mode: "kbm" | "pad" | "all";
    setMode: (mode: "kbm" | "pad" | "all") => void;
    showFlags: boolean;
    setShowFlags: (show: boolean) => void;
}

export const DisplayControls: React.FC<DisplayControlsProps> = ({
    mode,
    setMode,
    showFlags,
    setShowFlags,
}) => {
    return (
        <Stack direction="row" alignItems="center" spacing={2}>
            <FormControl component="fieldset">
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
            <FormControlLabel
                control={
                    <Checkbox
                        checked={showFlags}
                        onChange={(e) => setShowFlags(e.target.checked)}
                    />
                }
                label="Show Other Flags"
            />
        </Stack>
    );
};
