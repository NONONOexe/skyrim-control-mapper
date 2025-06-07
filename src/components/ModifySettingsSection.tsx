import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DisplayControls } from "./DisplayControls";
import { BindingTabs } from "./BindingTabs";
import { ModifySettingsSectionProps } from "../types";

export const ModifySettingsSection: React.FC<ModifySettingsSectionProps> = ({
    file,
    mode,
    setMode,
    showFlags,
    setShowFlags,
    aliases,
    setBindingValue,
    setRemappable,
    setFlagBit,
}) => {
    return (
        <Stack spacing={1}>
            <Typography variant="h3">2. Modify Settings</Typography>
            <DisplayControls
                mode={mode}
                setMode={setMode}
                showFlags={showFlags}
                setShowFlags={setShowFlags}
            />
            <Box sx={{ flexGrow: 1 }}>
                <BindingTabs
                    file={file}
                    mode={mode}
                    showFlags={showFlags}
                    aliases={aliases}
                    setBindingValue={setBindingValue}
                    setRemappable={setRemappable}
                    setFlagBit={setFlagBit}
                />
            </Box>
        </Stack>
    );
};
