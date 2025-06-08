import React from "react";

export const useSnackbar = () => {
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState("");

    const handleOpenSnackbar = (message: string) => {
        setSnackbarMessage(message);
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = (
        _event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenSnackbar(false);
    };

    return {
        openSnackbar,
        snackbarMessage,
        handleOpenSnackbar,
        handleCloseSnackbar,
    };
};
