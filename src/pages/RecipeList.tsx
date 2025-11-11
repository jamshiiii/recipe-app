import React, { useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { toggleFavorite, addRecipe } from "../store/recipesSlice";
import { Link } from "react-router-dom";
import {SAMPLE_RECIPES} from '../data/sample-recipes'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Button,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CardMedia,
  Tooltip,
  Fade,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RestaurantIcon from "@mui/icons-material/Restaurant";

export default function RecipeList() {
  const recipes = useSelector((s: RootState) => s.recipes.items);
  const dispatch = useDispatch();
  const [difficulty, setDifficulty] = useState<string>("All");
  const [sort, setSort] = useState<"asc" | "desc">("asc");

  // Add default demo recipes if empty
useEffect(() => {
  const initialized = localStorage.getItem("demo_recipes_initialized");
  if (!initialized) {
    SAMPLE_RECIPES.forEach((r) =>
      dispatch(addRecipe({ ...r, id: crypto.randomUUID() }))
    );
    localStorage.setItem("demo_recipes_initialized", "true");
  }
}, [dispatch]);


  const filtered = useMemo(() => {
    let arr = recipes.slice();
    if (difficulty !== "All")
      arr = arr.filter((r) => r.difficulty === difficulty);
    arr.sort((a, b) => {
      const ta = a.steps.reduce((s, x) => s + x.durationMinutes, 0);
      const tb = b.steps.reduce((s, x) => s + x.durationMinutes, 0);
      return sort === "asc" ? ta - tb : tb - ta;
    });
    return arr;
  }, [recipes, difficulty, sort]);

  return (
    <Box>
      {/* Filters */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        mb={3}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={2}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Difficulty</InputLabel>
            <Select
              value={difficulty}
              label="Difficulty"
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Easy">Easy</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Hard">Hard</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Sort</InputLabel>
            <Select
              value={sort}
              label="Sort"
              onChange={(e) => setSort(e.target.value as any)}
            >
              <MenuItem value="asc">Time: Low to High</MenuItem>
              <MenuItem value="desc">Time: High to Low</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Button
          component={Link}
          to="/create"
          variant="contained"
          sx={{
            backgroundColor: "#00897b",
            "&:hover": { backgroundColor: "#00695c" },
          }}
        >
          + Create Recipe
        </Button>
      </Stack>

      {/* Recipe Grid */}
      <Grid container spacing={3}>
        {filtered.map((r) => {
          const totalMinutes = r.steps.reduce(
            (s, x) => s + x.durationMinutes,
            0
          );
          return (
            <Grid item xs={12} sm={6} md={4} key={r.id}>
              <Fade in timeout={500}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0px 6px 16px rgba(0,0,0,0.15)",
                    overflow: "hidden",
                    transition: "transform 0.25s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0px 8px 20px rgba(0,0,0,0.3)",
                    },
                  }}
                >
                  {/* {r.image && (
                    <CardMedia
                      component="img"
                      height="160"
                      image={r.image}
                      alt={r.title}
                      sx={{ objectFit: "cover" }}
                    />
                  )} */}

                  <CardContent sx={{ p: 2 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography
                        variant="h6"
                        component={Link}
                        to={`/cook/${r.id}`}
                        sx={{
                          textDecoration: "none",
                          color: "#004d40",
                          fontWeight: 600,
                        }}
                      >
                        {r.title}
                      </Typography>

                      <Tooltip title="Toggle Favorite">
                        <IconButton
                          onClick={() => dispatch(toggleFavorite(r.id))}
                          color="primary"
                          sx={{
                            color: r.isFavorite ? "#FFD700" : "rgba(0,0,0,0.3)",
                            transition: "0.2s",
                            "&:hover": {
                              color: "#FFD700",
                              transform: "scale(1.1)",
                            },
                          }}
                        >
                          {r.isFavorite ? <StarIcon /> : <StarBorderIcon />}
                        </IconButton>
                      </Tooltip>
                    </Stack>

                    <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                      <Chip
                        label={r.difficulty}
                        icon={<RestaurantIcon fontSize="small" />}
                        sx={{
                          backgroundColor: "#e0f2f1",
                          color: "#00695c",
                          fontWeight: 500,
                        }}
                      />
                      <Chip
                        label={`Total: ${totalMinutes} min`}
                        icon={<AccessTimeIcon fontSize="small" />}
                        sx={{
                          backgroundColor: "#b2dfdb",
                          color: "#004d40",
                          fontWeight: 500,
                        }}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
