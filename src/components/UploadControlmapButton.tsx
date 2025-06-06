import React from "react";
import { Button } from "@mui/material";
import { UPLOAD_BUTTON_TEXT } from "../constants";

interface UploadControlmapButtonProps {
    onUpload: (file: File | null | undefined) => Promise<void>;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const UploadControlmapButton = React.forwardRef<
    HTMLButtonElement,
    UploadControlmapButtonProps
>(({ onUpload, fileInputRef }, ref) => {
    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <Button
            variant="contained"
            onClick={handleButtonClick}
            sx={{ mt: 2, ml: 2 }}
            ref={ref}
        >
            {UPLOAD_BUTTON_TEXT}
            <input
                type="file"
                accept=".txt"
                hidden
                onChange={async (e) => onUpload(e.target.files?.item(0))}
                ref={fileInputRef}
            />
        </Button>
    );
});
