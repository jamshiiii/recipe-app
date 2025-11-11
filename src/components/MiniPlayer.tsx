import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  CircularProgress,
  Grow,
} from "@mui/material";
import PlayArrow from "@mui/icons-material/PlayArrow";
import Pause from "@mui/icons-material/Pause";
import Stop from "@mui/icons-material/Stop";
import {
  pauseSession,
  resumeSession,
  stopStep,
} from "../store/sessionSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "./ToastProvider";

export default function MiniPlayer() {
  const session = useSelector((s: RootState) => s.session);
  const recipes = useSelector((s: RootState) => s.recipes.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const liveRef = useRef<HTMLDivElement>(null);

  const activeId = session.activeRecipeId;
  const by = activeId ? session.byRecipeId[activeId] : undefined;
  const recipe = activeId ? recipes.find((r) => r.id === activeId) : undefined;

  if (!activeId || !recipe) return null;
  if (location.pathname === `/cook/${activeId}`) return null;

  const stepDurationSec =
    recipe.steps[by?.currentStepIndex ?? 0].durationMinutes * 60;
  const stepElapsed =
    stepDurationSec - (by?.stepRemainingSec ?? stepDurationSec);
  const stepProgress = Math.round((stepElapsed / stepDurationSec) * 100);

  const handleToggle = () => {
    if (!by) return;
    if (by.isRunning) {
      dispatch(pauseSession({ recipeId: activeId }) as any);
      showToast({ message: "Cooking paused", severity: "info" });
      if (liveRef.current) liveRef.current.textContent = "Cooking paused";
    } else {
      dispatch(resumeSession({ recipeId: activeId }) as any);
      showToast({ message: "Cooking resumed", severity: "success" });
      if (liveRef.current) liveRef.current.textContent = "Cooking resumed";
    }
  };

  const handleStop = () => {
    if (!by) return;
    const confirmed = window.confirm(
      "Are you sure you want to end the current step?"
    );
    if (!confirmed) return;

    const isFinal = by.currentStepIndex === recipe.steps.length - 1;
    dispatch(stopStep({ recipeId: activeId, isFinal }) as any);
    showToast({ message: "Step ended", severity: "warning" });
    if (liveRef.current) liveRef.current.textContent = "Step ended";
  };

  // keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleToggle();
      }
      if (e.code === "KeyS") {
        e.preventDefault();
        handleStop();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  return (
    <Grow in={true}>
      <Paper
        elevation={10}
        sx={{
          position: "fixed",
          right: 20,
          bottom: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          px: 2,
          py: 1.2,
          minWidth: 300,
          borderRadius: "16px",
          background: "linear-gradient(135deg, #00897b, #26a69a)",
          color: "white",
          boxShadow: "0px 6px 16px rgba(0,0,0,0.25)",
          cursor: "pointer",
          transition: "transform 0.2s, box-shadow 0.3s ease",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: "0px 8px 20px rgba(0,0,0,0.35)",
          },
        }}
        onClick={() => navigate(`/cook/${activeId}`)}
        role="region"
        aria-label={`Active cooking session for ${recipe.title}`}
      >
        {/* Text Info */}
        <Box sx={{ flex: 1, overflow: "hidden" }}>
          <Typography
            variant="subtitle1"
            noWrap
            fontWeight="bold"
            sx={{ letterSpacing: "0.3px" }}
          >
            {recipe.title}
          </Typography>
          <Typography variant="caption" noWrap sx={{ opacity: 0.9 }}>
            Step {by?.currentStepIndex! + 1} •{" "}
            {by?.isRunning ? "Running" : "Paused"}
          </Typography>
        </Box>

        {/* Progress Ring */}
        <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
          <CircularProgress
            size={46}
            thickness={5}
            variant="determinate"
            value={stepProgress}
            sx={{
              color: "white",
              opacity: 0.8,
            }}
          />
          <Typography
            variant="caption"
            sx={{
              position: "absolute",
              color: "white",
              fontWeight: 600,
              fontSize: "0.7rem",
            }}
          >
            {stepProgress}%
          </Typography>
        </Box>

        {/* Control Buttons */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
            aria-label={by?.isRunning ? "Pause cooking" : "Resume cooking"}
            sx={{
              color: "white",
              backgroundColor: "rgba(255,255,255,0.15)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
            }}
          >
            {by?.isRunning ? <Pause /> : <PlayArrow />}
          </IconButton>

          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleStop();
            }}
            aria-label="Stop cooking session"
            sx={{
              color: "white",
              backgroundColor: "rgba(255,255,255,0.15)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
            }}
          >
            <Stop />
          </IconButton>
        </Box>

        {/* Screen Reader Live Updates */}
        <Box
          ref={liveRef}
          sx={{ position: "absolute", left: -9999 }}
          aria-live="polite"
        />
      </Paper>
    </Grow>
  );
}
