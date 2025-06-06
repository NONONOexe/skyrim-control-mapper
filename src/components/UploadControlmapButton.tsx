import React from "react";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { UPLOAD_BUTTON_TEXT } from "../constants";

interface UploadControlmapButtonProps {
    onUpload: (file: File | null | undefined) => Promise<void>;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const UploadControlmapButton = ({
    onUpload,
    fileInputRef,
}: UploadControlmapButtonProps) => {
    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <Tooltip title="Upload your custom controlmap.txt file.">
            <Button variant="contained" onClick={handleButtonClick}>
                {UPLOAD_BUTTON_TEXT}
                <input
                    type="file"
                    accept=".txt"
                    hidden
                    onChange={async (e) => onUpload(e.target.files?.item(0))}
                    ref={fileInputRef}
                />
            </Button>
        </Tooltip>
    );
};
