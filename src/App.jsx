
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import ShortenerPage from './pages/ShortenerPage';
import StatisticsPage from './pages/StatisticsPage';
import RedirectionPage from './pages/RedirectionPage';
import { LoggingProvider } from './context/LoggingContext';

function App() {
  return (
    <LoggingProvider>
      <Router>
        <AppBar position="static">
          <Container maxWidth="md">
            <Toolbar disableGutters>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                URL Shortener
              </Typography>
              <Button color="inherit" component={Link} to="/">Shorten</Button>
              <Button color="inherit" component={Link} to="/stats">Statistics</Button>
            </Toolbar>
          </Container>
        </AppBar>
        <Box mt={4}>
          <Routes>
            <Route path="/" element={<ShortenerPage />} />
            <Route path="/stats" element={<StatisticsPage />} />
            <Route path="/r/:shortcode" element={<RedirectionPage />} />
          </Routes>
        </Box>
      </Router>
    </LoggingProvider>
  );
}

export default App;
