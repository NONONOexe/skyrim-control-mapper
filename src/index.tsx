import { createRoot } from "react-dom/client";
import { useControlMapper } from "./hooks/useControlMapper";
import { DisplayControls } from "./components/DisplayControls";
import { BindingTable } from "./components/BindingTable";
import { UploadControlmapButton } from "./components/UploadControlmapButton";
import { LoadFormatButton } from "./components/LoadFormatButton";
import {
    DEFAULT_NEW_FORMAT_OPTION,
    DEFAULT_OLD_FORMAT_OPTION,
} from "./constants";
import { DownloadControlmapButton } from "./components/DownloadControlmapButton";

function App() {
    const {
        file,
        mode,
        setMode,
        showFlags,
        setShowFlags,
        aliases,
        downloadUrl,
        onUpload,
        loadDefaults,
        setBindingValue,
        setRemappable,
        setFlagBit,
    } = useControlMapper();

    return (
        <>
            <UploadControlmapButton onUpload={onUpload} />
            <LoadFormatButton
                loadOption={DEFAULT_NEW_FORMAT_OPTION}
                loadDefaults={loadDefaults}
            />
            <LoadFormatButton
                loadOption={DEFAULT_OLD_FORMAT_OPTION}
                loadDefaults={loadDefaults}
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
