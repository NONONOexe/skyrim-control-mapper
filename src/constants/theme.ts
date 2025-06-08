import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        primary: {
            main: "#555",
        },
    },
    typography: {
        h1: {
            fontSize: "1.35rem",
            fontWeight: 600,
        },
        h3: {
            fontSize: "1.2rem",
            fontWeight: 600,
            color: "#555",
        },
    },
});
