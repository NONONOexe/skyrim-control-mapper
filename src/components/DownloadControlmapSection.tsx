import React from "react";
import { DownloadControlmapButton } from "./DownloadControlmapButton";
import { BindingFile, DownloadControlmapSectionProps } from "../types";

export const DownloadControlmapSection: React.FC<
    DownloadControlmapSectionProps
> = ({ file, downloadUrl }) => {
    return (
        <>
            <DownloadControlmapButton file={file} downloadUrl={downloadUrl} />
            <pre>{downloadUrl.substring("data:,".length)}</pre>
        </>
    );
};
