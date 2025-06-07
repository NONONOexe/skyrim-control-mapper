import React from "react";
import { DisplayControls } from "./DisplayControls";
import { BindingTabs } from "./BindingTabs";
import {
    BindingFile,
    StoredState,
    CodeType,
    BindingValue,
    ModifySettingsSectionProps,
} from "../types";

export const ModifySettingsSection: React.FC<ModifySettingsSectionProps> = ({
    file,
    mode,
    setMode,
    showFlags,
    setShowFlags,
    aliases,
    setBindingValue,
    setRemappable,
    setFlagBit,
}) => {
    return (
        <>
            <DisplayControls
                mode={mode}
                setMode={setMode}
                showFlags={showFlags}
                setShowFlags={setShowFlags}
            />
            <BindingTabs
                file={file}
                mode={mode}
                showFlags={showFlags}
                aliases={aliases}
                setBindingValue={setBindingValue}
                setRemappable={setRemappable}
                setFlagBit={setFlagBit}
            />
        </>
    );
};
