import React from "react";
import Button from "@mui/material/Button";
import { BindingFile } from "../types";
import { DOWNLOAD_BUTTON_TEXT } from "../constants";

interface DownloadControlmapButtonProps {
    file: BindingFile | null;
    downloadUrl: string;
}

export const DownloadControlmapButton: React.FC<
    DownloadControlmapButtonProps
> = ({ file, downloadUrl }) => {
    if (!file) {
        return null;
    }

    return (
        <>
            <Button
                variant="contained"
                href={downloadUrl}
                download="controlmap.txt"
                sx={{ mt: 2, ml: 2 }}
            >
                {DOWNLOAD_BUTTON_TEXT}
            </Button>
            <h3>{file.name}</h3>
        </>
    );
};
