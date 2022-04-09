// material
import {
  Box,
  Grid,
  Container,
  Typography,
  Card,
  Button,
  IconButton,
  TextField,
  CardContent,
  CardActions,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import {} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

import { useAuthState } from 'react-firebase-hooks/auth';
// components
import { getAuth } from 'firebase/auth';
import React from 'react';
import useIsTeacher from 'src/hooks/useIsTeacher';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default function DashboardApp() {
  const auth = getAuth();
  const isTeacher = useIsTeacher();
  const [open, setopen] = React.useState(false);
  const [user, loading, error] = useAuthState(auth);
  const [meetingSrc, setMeetingSrc] = React.useState(null);
  const [link, setlink] = React.useState('');
  const [copied, setCopied] = React.useState(true);

  const images = [
    'https://res.cloudinary.com/prathmeshsadake-devprojects/image/upload/v1647760258/edulearn/1_dfdurx.jpg',
    'https://res.cloudinary.com/prathmeshsadake-devprojects/image/upload/v1647760257/edulearn/2_sstp9r.jpg',
    'https://res.cloudinary.com/prathmeshsadake-devprojects/image/upload/v1647760256/edulearn/3_sxsfdf.jpg',
    'https://res.cloudinary.com/prathmeshsadake-devprojects/image/upload/v1647760256/edulearn/4_wrzkoh.jpg',
  ];
  const routingData = [
    {
      title: 'Classroom',
      description: '',
      imageUrl: images[0],
      link: '/dashboard/classroom',
    },
    {
      title: 'Schedule',
      description: '',
      imageUrl: images[1],
      link: '/dashboard/schedule',
    },
    {
      title: 'Messages',
      description: '',
      imageUrl: images[2],
      link: '/dashboard/chats-room',
    },
    {
      title: 'Announcements',
      description: '',
      imageUrl: images[3],
      link: '/dashboard/announcements',
    },
  ];

  return (
    <Container>
      <Box sx={{ pb: 3 }}>
        <Typography variant='h4' gutterBottom>
          Hi, {user.displayName} 👋
        </Typography>
        <Typography variant='body1'>
          You're doing great this week. Keep it up!
        </Typography>
      </Box>
    </Container>
  );
}
