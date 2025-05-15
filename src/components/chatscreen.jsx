import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import HistoryIcon from '@mui/icons-material/History';
import { data } from '../sampledata.js';
import SuggestedQuestions from '../components/suggestions.jsx';
import BotLogo from './Group 1000011097.png';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatDrawer from './ChatDrawer';

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState({});
  const [activeChatTitle, setActiveChatTitle] = useState('');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [currentFeedbackIndex, setCurrentFeedbackIndex] = useState(null);
  const [ratingFilter, setRatingFilter] = useState(0); // 0 means show all

  const location = useLocation();
  const navigate = useNavigate();
  const showDrawer = location.pathname === '/history';

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('multiChat')) || {};
    if (Object.keys(saved).length === 0) {
      const newTitle = 'Chat 1';
      const newChats = { [newTitle]: [] };
      setChats(newChats);
      setActiveChatTitle(newTitle);
    } else {
      setChats(saved);
      const titles = Object.keys(saved);
      setActiveChatTitle(titles[0]);
    }
  }, []);

  const handleNewChat = () => {
    const newTitle = `Chat ${Object.keys(chats).length + 1}`;
    const updatedChats = { ...chats, [newTitle]: [] };
    setChats(updatedChats);
    setActiveChatTitle(newTitle);
  };

  const handleDeleteChat = (title) => {
    const updatedChats = { ...chats };
    delete updatedChats[title];
    const remainingTitles = Object.keys(updatedChats);
    const newActiveTitle = remainingTitles[0] || '';
    setChats(updatedChats);
    setActiveChatTitle(newActiveTitle);
    localStorage.setItem('multiChat', JSON.stringify(updatedChats));
  };

  const findAnswer = (userInput) => {
    const match = data.find(
      (item) => item.question.toLowerCase().trim() === userInput.toLowerCase().trim()
    );
    return match ? match.response : "Sorry, Did not understand your query!";
  };

  const handleSend = () => {
    if (!message.trim() || !activeChatTitle) return;
    const answer = findAnswer(message);
    const updatedChat = [
      ...(chats[activeChatTitle] || []),
      { question: message, answer, feedback: null, rating: null },
    ];
    const updatedChats = { ...chats, [activeChatTitle]: updatedChat };
    setChats(updatedChats);
    localStorage.setItem('multiChat', JSON.stringify(updatedChats));
    setMessage('');
  };

  const handleFeedback = (chatIndex, type) => {
    const updatedChat = chats[activeChatTitle].map((msg, i) =>
      i === chatIndex ? { ...msg, feedback: type, rating: null } : msg
    );
    const updatedChats = { ...chats, [activeChatTitle]: updatedChat };
    setChats(updatedChats);
    localStorage.setItem('multiChat', JSON.stringify(updatedChats));
  };

  const handleRating = (chatIndex, rating) => {
    const updatedChat = chats[activeChatTitle].map((msg, i) =>
      i === chatIndex ? { ...msg, rating } : msg
    );
    const updatedChats = { ...chats, [activeChatTitle]: updatedChat };
    setChats(updatedChats);
    localStorage.setItem('multiChat', JSON.stringify(updatedChats));

    // Open feedback modal after rating
    setCurrentFeedbackIndex(chatIndex);
    setFeedbackModalOpen(true);
  };

  const handleSaveFeedback = () => {
    if (currentFeedbackIndex !== null) {
      const updatedChat = chats[activeChatTitle].map((msg, i) =>
        i === currentFeedbackIndex ? { ...msg, feedbackText } : msg
      );
      const updatedChats = { ...chats, [activeChatTitle]: updatedChat };
      setChats(updatedChats);
      localStorage.setItem('multiChat', JSON.stringify(updatedChats));
    }
    setFeedbackModalOpen(false);
    setFeedbackText('');
    setCurrentFeedbackIndex(null);
  };

  const handleOpenSaveDialog = () => {
    setSaveTitle(activeChatTitle || '');
    setSaveDialogOpen(true);
  };

  const handleSaveChat = () => {
    if (!saveTitle.trim()) return;
    const updatedChats = { ...chats, [saveTitle]: chats[activeChatTitle] || [] };
    setChats(updatedChats);
    setActiveChatTitle(saveTitle);
    localStorage.setItem('multiChat', JSON.stringify(updatedChats));
    setSaveDialogOpen(false);
  };

  const currentChat = chats[activeChatTitle] || [];

  // Filter chat messages based on rating
  const filteredChat = ratingFilter === 0
    ? currentChat
    : currentChat.filter(item => item.rating === ratingFilter);

  return (
    <Box sx={{ display: 'flex', fontFamily: 'Ubuntu, sans-serif' }}>
      {showDrawer && (
        <ChatDrawer
          chats={chats}
          activeChatTitle={activeChatTitle}
          setActiveChatTitle={setActiveChatTitle}
          handleNewChat={handleNewChat}
          handleDeleteChat={handleDeleteChat}
          BotLogo={BotLogo}
        />
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#F5EBFF',
        }}
      >
        {/* Rating filter bar */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          pb: 2,
          borderBottom: '1px solid #E0CFF7',
        }}>
          <Button
            variant="outlined"
            startIcon={<HistoryIcon />}
            onClick={() => navigate('/history')}
            sx={{
              borderColor: '#9C27B0',
              color: '#9C27B0',
              '&:hover': { borderColor: '#7B1FA2', color: '#7B1FA2' },
            }}
          >
            View History
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#6A1B9A' }}>
              Filter by rating:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[0, 1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  size="small"
                  variant={ratingFilter === rating ? "contained" : "outlined"}
                  onClick={() => setRatingFilter(rating)}
                  sx={{
                    minWidth: 'auto',
                    px: 1.5,
                    backgroundColor: ratingFilter === rating ? '#9C27B0' : 'transparent',
                    color: ratingFilter === rating ? 'white' : '#9C27B0',
                    borderColor: '#9C27B0',
                    '&:hover': {
                      backgroundColor: ratingFilter === rating ? '#7B1FA2' : 'rgba(156, 39, 176, 0.1)',
                      borderColor: '#7B1FA2',
                    },
                  }}
                >
                  {rating === 0 ? 'All' : rating}
                  {rating > 0 && rating < 6 && (
                    <StarIcon sx={{ fontSize: '14px', ml: 0.5 }} />
                  )}
                </Button>
              ))}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column-reverse',
            px: 1,
          }}
        >
          {[...filteredChat].reverse().map((item, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              {/* User Message */}
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', mb: 2, alignSelf: 'flex-start' }}>
                <Box>
                  <Paper
                    sx={{
                      backgroundColor: '#F1E8FB',
                      px: 2,
                      py: 1,
                      mb: 0.5,
                      width: '80vw'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <img src={BotLogo} alt="You" style={{ width: 36, height: 36, borderRadius: '50%' }} />
                      <Typography fontWeight="bold">You</Typography>
                    </Box>
                    <Typography>{item.question}</Typography>
                    <Typography variant="caption" sx={{ mt: 0.5, color: '#888' }}>
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Paper>
                </Box>
              </Box>

              {/* Bot response */}
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', alignSelf: 'flex-start' }}>
                <Box sx={{ flex: 1 }}>
                  <Paper
                    sx={{
                      backgroundColor: '#F1E8FB',
                      px: 2,
                      py: 1,
                      mb: 0.5,
                      width: '80vw'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <img src={BotLogo} alt="Bot" style={{ width: 36, height: 36, borderRadius: '50%' }} />
                      <span style={{ fontWeight: 'bold' }}>Soul AI</span>
                    </Box>
                    <Typography component="p">{item.answer}</Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Typography variant="caption" sx={{ color: '#888' }}>
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={() => handleFeedback(currentChat.length - 1 - index, 'like')}
                          disabled={item.feedback !== null}
                          sx={{
                            color: item.feedback === 'like' ? '#4CAF50' : '#888',
                            p: 0.5,
                            '&.Mui-disabled': {
                              color: item.feedback === 'like' ? '#4CAF50' : '#888',
                              opacity: item.feedback === 'like' ? 1 : 0.5
                            }
                          }}
                        >
                          <span style={{ fontSize: '16px' }}>👍</span>
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={() => handleFeedback(currentChat.length - 1 - index, 'dislike')}
                          disabled={item.feedback !== null}
                          sx={{
                            color: item.feedback === 'dislike' ? '#F44336' : '#888',
                            p: 0.5,
                            '&.Mui-disabled': {
                              color: item.feedback === 'dislike' ? '#F44336' : '#888',
                              opacity: item.feedback === 'dislike' ? 1 : 0.5
                            }
                          }}
                        >
                          <span style={{ fontSize: '16px' }}>👎</span>
                        </IconButton>
                      </Box>
                    </Box>

                    {item.feedback && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                        <Typography variant="caption" sx={{ color: '#666' }}>Rate:</Typography>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <IconButton
                            key={star}
                            onClick={() =>
                              item.rating == null &&
                              handleRating(currentChat.length - 1 - index, star)
                            }
                            size="small"
                            sx={{ p: 0.25 }}
                          >
                            {item.rating >= star ? (
                              <StarIcon sx={{ color: '#FFD700', fontSize: '18px' }} />
                            ) : (
                              <StarBorderIcon sx={{ color: '#FFD700', fontSize: '18px' }} />
                            )}
                          </IconButton>
                        ))}
                      </Box>
                    )}

                    {item.feedbackText && (
                      <Box sx={{ mt: 1, pt: 1, borderTop: '1px dashed #ccc' }}>
                        <Typography variant="caption" sx={{ color: '#6A1B9A', fontWeight: 'bold' }}>
                          Feedback:
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5, color: '#555', fontSize: '0.9rem' }}>
                          {item.feedbackText}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Box>
              </Box>
            </Box>

          ))}

          {filteredChat.length === 0 && currentChat.length > 0 && (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
              mt: 4
            }}>
              <Typography variant="h6" sx={{ color: '#6A1B9A', mb: 2 }}>
                No messages with {ratingFilter} star rating
              </Typography>
              <Button
                variant="outlined"
                onClick={() => setRatingFilter(0)}
                sx={{
                  borderColor: '#9C27B0',
                  color: '#9C27B0',
                  '&:hover': { borderColor: '#7B1FA2', color: '#7B1FA2' }
                }}
              >
                Show all messages
              </Button>
            </Box>
          )}

          {activeChatTitle && currentChat.length === 0 && (
            <SuggestedQuestions
              questions={data.slice(0, 4)}
              onQuestionClick={(q) => {
                const answer = findAnswer(q);
                const updatedChat = [
                  ...(chats[activeChatTitle] || []),
                  { question: q, answer, feedback: null, rating: null },
                ];
                const updatedChats = { ...chats, [activeChatTitle]: updatedChat };
                setChats(updatedChats);
              }}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', p: 2, borderTop: '1px solid #ccc' }}>
          <TextField
            fullWidth
            placeholder="Message Bot AI…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            sx={{ backgroundColor: '#fff', borderRadius: 1 }}
          />
          <Button
            type="submit"
            variant="contained"
            onClick={handleSend}
            sx={{ ml: 2, backgroundColor: '#9C27B0', ':hover': { backgroundColor: '#7B1FA2' } }}
          >
            Ask
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={handleOpenSaveDialog}
            sx={{
              ml: 1,
              borderColor: '#9C27B0',
              color: '#9C27B0',
              ':hover': { borderColor: '#7B1FA2', color: '#7B1FA2' },
            }}
          >
            Save
          </Button>
        </Box>
      </Box>

      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save Chat</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Chat Title"
            value={saveTitle}
            onChange={(e) => setSaveTitle(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button type="button" variant="contained" onClick={handleSaveChat}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Modal */}
      <Dialog open={feedbackModalOpen} onClose={() => setFeedbackModalOpen(false)}>
        <DialogTitle sx={{ bgcolor: '#F1E8FB', color: '#6A1B9A' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img src={BotLogo} alt="Soul AI" style={{ width: 24, height: 24 }} />
            <Typography component="span" fontWeight="bold">
              Soul AI Feedback
            </Typography>

          </Box>
        </DialogTitle>
        <DialogContent sx={{ minWidth: '400px', mt: 1 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Thanks for rating! Please let us know about your experience:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your feedback"
            placeholder="Not a good experience..."
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            variant="outlined"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackModalOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveFeedback}
            sx={{ bgcolor: '#9C27B0', '&:hover': { bgcolor: '#7B1FA2' } }}
          >
            Submit Feedback
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChatScreen;