import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    // Apply dark mode class to body for global styling
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#4dabf5' : '#1976d2',
      },
      secondary: {
        main: darkMode ? '#f48fb1' : '#dc004e',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#4dabf5' : 'rgba(0, 0, 0, 0.87)',
        secondary: darkMode ? '#90caf9' : 'rgba(0, 0, 0, 0.6)',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: darkMode ? '#121212' : '#f5f5f5',
            color: darkMode ? '#4dabf5' : 'rgba(0, 0, 0, 0.87)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
            borderRight: `1px solid ${darkMode ? 'rgba(77, 171, 245, 0.12)' : 'rgba(0, 0, 0, 0.12)'}`,
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            color: darkMode ? '#4dabf5' : 'inherit',
            '&:hover': {
              backgroundColor: darkMode ? 'rgba(77, 171, 245, 0.08)' : 'rgba(0, 0, 0, 0.04)',
            },
            '&.Mui-selected': {
              backgroundColor: darkMode ? 'rgba(77, 171, 245, 0.16)' : 'rgba(25, 118, 210, 0.08)',
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(77, 171, 245, 0.24)' : 'rgba(25, 118, 210, 0.12)',
              },
            },
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            color: darkMode ? '#4dabf5' : 'inherit',
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          primary: {
            color: darkMode ? '#4dabf5' : 'inherit',
          },
          secondary: {
            color: darkMode ? '#90caf9' : 'inherit',
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: darkMode ? 'rgba(77, 171, 245, 0.12)' : 'rgba(0, 0, 0, 0.12)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#272727' : '#ffffff',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: darkMode ? '#4dabf5' : 'inherit',
          },
        },
      },
    },
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}; 