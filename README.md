# Upliance.ai - Recipe Builder & Cooking Session (Assignment)

This is a full React + TypeScript + Redux Toolkit implementation of the assignment.
Tech stack: React 18, TypeScript, Redux Toolkit, React Router v6, MUI v5.
Persistence: localStorage (recipes:v1). Session state is in-memory only.

How to run:
1. `npm install`
2. `npm run start`
3. Open http://localhost:5173

Notes:
- This scaffold implements core features per the assignment PDF:
  - Create/edit recipes with validations, derived fields.
  - Save recipes to localStorage under `recipes:v1`.
  - Cooking session page with timer, linear flow, Pause/Resume/STOP, auto-advance.
  - Global mini player visible across routes (hidden on active cook page).
