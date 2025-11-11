import React, { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleCreateClick = () => navigate("/create");

  const navItems = [
    { label: "Recipes", path: "/recipes" }
    // { label: "Create", path: "/create" },
  ];

  return (
    <Fade in timeout={800}>
      <Paper
        elevation={3}
        sx={{
          position: "fixed",
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          borderRadius: 4,
          px: 3,
          py: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: { xs: "92%", sm: "80%", md: "100%" },
          zIndex: 1200,
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255,255,255,0.9)",
        }}
      >
        {/* Logo */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#009688",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            userSelect: "none",
          }}
          onClick={() => navigate("/recipes")}
        >
          🍳&nbsp;Upliance Recipes
        </Typography>

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
                      ? theme.palette.primary.main
                      : "text.primary",
                  textTransform: "none",
                  fontWeight:
                    location.pathname === item.path ? 600 : 400,
                  "&:hover": {
                    color: theme.palette.primary.main,
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
                backgroundColor: "#009688",
                color: "#fff",
                borderRadius: 3,
                textTransform: "none",
                px: 2.5,
                py: 1,
                fontWeight: 500,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "#00796B",
                  transform: "translateY(-2px)",
                  boxShadow: 4,
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
              sx={{ color: "#009688" }}
            >
              <MenuIcon />
            </IconButton>

            <Menu
              id="nav-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              PaperProps={{
                sx: { mt: 1.5, borderRadius: 2 },
              }}
            >
              {navItems.map((item) => (
                <MenuItem
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    handleMenuClose();
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
