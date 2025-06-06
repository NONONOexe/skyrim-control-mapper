import React from "react";
import { Typography, Paper, Box, Tooltip } from "@mui/material";
import { UploadControlmapButton } from "./UploadControlmapButton";
import { LoadFormatButton } from "./LoadFormatButton";
import {
    DEFAULT_NEW_FORMAT_OPTION,
    DEFAULT_OLD_FORMAT_OPTION,
    UPLOAD_BUTTON_TEXT,
} from "../constants";

interface InitialActionButtonsProps {
    onUpload: (file: File | null | undefined) => Promise<void>;
    loadDefaults: (keyToLoad: string) => Promise<void>;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const InitialActionButtons: React.FC<InitialActionButtonsProps> = ({
    onUpload,
    loadDefaults,
    fileInputRef,
}) => {
    return (
        <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
                1. Get Started with Your Control Map File
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Tooltip title="Upload your custom controlmap.txt file.">
                    <UploadControlmapButton
                        onUpload={onUpload}
                        fileInputRef={fileInputRef}
                    />
                </Tooltip>
                <Tooltip title="Load the default settings for Skyrim AE (New Format) version 1.6.640 and later.">
                    <LoadFormatButton
                        loadOption={DEFAULT_NEW_FORMAT_OPTION}
                        loadDefaults={loadDefaults}
                    />
                </Tooltip>
                <Tooltip title="Load the default settings for Skyrim SE (Old Format) version 1.5.97 and earlier.">
                    <LoadFormatButton
                        loadOption={DEFAULT_OLD_FORMAT_OPTION}
                        loadDefaults={loadDefaults}
                    />
                </Tooltip>
            </Box>
        </Paper>
    );
};
