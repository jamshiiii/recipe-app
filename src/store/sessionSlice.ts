import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ByRecipe = {
  currentStepIndex: number;
  isRunning: boolean;
  stepRemainingSec: number;
  overallRemainingSec: number;
  lastTickTs?: number;
};

type SessionState = {
  activeRecipeId: string | null;
  byRecipeId: Record<string, ByRecipe>;
};

const initialState: SessionState = {
  activeRecipeId: null,
  byRecipeId: {}
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    startSession(state, action: PayloadAction<{ recipeId: string; stepRemainingSec: number; overallRemainingSec: number }>) {
      if (state.activeRecipeId) {
        // disallow starting another; handled by UI
        return;
      }
      const { recipeId, stepRemainingSec, overallRemainingSec } = action.payload;
      state.activeRecipeId = recipeId;
      state.byRecipeId[recipeId] = {
        currentStepIndex: 0,
        isRunning: true,
        stepRemainingSec,
        overallRemainingSec,
        lastTickTs: Date.now()
      };
    },
    tickSecond(state, action: PayloadAction<{ recipeId: string; nowTs: number }>) {
      const r = state.byRecipeId[action.payload.recipeId];
      if (!r || !r.isRunning) return;
      const now = action.payload.nowTs;
      const delta = Math.max(0, Math.floor((now - (r.lastTickTs || now)) / 1000));
      if (delta <= 0) {
        r.lastTickTs = now;
        return;
      }
      r.stepRemainingSec = Math.max(0, r.stepRemainingSec - delta);
      r.overallRemainingSec = Math.max(0, r.overallRemainingSec - delta);
      r.lastTickTs = now;
    },
    pauseSession(state, action: PayloadAction<{ recipeId: string }>) {
      const r = state.byRecipeId[action.payload.recipeId];
      if (r) {
        r.isRunning = false;
        r.lastTickTs = undefined;
      }
    },
    resumeSession(state, action: PayloadAction<{ recipeId: string }>) {
      const r = state.byRecipeId[action.payload.recipeId];
      if (r) {
        r.isRunning = true;
        r.lastTickTs = Date.now();
      }
    },
    stopStep(state, action: PayloadAction<{ recipeId: string; nextStepRemainingSec?: number; nextOverallRemainingSec?: number; isFinal?: boolean }>) {
      const rid = action.payload.recipeId;
      const r = state.byRecipeId[rid];
      if (!r) return;
      if (action.payload.isFinal) {
        // end session
        delete state.byRecipeId[rid];
        if (state.activeRecipeId === rid) state.activeRecipeId = null;
        return;
      }
      // advance to next
      r.currentStepIndex += 1;
      r.stepRemainingSec = action.payload.nextStepRemainingSec ?? 0;
      r.overallRemainingSec = action.payload.nextOverallRemainingSec ?? r.overallRemainingSec;
      r.isRunning = true;
      r.lastTickTs = Date.now();
    },
    endSession(state, action: PayloadAction<{ recipeId: string }>) {
      const rid = action.payload.recipeId;
      delete state.byRecipeId[rid];
      if (state.activeRecipeId === rid) state.activeRecipeId = null;
    }
  }
});

export const { startSession, tickSecond, pauseSession, resumeSession, stopStep, endSession } = sessionSlice.actions;
export default sessionSlice.reducer;
