import React from "react";
import Typography from "@mui/material/Typography";
import { UploadControlmapButton } from "./UploadControlmapButton";
import { LoadFormatButton } from "./LoadFormatButton";
import {
    DEFAULT_NEW_FORMAT_OPTION,
    DEFAULT_OLD_FORMAT_OPTION,
} from "../constants/app";
import { UploadControlmapSectionProps } from "../types";
import Stack from "@mui/material/Stack";

export const UploadControlmapSection: React.FC<
    UploadControlmapSectionProps
> = ({ onUpload, loadDefaults, fileInputRef }) => {
    return (
        <Stack spacing={2}>
            <Typography variant="h3">
                1. Upload Configuration File / Select Default Data
            </Typography>
            <Stack direction={"row"} spacing={2}>
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
            </Stack>
        </Stack>
    );
};
