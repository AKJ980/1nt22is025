
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import UrlShortenerForm from '../components/UrlShortenerForm';

const ShortenerPage = () => {
  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          URL Shortener For Given Link
        </Typography>
        <UrlShortenerForm />
      </Box>
    </Container>
  );
};

export default ShortenerPage;
