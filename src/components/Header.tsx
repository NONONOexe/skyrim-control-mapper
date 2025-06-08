import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Icon from "/icon.svg";

const Header: React.FC = () => {
    return (
        <AppBar
            sx={{
                background: "#eee",
                color: "#222",
            }}
        >
            <Box
                sx={{
                    margin: "0 10%",
                    display: "flex",
                    alignItems: "center",
                    height: "55px",
                }}
            >
                <img
                    src={Icon}
                    alt="Application Icon"
                    style={{ height: "30px", marginRight: "10px" }}
                />
                <Typography variant="h1">Skyrim Control Mapper</Typography>
            </Box>
        </AppBar>
    );
};

export default Header;
