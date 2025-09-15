import {
  Box,
  Container,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedReply, setGeneratedReply] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:8080/api/email/generate', {
        emailContent,
        tone,
      });
      setGeneratedReply(
        typeof response.data === 'string'
          ? response.data
          : JSON.stringify(response.data)
      );
    } catch (error) {
      setError('Error generating reply. Please try again.');
      console.error('Error generating reply:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReply);
    setShowSnackbar(true);
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card elevation={4} sx={{ borderRadius: 4, boxShadow: '0 8px 32px rgba(39,71,176,0.12)' }}>
        <CardContent sx={{ py: 5, px: { xs: 2, sm: 5 } }}>
          <Typography variant="h4" align="center" sx={{ fontWeight: 800, color: '#243560', letterSpacing: '0.02em', mb: 2 }}>
            Email Reply Generator
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box sx={{ width: '100%', maxWidth: 400 }}>
              <TextField
                label="Email Content"
                multiline
                rows={5}
                fullWidth
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                variant="outlined"
                required
                sx={{ mb: 2, borderRadius: 2, background: '#f8fbff' }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="tone-label">Tone (Optional)</InputLabel>
                <Select
                  labelId="tone-label"
                  label="Tone (Optional)"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="Professional">Professional</MenuItem>
                  <MenuItem value="Casual">Casual</MenuItem>
                  <MenuItem value="Friendly">Friendly</MenuItem>
                </Select>
              </FormControl>
              {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit}
                disabled={loading || !emailContent}
                sx={{
                  mb: 2,
                  py: 1.3,
                  fontWeight: 700,
                  fontSize: '1rem',
                  borderRadius: 2,
                  boxShadow: '0 2px 8px #4868ce44',
                  backgroundColor: '#2747b0',
                  '&:hover': { backgroundColor: '#3466c1', boxShadow: '0 4px 16px #7ac5ff44' }
                }}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : 'Generate Reply'}
              </Button>
            </Box>
          </Box>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600, color: '#285197', letterSpacing: '0.01em' }}>
            Generated Reply
          </Typography>
          <Box
            sx={{
              mb: 2,
              background: '#f2f5fa',
              borderRadius: 2,
              p: 2,
              minHeight: '54px'
            }}
          >
            <Typography
              variant="body1"
              sx={{ color: generatedReply ? '#285197' : '#999', fontSize: '1.08rem' }}
            >
              {generatedReply || 'Your reply will appear here.'}
            </Typography>
          </Box>
          <CardActions sx={{ justifyContent: 'flex-end', px: 1, pb: 1 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleCopy}
              disabled={!generatedReply}
              sx={{
                borderRadius: 2,
                fontWeight: 700,
                fontSize: '1rem'
              }}
            >
              Copy to Clipboard
            </Button>
          </CardActions>
        </CardContent>
      </Card>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={1800}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setShowSnackbar(false)}>
          Reply copied!
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
