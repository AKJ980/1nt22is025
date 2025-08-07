import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, CircularProgress, Box, Alert } from '@mui/material';

const RedirectionPage = () => {
  const { shortcode } = useParams();
  const [error, setError] = useState('');

  useEffect(() => {
    // Lookup shortcode in localStorage
    const map = JSON.parse(localStorage.getItem('shortcodeMap') || '{}');
    const entry = map[shortcode];
    if (entry) {
      const now = Date.now();
      if (now < entry.expiry) {
        window.location.replace(entry.url);
      } else {
        setError('This link has expired.');
      }
    } else {
      setError('Short link not found.');
    }
  }, [shortcode]);

  return (
    <Container maxWidth="sm">
      <Box my={4} textAlign="center">
        {!error ? (
          <>
            <CircularProgress />
            <Typography variant="h6" mt={2}>
              Redirecting...
            </Typography>
          </>
        ) : (
          <Alert severity="error">{error}</Alert>
        )}
      </Box>
    </Container>
  );
};

export default RedirectionPage;
