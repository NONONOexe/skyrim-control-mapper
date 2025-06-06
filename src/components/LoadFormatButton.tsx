import React from "react";
import { Button } from "@mui/material";

interface LoadFormatOption {
    label: string;
    filename: string;
}

interface LoadFormatButtonProps {
    loadOption: LoadFormatOption;
    loadDefaults: (keyToLoad: string) => Promise<void>;
}

export const LoadFormatButton = React.forwardRef<
    HTMLButtonElement,
    LoadFormatButtonProps
>(({ loadOption, loadDefaults }, ref) => {
    return (
        <Button
            variant="contained"
            onClick={async () => loadDefaults(loadOption.filename)}
            sx={{ mt: 2, ml: 2 }}
            ref={ref}
        >
            {loadOption.label}
        </Button>
    );
});
