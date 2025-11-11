import React, { useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  startSession,
  tickSecond,
  pauseSession,
  resumeSession,
  stopStep,
  endSession,
} from '../store/sessionSlice';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  LinearProgress,
  Stack,
  Chip,
  Paper,
  Divider,
} from '@mui/material';
import { useToast } from '../components/ToastProvider';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import TimerIcon from '@mui/icons-material/Timer';

function formatSec(s: number) {
  const mm = Math.floor(s / 60).toString().padStart(2, '0');
  const ss = Math.floor(s % 60).toString().padStart(2, '0');
  return `${mm}:${ss}`;
}

export default function CookPage() {
  const { id } = useParams();
  const recipes = useSelector((s: RootState) => s.recipes.items);
  const session = useSelector((s: RootState) => s.session);
  const dispatch = useDispatch();
  const intervalRef = useRef<number | null>(null);
  const { showToast } = useToast();

  const recipe = recipes.find((r) => r.id === id);
  const sess = id ? session.byRecipeId[id] : undefined;

  const totalDurationSec = useMemo(
    () => (recipe ? recipe.steps.reduce((acc, s) => acc + s.durationMinutes * 60, 0) : 0),
    [recipe]
  );

  useEffect(() => {
    if (!id) return;
    if (!sess || !sess.isRunning) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    if (!intervalRef.current) {
      intervalRef.current = window.setInterval(() => {
        dispatch(tickSecond({ recipeId: id, nowTs: Date.now() }) as any);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [id, sess?.isRunning, dispatch]);

  if (!recipe)
    return (
      <Typography variant="h6" color="text.secondary">
        Recipe not found
      </Typography>
    );

  const currentStep = recipe.steps[sess ? sess.currentStepIndex : 0];
  const stepDurationSec = currentStep.durationMinutes * 60;
  const stepRemaining = sess ? sess.stepRemainingSec : stepDurationSec;
  const stepElapsed = stepDurationSec - stepRemaining;
  const stepProgress = Math.round((stepElapsed / stepDurationSec) * 100);
  const overallElapsed = totalDurationSec - (sess ? sess.overallRemainingSec : totalDurationSec);
  const overallProgress = Math.round((overallElapsed / totalDurationSec) * 100);

  const handleStart = () => {
    if (session.activeRecipeId) {
      showToast({ message: 'Another session is active', severity: 'warning' });
      return;
    }
    const overallRemaining = totalDurationSec;
    const firstStepDuration = recipe.steps[0].durationMinutes * 60;
    dispatch(
      startSession({
        recipeId: recipe.id,
        stepRemainingSec: firstStepDuration,
        overallRemainingSec: overallRemaining,
      }) as any
    );
    showToast({ message: 'Session started', severity: 'success' });
  };

  const handlePauseResume = () => {
    if (!sess) return;
    if (sess.isRunning) {
      dispatch(pauseSession({ recipeId: recipe.id }) as any);
      showToast({ message: 'Paused', severity: 'info' });
    } else {
      dispatch(resumeSession({ recipeId: recipe.id }) as any);
      showToast({ message: 'Resumed', severity: 'info' });
    }
  };

  const handleStop = () => {
    if (!sess) return;
    const isFinal = sess.currentStepIndex === recipe.steps.length - 1;
    if (isFinal) {
      dispatch(stopStep({ recipeId: recipe.id, isFinal: true }) as any);
      showToast({ message: 'Recipe completed 🎉', severity: 'success' });
      return;
    }
    const nextIndex = sess.currentStepIndex + 1;
    const nextStep = recipe.steps[nextIndex];
    const nextStepSec = nextStep.durationMinutes * 60;
    const overallRemaining = sess.overallRemainingSec - sess.stepRemainingSec;
    dispatch(
      stopStep({
        recipeId: recipe.id,
        nextStepRemainingSec: nextStepSec,
        nextOverallRemainingSec: overallRemaining,
        isFinal: false,
      }) as any
    );
    showToast({ message: 'Moved to next step', severity: 'info' });
  };

  useEffect(() => {
    if (!sess) return;
    if (sess.stepRemainingSec === 0) {
      const isFinal = sess.currentStepIndex === recipe.steps.length - 1;
      if (isFinal) {
        dispatch(endSession({ recipeId: recipe.id }) as any);
        showToast({ message: 'Recipe completed 🎉', severity: 'success' });
      } else {
        const nextIndex = sess.currentStepIndex + 1;
        const nextStepSec = recipe.steps[nextIndex].durationMinutes * 60;
        dispatch(
          stopStep({
            recipeId: recipe.id,
            nextStepRemainingSec: nextStepSec,
            nextOverallRemainingSec: sess.overallRemainingSec,
            isFinal: false,
          }) as any
        );
        showToast({ message: 'Auto advanced to next step', severity: 'info' });
      }
    }
  }, [sess?.stepRemainingSec]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (!sess) return;
        if (sess.isRunning) dispatch(pauseSession({ recipeId: recipe.id }) as any);
        else dispatch(resumeSession({ recipeId: recipe.id }) as any);
      }
    },
    [sess, dispatch, recipe]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <Box maxWidth="sm" mx="auto" mt={4}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
          background:
            'linear-gradient(145deg, rgba(255,255,255,0.9), rgba(250,250,250,0.8))',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Stack spacing={3} alignItems="center">
          <Typography variant="h4" fontWeight={600} textAlign="center">
            {recipe.title}
          </Typography>
          <Chip label={recipe.difficulty} color="primary" />

          <Divider flexItem />

          <Box textAlign="center">
            <Typography variant="h6">
              Step {sess ? sess.currentStepIndex + 1 : 1} / {recipe.steps.length}
            </Typography>
            <Typography color="text.secondary" mt={1}>
              {currentStep.description ||
                (currentStep.type === 'cooking' ? 'Cooking step' : 'Instruction step')}
            </Typography>
          </Box>

          <Stack direction="row" spacing={3} alignItems="center">
            <CircularProgress
              variant="determinate"
              value={stepProgress}
              size={110}
              thickness={4}
            />
            <Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <TimerIcon />
                <Typography
                  variant="h5"
                  sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}
                >
                  {formatSec(stepRemaining)}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} mt={2}>
                {!sess && (
                  <Button
                    variant="contained"
                    onClick={handleStart}
                    disabled={!!session.activeRecipeId}
                  >
                    Start
                  </Button>
                )}
                {sess && (
                  <>
                    <Button
                      variant="contained"
                      color={sess.isRunning ? 'warning' : 'success'}
                      onClick={handlePauseResume}
                      startIcon={sess.isRunning ? <PauseIcon /> : <PlayArrowIcon />}
                    >
                      {sess.isRunning ? 'Pause' : 'Resume'}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleStop}
                      startIcon={<SkipNextIcon />}
                    >
                      Next
                    </Button>
                  </>
                )}
              </Stack>
              <Typography variant="caption" display="block" mt={1} color="text.secondary">
                Press <b>Space</b> to toggle Pause/Resume
              </Typography>
            </Box>
          </Stack>

          <Box width="100%" mt={2}>
            <Typography gutterBottom>Overall Progress</Typography>
            <LinearProgress
              variant="determinate"
              value={overallProgress}
              sx={{ height: 10, borderRadius: 5 }}
            />
            <Typography mt={1} textAlign="center">
              {overallProgress}% • Remaining: {formatSec(sess ? sess.overallRemainingSec : totalDurationSec)}
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
