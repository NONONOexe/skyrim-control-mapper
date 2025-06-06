import { createRoot } from "react-dom/client";
import { useControlMapper } from "./hooks/useControlMapper";
import { UploadControlmapSection } from "./components/UploadControlmapSection";
import { ModifySettingsSection } from "./components/ModifySettingsSection";
import { DownloadControlmapSection } from "./components/DownloadControlmapSection";

function App() {
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
    } = useControlMapper();

    return (
        <>
            <div style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                <h2>1. Upload Configuration File / Select Default Data</h2>
                <UploadControlmapSection
                    onUpload={onUpload}
                    loadDefaults={loadDefaults}
                    fileInputRef={fileInputRef}
                />
            </div>

            {file ? (
                <>
                    <div
                        style={{
                            padding: "10px",
                            borderBottom: "1px solid #ccc",
                        }}
                    >
                        <h2>2. Modify Settings</h2>
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
                    </div>
                    <div style={{ padding: "10px" }}>
                        <h2>3. Download Modified Configuration File</h2>
                        <DownloadControlmapSection
                            file={file}
                            downloadUrl={downloadUrl}
                        />
                    </div>
                </>
            ) : null}
        </>
    );
}

const container = document.getElementById("root");
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}

export default App;
