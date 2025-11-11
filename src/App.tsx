import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Container, AppBar, Toolbar, Typography, Button } from "@mui/material";
import RecipeList from "./pages/RecipeList";
import RecipeCreate from "./pages/RecipeCreate";
import CookPage from "./pages/CookPage";
import MiniPlayer from "./components/MiniPlayer";
import { ToastProvider } from "./components/ToastProvider";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <ToastProvider>
      {/* ✅ Floating Navbar */}
      <Navbar />

      {/* ✅ Add top padding so content doesn't hide behind the floating navbar */}
      <Container sx={{ pt: { xs: 10, sm: 12 } }}>
        <Routes>
          <Route path="/" element={<RecipeList />} />
          <Route path="/recipes" element={<RecipeList />} />
          <Route path="/create" element={<RecipeCreate />} />
          <Route path="/cook/:id" element={<CookPage />} />
        </Routes>
      </Container>

      {/* ✅ Persistent MiniPlayer */}
      <MiniPlayer />
    </ToastProvider>
  );
}
