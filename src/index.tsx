import React from "react";
import { createRoot } from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Header from "./components/Header";
import { UploadControlmapSection } from "./components/UploadControlmapSection";
import { ModifySettingsSection } from "./components/ModifySettingsSection";
import { DownloadControlmapSection } from "./components/DownloadControlmapSection";
import { useControlMapper } from "./hooks/useControlMapper";

const theme = createTheme({
    typography: {
        h3: {
            fontSize: "1.2rem",
            fontWeight: 600,
            color: "#555",
        },
    },
});

function App() {
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState("");

    const handleCloseSnackbar = (
        _event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenSnackbar(false);
    };

    const onFileLoadSuccess = (filename: string) => {
        setSnackbarMessage(`${filename} loaded successfully.`);
        setOpenSnackbar(true);
    };

    const {
        file,
        mode,
        setMode,
        showFlags,
        setShowFlags,
        aliases,
        downloadUrl,
        fileInputRef,
        onUpload,
        loadDefaults,
        setBindingValue,
        setRemappable,
        setFlagBit,
        originalFileContent,
    } = useControlMapper();

    return (
        <ThemeProvider theme={theme}>
            <Header />
            <Stack sx={{ margin: "80px 10% 0 10%" }} spacing={4}>
                <UploadControlmapSection
                    onUpload={(f) => onUpload(f, onFileLoadSuccess)}
                    loadDefaults={(key) => loadDefaults(key, onFileLoadSuccess)}
                    fileInputRef={fileInputRef}
                />
                {file ? (
                    <>
                        <ModifySettingsSection
                            file={file}
                            mode={mode}
                            setMode={setMode}
                            showFlags={showFlags}
                            setShowFlags={setShowFlags}
                            aliases={aliases}
                            setBindingValue={setBindingValue}
                            setRemappable={setRemappable}
                            setFlagBit={setFlagBit}
                        />
                        <DownloadControlmapSection
                            file={file}
                            downloadUrl={downloadUrl}
                            originalFileContent={originalFileContent}
                        />
                    </>
                ) : null}
            </Stack>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
}

const container = document.getElementById("root");
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}

export default App;
