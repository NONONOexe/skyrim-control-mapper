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
import { UploadControlmapSectionProps } from "../types";

export const UploadControlmapSection: React.FC<
    UploadControlmapSectionProps
> = ({ onUpload, loadDefaults, fileInputRef }) => {
    return (
        <Box
            sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                alignItems: "flex-start",
            }}
        >
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
    );
};
