import { StrictMode, useEffect, useState, useMemo, useCallback } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/app';
import { SaltProvider } from '@salt-ds/core';
import '@salt-ds/theme/index.css';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { ThemeContext } from './themeContext';
import ThemeToggleButton from './themeToggleButton';

const THEME_KEY = 'theme';
const DARK_MODE = 'dark';
const LIGHT_MODE = 'light';
const MEDIA_QUERY = '(prefers-color-scheme: dark)';

function useTheme() {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem(THEME_KEY);
    return (
      stored === DARK_MODE ||
      (!stored && window.matchMedia(MEDIA_QUERY).matches)
    );
  });

  useEffect(() => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add(DARK_MODE);
      localStorage.setItem(THEME_KEY, DARK_MODE);
    } else {
      html.classList.remove(DARK_MODE);
      localStorage.setItem(THEME_KEY, LIGHT_MODE);
    }
  }, [dark]);

  return [dark, setDark] as const;
}

function Root() {
  const [dark, setDark] = useTheme();

  const toggleTheme = useCallback(() => setDark(!dark), [dark, setDark]);

  const themeValue = useMemo(
    () => ({ dark, toggleTheme }),
    [dark, toggleTheme]
  );

  return (
    <StrictMode>
      <ThemeContext.Provider value={themeValue}>
        <SaltProvider mode={dark ? DARK_MODE : LIGHT_MODE}>
          <Provider store={store}>
            <BrowserRouter>
              <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
                <header className="p-4 flex justify-end">
                  <ThemeToggleButton />
                </header>
                <App />
              </div>
            </BrowserRouter>
          </Provider>
        </SaltProvider>
      </ThemeContext.Provider>
    </StrictMode>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<Root />);

