import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const StatisticsPage = () => {
  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          URL Statistics
        </Typography>
        {/* Statistics table/list will go here */}
      </Box>
    </Container>
  );
};

export default StatisticsPage;
