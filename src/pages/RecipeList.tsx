import React, { useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { toggleFavorite, addRecipe } from "../store/recipesSlice";
import { Link, useNavigate } from "react-router-dom";
import { SAMPLE_RECIPES } from "../data/sample-recipes";
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
  Tooltip,
  Fade,
  CardActions,
  CardMedia,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

export default function RecipeList() {
  const recipes = useSelector((s: RootState) => s.recipes.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<string>("All");
  const [sort, setSort] = useState<"asc" | "desc">("asc");

  // ✅ Initialize demo recipes only once
  useEffect(() => {
    const initialized = localStorage.getItem("demo_recipes_initialized");
    if (!initialized) {
      SAMPLE_RECIPES.forEach((r) =>
        dispatch(addRecipe({ ...r, id: crypto.randomUUID() }))
      );
      localStorage.setItem("demo_recipes_initialized", "true");
    }
  }, [dispatch]);

  // ✅ Filters + sorting
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
            background: "linear-gradient(90deg, #00C2A8 0%, #00E0C3 100%)",
            color: "#fff",
            borderRadius: 3,
            textTransform: "none",
            px: 2.5,
            py: 1,
            fontWeight: 500,
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              background: "linear-gradient(90deg, #00B49B 0%, #00D6BA 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 4px 15px rgba(0,194,168,0.3)",
            },
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
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: "0px 8px 24px rgba(0,0,0,0.08)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    backdropFilter: "blur(6px)",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0px 10px 28px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  {/* Image */}
                  {r.image && (
                    <CardMedia
                      component="img"
                      height="180"
                      image={r.image}
                      alt={r.title}
                      sx={{
                        objectFit: "cover",
                        transition: "0.3s",
                        "&:hover": { opacity: 0.9 },
                      }}
                    />
                  )}

                  <CardContent sx={{ p: 2 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <Box>
                        <Typography
                          variant="h6"
                          component={Link}
                          to={`/cook/${r.id}`}
                          sx={{
                            textDecoration: "none",
                            color: "#004D40",
                            fontWeight: 600,
                            display: "block",
                            mb: 0.5,
                            "&:hover": { color: "#00B49B" },
                          }}
                        >
                          {r.title}
                        </Typography>

                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          <Chip
                            label={r.difficulty}
                            icon={<RestaurantIcon fontSize="small" />}
                            sx={{
                              backgroundColor: "rgba(0,194,168,0.08)",
                              color: "#00B49B",
                              fontWeight: 500,
                              fontSize: "0.75rem",
                            }}
                          />
                          <Chip
                            label={`${totalMinutes} min`}
                            icon={<AccessTimeIcon fontSize="small" />}
                            sx={{
                              backgroundColor: "rgba(0,194,168,0.12)",
                              color: "#00897b",
                              fontWeight: 500,
                              fontSize: "0.75rem",
                            }}
                          />
                        </Stack>
                      </Box>

                      <Tooltip title="Add to Favorites">
                        <IconButton
                          onClick={() => dispatch(toggleFavorite(r.id))}
                          sx={{
                            color: r.isFavorite
                              ? "#FFD700"
                              : "rgba(0,0,0,0.25)",
                            transition: "all 0.25s",
                            "&:hover": { transform: "scale(1.2)" },
                          }}
                        >
                          {r.isFavorite ? <StarIcon /> : <StarBorderIcon />}
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </CardContent>

                  <CardActions
                    sx={{
                      px: 2,
                      pb: 2,
                      pt: 0,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      startIcon={<PlayArrowIcon />}
                      onClick={() => navigate(`/cook/${r.id}`)}
                      sx={{
                        background:
                          "linear-gradient(90deg, #00C2A8 0%, #00E0C3 100%)",
                        color: "#fff",
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: "8px",
                        px: 2,
                        transition: "all 0.25s",
                        "&:hover": {
                          background:
                            "linear-gradient(90deg, #00B49B 0%, #00D6BA 100%)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      Start Cooking
                    </Button>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "rgba(0,0,0,0.5)",
                        fontWeight: 500,
                      }}
                    >
                      {r.steps.length} Steps
                    </Typography>
                  </CardActions>
                </Card>
              </Fade>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
