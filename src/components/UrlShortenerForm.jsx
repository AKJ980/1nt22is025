
import React, { useState, useEffect } from 'react';
import { logEvent } from '../middleware/loggerMiddleware';

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  Alert,
  Stack
} from '@mui/material';



const DEFAULT_VALIDITY = 30;
const MAX_URLS = 5;

const emptyUrlEntry = () => ({
  url: '',
  validity: '',
  shortcode: '',
  error: {},
});

// Helper component for live countdown
const ResultsWithCountdown = ({ results }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimeLeft = (expiryTimestamp) => {
    const diff = Math.max(0, Math.floor((expiryTimestamp - now) / 1000));
    const min = Math.floor(diff / 60);
    const sec = diff % 60;
    return diff > 0 ? `${min}m ${sec}s` : 'Expired';
  };

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>Results</Typography>
      <Stack spacing={3}>
        {results.map((res, i) => {
          const expired = res.expiryTimestamp < now;
          return (
            <Box key={i} sx={{
              p: 2,
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              background: '#fff',
              boxShadow: 0,
              mb: 1
            }}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                #{i + 1}
              </Typography>
              <Typography sx={{ mb: 0.5 }}><b>Original:</b> <span style={{ wordBreak: 'break-all' }}>{res.original}</span></Typography>
              <Typography sx={{ mb: 0.5 }}><b>Shortened:</b> <a href={res.short} target="_blank" rel="noopener noreferrer">{res.short}</a></Typography>
              <Typography sx={{ mb: 0.5 }}><b>Expires:</b> {res.expiry}</Typography>
              <Typography color={expired ? 'error' : 'textSecondary'} fontWeight={600}>
                <b>Time left:</b> {formatTimeLeft(res.expiryTimestamp)}
              </Typography>
              {i < results.length - 1 && <Box mt={2}><hr style={{ border: 'none', borderTop: '1px solid #eee' }} /></Box>}
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

const UrlShortenerForm = () => {
  const [entries, setEntries] = useState([emptyUrlEntry()]);
  const [results, setResults] = useState([]);
  const [formError, setFormError] = useState('');

  // Validation helpers
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidShortcode = (code) => {
    return /^[a-zA-Z0-9]{3,15}$/.test(code);
  };

  const handleChange = (idx, field, value) => {
    const newEntries = entries.map((entry, i) =>
      i === idx ? { ...entry, [field]: value, error: { ...entry.error, [field]: undefined } } : entry
    );
    setEntries(newEntries);
  };

  const handleAdd = () => {
    if (entries.length < MAX_URLS) {
      setEntries([...entries, emptyUrlEntry()]);
      logEvent('info', 'Added new URL entry field', { count: entries.length + 1 });
    }
  };

  const handleRemove = (idx) => {
    setEntries(entries.filter((_, i) => i !== idx));
    logEvent('info', 'Removed URL entry field', { index: idx });
  };

  const validate = () => {
    let valid = true;
    const newEntries = entries.map((entry) => {
      const error = {};
      if (!entry.url || !isValidUrl(entry.url)) {
        error.url = 'Enter a valid URL';
        valid = false;
        logEvent('warn', 'Invalid URL entered', { url: entry.url });
      }
      if (entry.validity) {
        const v = parseInt(entry.validity, 10);
        if (isNaN(v) || v <= 0) {
          error.validity = 'Validity must be a positive integer';
          valid = false;
          logEvent('warn', 'Invalid validity entered', { validity: entry.validity });
        }
      }
      if (entry.shortcode) {
        if (!isValidShortcode(entry.shortcode)) {
          error.shortcode = 'Shortcode must be 3-15 alphanumeric chars';
          valid = false;
          logEvent('warn', 'Invalid shortcode entered', { shortcode: entry.shortcode });
        }
      }
      return { ...entry, error };
    });
    // Check for duplicate shortcodes
    const codes = newEntries.map(e => e.shortcode).filter(Boolean);
    const dup = codes.find((c, i) => codes.indexOf(c) !== i);
    if (dup) {
      valid = false;
      setFormError('Duplicate shortcodes are not allowed');
      logEvent('error', 'Duplicate shortcodes detected', { shortcode: dup });
    } else {
      setFormError('');
    }
    setEntries(newEntries);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      logEvent('error', 'Form validation failed', { entries });
      return;
    }
    // Simulate API call and result
    const now = Date.now();
    const res = entries.map((entry) => {
      const validity = entry.validity ? parseInt(entry.validity, 10) : DEFAULT_VALIDITY;
      const expiry = new Date(now + validity * 60000);
      const code = entry.shortcode || Math.random().toString(36).slice(2, 8);
      // Save mapping to localStorage
      const map = JSON.parse(localStorage.getItem('shortcodeMap') || '{}');
      map[code] = {
        url: entry.url,
        expiry: expiry.getTime(),
      };
      localStorage.setItem('shortcodeMap', JSON.stringify(map));
      logEvent('info', 'Shortened URL created', { url: entry.url, shortcode: code, expiry: expiry.toISOString() });
      return {
        original: entry.url,
        short: `http://localhost:5173/r/${code}`,
        expiry: expiry.toLocaleString(),
        expiryTimestamp: expiry.getTime(),
      };
    });
    setResults(res);
    logEvent('info', 'Form submitted successfully', { count: res.length });
  };

  return (
    <Box sx={{ p: 2, maxWidth: 600, mx: 'auto', bgcolor: '#fff' }}>
      <Typography variant="h6" gutterBottom>
        Enter up to 5 URLs to shorten
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {entries.map((entry, idx) => (
            <Box key={idx} sx={{ mb: 1 }}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={12} md={5}>
                  <TextField
                    label="Long URL"
                    value={entry.url}
                    onChange={e => handleChange(idx, 'url', e.target.value)}
                    error={!!entry.error.url}
                    helperText={entry.error.url}
                    fullWidth
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={6} md={2}>
                  <TextField
                    label="Validity (min)"
                    value={entry.validity}
                    onChange={e => handleChange(idx, 'validity', e.target.value)}
                    error={!!entry.error.validity}
                    helperText={entry.error.validity}
                    fullWidth
                    placeholder={DEFAULT_VALIDITY}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField
                    label="Shortcode (optional)"
                    value={entry.shortcode}
                    onChange={e => handleChange(idx, 'shortcode', e.target.value)}
                    error={!!entry.error.shortcode}
                    helperText={entry.error.shortcode}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <IconButton
                    aria-label="remove"
                    onClick={() => handleRemove(idx)}
                    disabled={entries.length === 1}
                    size="small"
                  >
                    🗑️
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          ))}
          {entries.length < MAX_URLS && (
            <Button variant="outlined" onClick={handleAdd} sx={{ alignSelf: 'flex-start' }}>
              Add URL
            </Button>
          )}
          {formError && <Alert severity="error">{formError}</Alert>}
          <Button type="submit" variant="contained" color="primary">
            Shorten URLs
          </Button>
        </Stack>
      </form>
      {results.length > 0 && <ResultsWithCountdown results={results} />}

    </Box>
  );
};

export default UrlShortenerForm;
