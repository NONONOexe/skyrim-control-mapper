import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { DownloadControlmapSectionProps } from "../types";
import { ModifiedFileViewer } from "./ModifiedFileViewer";
import { DOWNLOAD_BUTTON_TEXT } from "../constants";

export const DownloadControlmapSection: React.FC<
    DownloadControlmapSectionProps
> = ({ downloadUrl, originalFileContent }) => {
    return (
        <Stack spacing={2}>
            <Typography variant="h3">
                3. Download Modified Configuration File
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                <Button
                    variant="contained"
                    href={downloadUrl}
                    download="controlmap.txt"
                >
                    {DOWNLOAD_BUTTON_TEXT}
                </Button>
            </Box>
            <ModifiedFileViewer
                downloadUrl={downloadUrl}
                originalFileContent={originalFileContent}
            />
        </Stack>
    );
};
