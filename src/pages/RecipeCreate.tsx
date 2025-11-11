import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux';
import { addRecipe } from '../store/recipesSlice';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Stack,
  Paper,
  Typography,
  IconButton,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Tooltip,
  Divider,
} from '@mui/material';
import { Difficulty, Ingredient, RecipeStep } from '../types';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import { useToast } from '../components/ToastProvider';

const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard'];

export default function RecipeCreate() {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<RecipeStep[]>([]);
  const [ingredientName, setIngredientName] = useState('');
  const [ingredientQty, setIngredientQty] = useState<number>(1);
  const [ingredientUnit, setIngredientUnit] = useState('pcs');

  const addIngredient = () => {
    if (!ingredientName.trim()) {
      showToast({ message: 'Ingredient name required', severity: 'warning' });
      return;
    }
    setIngredients((s) => [
      ...s,
      { id: uuidv4(), name: ingredientName.trim(), quantity: ingredientQty, unit: ingredientUnit },
    ]);
    setIngredientName('');
    setIngredientQty(1);
    showToast({ message: 'Ingredient added', severity: 'success' });
  };

  const addStep = (type: 'instruction' | 'cooking' = 'instruction') => {
    setSteps((s) => [
      ...s,
      {
        id: uuidv4(),
        description: '',
        type,
        durationMinutes: 1,
        ingredientIds: type === 'instruction' && ingredients.length ? [ingredients[0].id] : undefined,
        cookingSettings: type === 'cooking' ? { temperature: 180, speed: 1 } : undefined,
      },
    ]);
  };

  const save = () => {
    if (title.trim().length < 3)
      return showToast({ message: 'Title must be at least 3 characters', severity: 'warning' });
    if (ingredients.length < 1)
      return showToast({ message: 'Add at least 1 ingredient', severity: 'warning' });
    if (steps.length < 1)
      return showToast({ message: 'Add at least 1 step', severity: 'warning' });

    for (const st of steps) {
      if (!Number.isInteger(st.durationMinutes) || st.durationMinutes <= 0)
        return showToast({ message: 'Each step duration must be positive', severity: 'warning' });
      if (st.type === 'cooking' && !st.cookingSettings)
        return showToast({ message: 'Cooking settings required', severity: 'warning' });
      if (st.type === 'instruction' && (!st.ingredientIds || st.ingredientIds.length === 0))
        return showToast({ message: 'Instruction steps require ingredients', severity: 'warning' });
    }

    const now = new Date().toISOString();
    const recipe = {
      id: uuidv4(),
      title: title.trim(),
      difficulty,
      ingredients,
      steps,
      createdAt: now,
      updatedAt: now,
    };

    dispatch(addRecipe(recipe as any));
    showToast({ message: 'Recipe saved successfully!', severity: 'success' });

    setTitle('');
    setIngredients([]);
    setSteps([]);
  };

  const removeIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((p) => p.id !== id));
    setSteps((prev) => prev.map((st) => ({ ...st, ingredientIds: st.ingredientIds?.filter((i) => i !== id) })));
    showToast({ message: 'Ingredient removed', severity: 'info' });
  };

  const moveStep = (index: number, dir: 'up' | 'down') => {
    setSteps((prev) => {
      const arr = prev.slice();
      const target = dir === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= arr.length) return prev;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return arr;
    });
  };

  const updateStep = (id: string, patch: Partial<RecipeStep>) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  return (
    <Box sx={{ maxWidth: 'auto', mx: 'auto', overflowY:'auto', height:"600px" }}>
      <Typography variant="h5" mb={3} color="teal">
        🧑‍🍳 Create a New Recipe
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 4 }}>
        <Stack spacing={3}>
          {/* Basic Info */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Recipe Title"
              value={title}
              fullWidth
              onChange={(e) => setTitle(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={difficulty}
                label="Difficulty"
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              >
                {difficulties.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Divider />

          {/* Ingredients Section */}
          <Box>
            <Typography variant="h6" color="teal" mb={1}>
              Ingredients
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center" mb={2}>
              <TextField label="Name" value={ingredientName} onChange={(e) => setIngredientName(e.target.value)} />
              <TextField
                label="Qty"
                type="number"
                value={ingredientQty}
                onChange={(e) => setIngredientQty(Number(e.target.value))}
                sx={{ width: 100 }}
              />
              <TextField
                label="Unit"
                value={ingredientUnit}
                onChange={(e) => setIngredientUnit(e.target.value)}
                sx={{ width: 120 }}
              />
              <Button variant="contained"  onClick={addIngredient}>
                Add
              </Button>
            </Stack>

            {ingredients.map((i) => (
              <Paper
                key={i.id}
                sx={{
                  p: 1.2,
                  my: 0.5,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderRadius: 2,
                  backgroundColor: 'rgba(0,128,128,0.05)',
                }}
              >
                <Typography>
                  {i.name} — {i.quantity}
                  {i.unit}
                </Typography>
                <Tooltip title="Remove">
                  <IconButton onClick={() => removeIngredient(i.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Paper>
            ))}
          </Box>

          <Divider />

          {/* Steps Section */}
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h6" color="teal">
                Steps
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button variant="outlined"onClick={() => addStep('instruction')}>
                  + Instruction
                </Button>
                <Button variant="contained"  onClick={() => addStep('cooking')}>
                  + Cooking
                </Button>
              </Stack>
            </Stack>

            <Stack spacing={2} mt={1}>
              {steps.map((st, idx) => (
                <Paper
                  key={st.id}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 2,
                    backgroundColor: 'rgba(0,128,128,0.03)',
                    transition: '0.2s',
                    '&:hover': { transform: 'translateY(-3px)', boxShadow: 4 },
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label={`Step ${idx + 1} Description`}
                        value={st.description}
                        onChange={(e) => updateStep(st.id, { description: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        type="number"
                        label="Duration (min)"
                        value={st.durationMinutes}
                        onChange={(e) =>
                          updateStep(st.id, { durationMinutes: Math.max(1, Number(e.target.value) || 1) })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Stack direction="row" spacing={1}>
                        <FormControl sx={{ minWidth: 140 }}>
                          <InputLabel>Type</InputLabel>
                          <Select
                            value={st.type}
                            label="Type"
                            onChange={(e) => {
                              const t = e.target.value as any;
                              updateStep(st.id, {
                                type: t,
                                cookingSettings:
                                  t === 'cooking' ? { temperature: 180, speed: 1 } : undefined,
                                ingredientIds:
                                  t === 'instruction'
                                    ? ingredients.length
                                      ? [ingredients[0].id]
                                      : []
                                    : undefined,
                              });
                            }}
                          >
                            <MenuItem value="instruction">Instruction</MenuItem>
                            <MenuItem value="cooking">Cooking</MenuItem>
                          </Select>
                        </FormControl>

                        {st.type === 'instruction' && (
                          <FormControl sx={{ minWidth: 160 }}>
                            <InputLabel>Ingredient</InputLabel>
                            <Select
                              value={st.ingredientIds?.[0] || ''}
                              label="Ingredient"
                              onChange={(e) =>
                                updateStep(st.id, { ingredientIds: [e.target.value as string] })
                              }
                            >
                              {ingredients.map((i) => (
                                <MenuItem key={i.id} value={i.id}>
                                  {i.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}

                        {st.type === 'cooking' && (
                          <Stack direction="row" spacing={1}>
                            <TextField
                              label="Temp °C"
                              type="number"
                              value={st.cookingSettings?.temperature ?? 180}
                              onChange={(e) =>
                                updateStep(st.id, {
                                  cookingSettings: {
                                    ...st.cookingSettings!,
                                    temperature: Number(e.target.value),
                                  },
                                })
                              }
                              sx={{ width: 100 }}
                            />
                            <TextField
                              label="Speed"
                              type="number"
                              value={st.cookingSettings?.speed ?? 1}
                              onChange={(e) =>
                                updateStep(st.id, {
                                  cookingSettings: {
                                    ...st.cookingSettings!,
                                    speed: Number(e.target.value),
                                  },
                                })
                              }
                              sx={{ width: 80 }}
                            />
                          </Stack>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack direction="row" justifyContent="flex-end" spacing={1}>
                        <IconButton onClick={() => moveStep(idx, 'up')} disabled={idx === 0}>
                          <ArrowUpward />
                        </IconButton>
                        <IconButton onClick={() => moveStep(idx, 'down')} disabled={idx === steps.length - 1}>
                          <ArrowDownward />
                        </IconButton>
                        <IconButton onClick={() => setSteps((prev) => prev.filter((s) => s.id !== st.id))}>
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Stack>
          </Box>

          <Divider />

          <Box textAlign="right">
            <Button variant="contained"  size="large" onClick={save}>
              💾 Save Recipe
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
