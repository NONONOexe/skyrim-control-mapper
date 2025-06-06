import React from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { UploadControlmapButton } from "./UploadControlmapButton";
import { LoadFormatButton } from "./LoadFormatButton";
import {
    DEFAULT_NEW_FORMAT_OPTION,
    DEFAULT_OLD_FORMAT_OPTION,
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
                <UploadControlmapButton
                    onUpload={onUpload}
                    fileInputRef={fileInputRef}
                />
                <LoadFormatButton
                    loadDefaults={loadDefaults}
                    label={DEFAULT_NEW_FORMAT_OPTION.label}
                    filename={DEFAULT_NEW_FORMAT_OPTION.filename}
                    tooltip="Load the default settings for Skyrim AE (New Format) version 1.6.640 and later."
                />
                <LoadFormatButton
                    loadDefaults={loadDefaults}
                    label={DEFAULT_OLD_FORMAT_OPTION.label}
                    filename={DEFAULT_OLD_FORMAT_OPTION.filename}
                    tooltip="Load the default settings for Skyrim SE (Old Format) version 1.5.97 and earlier."
                />
            </Box>
        </Paper>
    );
};
