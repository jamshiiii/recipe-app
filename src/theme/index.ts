// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00C2A8", // Upliance teal
    },
    secondary: {
      main: "#FFB703", // accent yellow
    },
    background: {
      default: "#F9FAFB", // soft white-gray
    },
  },
  typography: {
    fontFamily: "Poppins, Inter, sans-serif",
    h5: { fontWeight: 600 },
    body1: { color: "#333" },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 12,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 6px 25px rgba(0,0,0,0.12)",
          },
        },
      },
    },
  },
});

export default theme;
