import React from "react";
import { Button } from "@mui/material";

interface LoadFormatOption {
    label: string;
    value: string;
    filename: string;
}

interface LoadFormatButtonProps {
    loadOption: LoadFormatOption;
    loadDefaults: (keyToLoad: string) => Promise<void>;
}

export const LoadFormatButton: React.FC<LoadFormatButtonProps> = ({
    loadOption,
    loadDefaults,
}) => {
    return (
        <Button
            variant="contained"
            onClick={async () => loadDefaults(loadOption.value)}
            sx={{ mt: 2, ml: 2 }}
        >
            {loadOption.label}
        </Button>
    );
};
