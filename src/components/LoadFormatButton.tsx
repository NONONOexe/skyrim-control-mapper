import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import React from "react";

interface LoadFormatButtonProps {
    loadDefaults: (filename: string) => void;
    label: string;
    filename: string;
    tooltip: string;
}

export const LoadFormatButton = ({
    loadDefaults,
    label,
    filename,
    tooltip,
}: LoadFormatButtonProps) => {
    return (
        <Tooltip title={tooltip}>
            <Button
                variant="contained"
                onClick={() => loadDefaults(filename)}
                sx={{ minHeight: "40px", lineHeight: "normal", height: "40px" }}
            >
                {label}
            </Button>
        </Tooltip>
    );
};
