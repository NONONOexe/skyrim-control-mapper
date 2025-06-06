import React from "react";
import { Button } from "@mui/material";
import { UPLOAD_BUTTON_TEXT } from "../constants";

interface UploadControlmapButtonProps {
    onUpload: (file: File | null | undefined) => Promise<void>;
}

export const UploadControlmapButton: React.FC<UploadControlmapButtonProps> = ({
    onUpload,
}) => {
    return (
        <Button variant="contained" component="label" sx={{ mt: 2, ml: 2 }}>
            {UPLOAD_BUTTON_TEXT}
            <input
                type="file"
                accept=".txt"
                hidden
                onChange={async (e) => onUpload(e.target.files?.item(0))}
            />
        </Button>
    );
};
