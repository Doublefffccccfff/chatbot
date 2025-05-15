import React from 'react';
import {
  Box,
  Drawer,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';

const drawerWidth = 200;

const ChatDrawer = ({
  chats,
  activeChatTitle,
  setActiveChatTitle,
  handleNewChat,
  handleDeleteChat,
  BotLogo
}) => {
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#E0CFF7',
          borderRight: '1px solid #ccc',
        },
      }}
    >
      
      <Box>
        <Button
          variant="contained"
          onClick={handleNewChat}
          sx={{
            mb: 1,
            backgroundColor: '#9C27B0',
            ':hover': { backgroundColor: '#7B1FA2' },
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between', // push text left, icon right
            textTransform: 'none',
            paddingY: 1.2,
            px: 2, // horizontal padding
          }}
        >
          <img src={BotLogo} alt="AI" style={{ width: 24, height: 24 }} />
          <button>New Chat</button>
          <EditIcon style={{ fontSize: 20 }} />
        </Button>

        <Button
          variant="outlined"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
          sx={{
            mb: 2,
            borderColor: '#9C27B0',
            color: '#9C27B0',
            ':hover': { borderColor: '#7B1FA2', color: '#7B1FA2' },
            width: '100%',
          }}
        >
          Back to Chat
        </Button>

        <Typography component='div' sx={{ mb: 1, fontWeight: 'bold' }}>
          Past Conversations
        </Typography>

        <List>
          {Object.keys(chats).map((title) => (
            <ListItem
              key={title}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteChat(title)}>
                  <DeleteIcon />
                </IconButton>
              }
              disablePadding
              sx={{
                backgroundColor: activeChatTitle === title ? '#D1A8FF' : '#D7C7F4',
                borderRadius: 1,
                mb: 1,
                px: 1,
              }}
            >
              <Box
                onClick={() => setActiveChatTitle(title)}
                sx={{ width: '100%', p: 1, cursor: 'pointer' }}
              >
                <ListItemText primary={title} />
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default ChatDrawer;