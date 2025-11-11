import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Recipe } from '../types';

const STORAGE_KEY = 'recipes:v1';

const load = (): Recipe[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
};

const save = (recipes: Recipe[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
};

const initialState: { items: Recipe[] } = {
  items: load(),
};

const recipesSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    addRecipe(state, action: PayloadAction<Recipe>) {
      state.items.push(action.payload);
      save(state.items);
    },
    updateRecipe(state, action: PayloadAction<Recipe>) {
      const idx = state.items.findIndex(r => r.id === action.payload.id);
      if (idx >= 0) {
        state.items[idx] = action.payload;
        save(state.items);
      }
    },
    deleteRecipe(state, action: PayloadAction<string>) {
      state.items = state.items.filter(r => r.id !== action.payload);
      save(state.items);
    },
    toggleFavorite(state, action: PayloadAction<string>) {
      const r = state.items.find(x => x.id === action.payload);
      if (r) {
        r.isFavorite = !r.isFavorite;
        save(state.items);
      }
    }
  }
});

export const { addRecipe, updateRecipe, deleteRecipe, toggleFavorite } = recipesSlice.actions;
export default recipesSlice.reducer;
