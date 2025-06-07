import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { BindingFile, CodeType, BindingValue } from "../types";
import { BindingTable } from "./BindingTable";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ height: "50vh" }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

interface BindingTabsProps {
    file: BindingFile;
    mode: "kbm" | "pad" | "all";
    showFlags: boolean;
    aliases: Record<string, string[]>;
    setBindingValue: (
        type: CodeType,
        value: BindingValue,
        bindingIndex: number,
        groupIndex: number
    ) => void;
    setRemappable: (
        type: CodeType,
        checked: boolean,
        bindingIndex: number,
        groupIndex: number
    ) => void;
    setFlagBit: (
        bit: number,
        checked: boolean,
        bindingIndex: number,
        groupIndex: number
    ) => void;
}

export const BindingTabs: React.FC<BindingTabsProps> = ({
    file,
    mode,
    showFlags,
    aliases,
    setBindingValue,
    setRemappable,
    setFlagBit,
}) => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="binding group tabs"
                variant="scrollable"
                scrollButtons="auto"
            >
                {file.groups.map((group, index) => (
                    <Tab
                        label={group.name}
                        {...a11yProps(index)}
                        key={group.name}
                    />
                ))}
            </Tabs>
            {file.groups.map((group, index) => (
                <TabPanel value={value} index={index} key={group.name}>
                    <BindingTable
                        group={group}
                        mode={mode}
                        showFlags={showFlags}
                        aliases={aliases}
                        setBindingValue={(type, val, bIdx) =>
                            setBindingValue(type, val, bIdx, index)
                        }
                        setRemappable={(type, checked, bIdx) =>
                            setRemappable(type, checked, bIdx, index)
                        }
                        setFlagBit={(bit, checked, bIdx) =>
                            setFlagBit(bit, checked, bIdx, index)
                        }
                    />
                </TabPanel>
            ))}
        </Box>
    );
};
