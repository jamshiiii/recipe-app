import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import SnackbarProvider from './components/SnackbarProvider'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App';
import { store } from './store';

const theme = createTheme();

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}><SnackbarProvider>
          <CssBaseline />
          <App />
        </SnackbarProvider></ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
