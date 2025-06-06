import React from "react";
import {
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Checkbox,
} from "@mui/material";

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
        <>
            <FormControl component="fieldset">
                <FormLabel component="legend">Show Bindings For:</FormLabel>
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
                            onChange={(e) => setShowFlags(e.target.checked)}
                        />
                    }
                    label="Show Other Flags"
                />
            </div>
        </>
    );
};
