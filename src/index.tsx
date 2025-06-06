import { createRoot } from "react-dom/client";
import { useControlMapper } from "./hooks/useControlMapper";
import { DisplayControls } from "./components/DisplayControls";
import { BindingTable } from "./components/BindingTable";
import { DownloadControlmapButton } from "./components/DownloadControlmapButton";
import { InitialActionButtons } from "./components/InitialActionButtons";

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
            <InitialActionButtons
                onUpload={onUpload}
                loadDefaults={loadDefaults}
                fileInputRef={fileInputRef}
            />
            <DownloadControlmapButton file={file} downloadUrl={downloadUrl} />
            {file ? (
                <>
                    <DisplayControls
                        mode={mode}
                        setMode={setMode}
                        showFlags={showFlags}
                        setShowFlags={setShowFlags}
                    />
                    <BindingTable
                        file={file}
                        mode={mode}
                        showFlags={showFlags}
                        aliases={aliases}
                        setBindingValue={setBindingValue}
                        setRemappable={setRemappable}
                        setFlagBit={setFlagBit}
                    />
                    <pre>{downloadUrl.substring("data:,".length)}</pre>
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
