import { StrictMode, useEffect, useState } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/app';
import { SaltProvider } from '@salt-ds/core';
import '@salt-ds/theme/index.css';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { ThemeContext } from './themeContext';
import ThemeToggleButton from './themeToggleButton';

function Root() {
  const [dark, setDark] = useState(
    localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add('dark'); // Tailwind dark mode
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <StrictMode>
      <ThemeContext.Provider value={{ dark, toggleTheme: () => setDark(!dark) }}>
      <SaltProvider theme={dark ? 'dark' : 'light'}>
        <Provider store={store}>
          <BrowserRouter>
            <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
                <header className="p-4 flex justify-end">
                  <ThemeToggleButton />
                </header>
                 <App/>
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

