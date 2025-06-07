import React from "react";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { UPLOAD_BUTTON_TEXT } from "../constants";

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

interface UploadControlmapButtonProps {
    onUpload: (file: File | null | undefined) => Promise<void>;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const UploadControlmapButton = ({
    onUpload,
    fileInputRef,
}: UploadControlmapButtonProps) => {
    return (
        <Tooltip title="Upload your custom controlmap.txt file.">
            <Button component="label" variant="contained">
                {UPLOAD_BUTTON_TEXT}
                <VisuallyHiddenInput
                    type="file"
                    accept=".txt"
                    onChange={async (e) => onUpload(e.target.files?.item(0))}
                    ref={fileInputRef}
                />
            </Button>
        </Tooltip>
    );
};
