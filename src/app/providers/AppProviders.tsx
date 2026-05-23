import { ReactNode } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { router } from '../router/router';

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f6f7f9',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

type AppProvidersProps = {
  children?: ReactNode;
};

export const AppProviders = ({ children }: AppProvidersProps) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children ?? <RouterProvider router={router} />}
    <ToastContainer position="top-right" autoClose={3000} />
  </ThemeProvider>
);
