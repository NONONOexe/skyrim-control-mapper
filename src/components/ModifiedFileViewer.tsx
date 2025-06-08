import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Box from "@mui/material/Box";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";

interface ModifiedFileViewerProps {
    downloadUrl: string;
    originalFileContent: string | null;
}

export const ModifiedFileViewer: React.FC<ModifiedFileViewerProps> = ({
    downloadUrl,
    originalFileContent,
}) => {
    const newContent = downloadUrl.substring("data:,".length);
    const originalLines = originalFileContent
        ? originalFileContent.split("\n")
        : [];
    const newLines = newContent.split("\n");

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                    Modified controlmap.txt
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                {newLines.map((line, index) => {
                    const isModified = originalLines[index] !== line;
                    return (
                        <Box
                            key={index}
                            sx={{
                                backgroundColor: isModified
                                    ? "rgba(255, 255, 0, 0.3)"
                                    : "transparent",
                                display: "block",
                                fontFamily: "monospace",
                            }}
                        >
                            {line}
                        </Box>
                    );
                })}
            </AccordionDetails>
        </Accordion>
    );
};
