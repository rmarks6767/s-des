/* eslint-disable import/extensions */
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline, FormControlLabel, Switch } from '@material-ui/core';
import App from './Components/App/App.jsx';

const AppWrapper = () => {
  const [darkMode, setDarkMode] = useState(true);
  const darkTheme = createMuiTheme({
    palette: {
      type: darkMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <App />
      <div style={{ position: 'fixed', bottom: 0, right: 0 }}>
        <FormControlLabel
          control={(
            <Switch
              color="primary"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
          )}
          label={darkMode ? 'Dark mode' : 'Light mode'}
        />
      </div>
    </ThemeProvider>
  );
};

ReactDOM.render(<AppWrapper />, document.getElementById('root'));
