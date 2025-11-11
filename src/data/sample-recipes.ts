import  { type Recipe } from '../types'
import { v4 as uuidv4 } from 'uuid'

export const SAMPLE_RECIPES: Recipe[] = [
  {
    id: uuidv4(),
    title: 'Spicy Tomato Pasta',
    cuisine: 'Italian',
    difficulty: 'Easy',
    ingredients: [
      { id: uuidv4(), name: 'Pasta', quantity: 200, unit: 'g' },
      { id: uuidv4(), name: 'Tomato Sauce', quantity: 150, unit: 'ml' }
    ],
    steps: [
      { id: uuidv4(), description: 'Boil pasta', type: 'instruction', durationMinutes: 10, ingredientIds: [] },
      { id: uuidv4(), description: 'Cook sauce', type: 'cooking', durationMinutes: 8, cookingSettings: { temperature: 120, speed: 2 } }
    ],
    isFavorite: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Chocolate Mug Cake',
    cuisine: 'Dessert',
    difficulty: 'Medium',
    ingredients: [
      { id: uuidv4(), name: 'Flour', quantity: 50, unit: 'g' },
      { id: uuidv4(), name: 'Cocoa Powder', quantity: 20, unit: 'g' }
    ],
    steps: [
      { id: uuidv4(), description: 'Mix ingredients', type: 'instruction', durationMinutes: 3, ingredientIds: [] },
      { id: uuidv4(), description: 'Microwave', type: 'cooking', durationMinutes: 2, cookingSettings: { temperature: 150, speed: 1 } }
    ],
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]
