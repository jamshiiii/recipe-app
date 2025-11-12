import React, { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
  useTheme,
  Paper,
  Fade,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleCreateClick = () => navigate("/create");

  const navItems = [{ label: "Recipes", path: "/recipes" }];

  return (
    <Fade in timeout={600}>
      <Paper
        elevation={3}
        sx={{
          position: "fixed",
          top: 14,
          left: "50%",
          transform: "translateX(-50%)",
          borderRadius: 10,
          px: 3,
          py: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: { xs: "92%", sm: "85%", md: "75%" },
          zIndex: 1200,
          background:
            "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(12px)",
          boxShadow:
            "0 8px 25px rgba(0, 0, 0, 0.06)",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
      >
        {/* Logo */}
        <Box
          onClick={() => navigate("/recipes")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <Box
            sx={{
              background:
                "linear-gradient(90deg, #00C2A8 0%, #00E0C3 100%)",
              color: "#fff",
              borderRadius: "50%",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            U
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#00B49B",
              letterSpacing: 0.5,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Upliance Recipes
          </Typography>
        </Box>

        {/* Desktop Navigation */}
        {!isMobile ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  color:
                    location.pathname === item.path
                      ? "#00C2A8"
                      : "#333",
                  fontWeight:
                    location.pathname === item.path ? 600 : 400,
                  textTransform: "none",
                  fontFamily: "Inter, sans-serif",
                  "&:hover": {
                    color: "#00B49B",
                    backgroundColor: "transparent",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}

            <Button
              variant="contained"
              onClick={handleCreateClick}
              sx={{
                background:
                  "linear-gradient(90deg, #00C2A8 0%, #00E0C3 100%)",
                color: "#fff",
                borderRadius: 4,
                textTransform: "none",
                px: 2.5,
                py: 1,
                fontWeight: 500,
                fontFamily: "Inter, sans-serif",
                transition: "all 0.25s ease",
                boxShadow: "0 3px 10px rgba(0,194,168,0.25)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(0,194,168,0.35)",
                },
              }}
            >
              + Create Recipe
            </Button>
          </Box>
        ) : (
          <>
            <IconButton
              onClick={handleMenuOpen}
              aria-label="menu"
              aria-controls={open ? "nav-menu" : undefined}
              aria-haspopup="true"
              sx={{ color: "#00C2A8" }}
            >
              <MenuIcon />
            </IconButton>

            <Menu
              id="nav-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  borderRadius: 3,
                  minWidth: 160,
                  backgroundColor: "#fff",
                  boxShadow:
                    "0 8px 20px rgba(0,0,0,0.08)",
                },
              }}
            >
              {navItems.map((item) => (
                <MenuItem
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    handleMenuClose();
                  }}
                  sx={{
                    color:
                      location.pathname === item.path
                        ? "#00B49B"
                        : "#333",
                    fontWeight:
                      location.pathname === item.path ? 600 : 400,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {item.label}
                </MenuItem>
              ))}
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  handleCreateClick();
                }}
                sx={{
                  fontWeight: 500,
                  color: "#00C2A8",
                }}
              >
                + Create Recipe
              </MenuItem>
            </Menu>
          </>
        )}
      </Paper>
    </Fade>
  );
};

export default Navbar;
