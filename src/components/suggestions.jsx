import React from 'react';
import { Box, Typography, Paper, Grid, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import BotLogo from './Group 1000011097.png'; // Adjust the path if needed

const SuggestedQuestions = ({ questions, onQuestionClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // On mobile, only show first 2 questions
  const displayedQuestions = isMobile ? questions.slice(0, 2) : questions.slice(0, 4);

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      {/* Title and Logo */}
      <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
        How Can I Help You Today?
      </Typography>
      <Box
        component="img"
        src={BotLogo}
        alt="Bot Logo"
        sx={{
          width: 50,
          height: 50,
          my: 2,
        }}
      />

      {/* Suggested Questions Grid */}
      <Grid container spacing={2} justifyContent="center">
        {displayedQuestions.map((item, index) => (
          <Grid item xs={12} sm={6} md={6} key={index}>
            <Paper
              onClick={() => onQuestionClick(item.question)}
              elevation={3}
              sx={{
                p: 2,
                cursor: 'pointer',
                textAlign: 'left',
                height: '100%',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {item.question}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Get immediate AI generated response
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SuggestedQuestions;
