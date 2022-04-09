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

  const handleCreateMeeting = () => {
    axios
      .post('https://edulearn-vimeet.herokuapp.com/create-meeting')
      .then((res) =>
        setMeetingSrc(
          res.data.meeting_data.roomUrl +
            '?minimal&screenshare=on&chat=on&settingButton=on'
        )
      )
      .catch((err) => console.error(err));
    console.log(meetingSrc);
  };

  const handleJoinMeeting = () => {
    if (link.length > 5) {
      setMeetingSrc(link);
    }
    handleClose();
  };
  const handleClose = () => {
    setopen(false);
    setlink('');
  };
  const handleOpen = () => {
    setopen(true);
  };

  {
    if (meetingSrc !== null) {
      return (
        <Container
          sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          <Box sx={{ pb: 3, alignSelf: 'flex-end' }}>
            <CopyToClipboard text={meetingSrc} onCopy={() => setCopied(true)}>
              <Button
                variant='contained'
                sx={{
                  mx: 1,
                  backgroundColor: 'orange',
                  color: 'purple',
                }}
              >
                Copy Meeting Link
              </Button>
            </CopyToClipboard>
            <Button
              variant='contained'
              sx={{
                mx: 1,
                backgroundColor: 'red',
                color: 'purple',
              }}
              onClick={() => setMeetingSrc(null)}
            >
              Leave Meeting
            </Button>
          </Box>
          <iframe
            src={meetingSrc}
            allow='camera; microphone; fullscreen; speaker; display-capture'
            width={'100%'}
            height={'100%'}
          ></iframe>
        </Container>
      );
    } else {
      return (
        <Container>
          {open && (
            <Card
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '50%',
                bgcolor: '#fff',
                paddingX: 3,
                paddingY: 4,
                zIndex: 10,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography gutterBottom variant='h5' component='div'>
                  Join a Meeting
                </Typography>
                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </div>

              <CardContent>
                <TextField
                  id='outlined-basic'
                  label='Meeting Link'
                  variant='outlined'
                  value={link}
                  fullWidth
                  margin='normal'
                  onChange={(e) => setlink(e.target.value)}
                />
              </CardContent>

              <CardActions>
                <Button size='small' onClick={handleClose}>
                  Cancel
                </Button>
                <Button size='small' onClick={handleJoinMeeting}>
                  Submit
                </Button>
              </CardActions>
            </Card>
          )}
          <Box sx={{ pb: 3 }}>
            <Typography variant='h4' gutterBottom>
              Hi, {user.displayName} 👋
            </Typography>
            <Typography variant='body1'>
              You're doing great this week. Keep it up!
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card
                sx={{
                  borderRadius: 2,
                }}
              >
                {/* <RouterLink to={item.link} style={{ textDecoration: 'none' }}> */}
                <Box
                  sx={{
                    width: '100%',
                    paddingY: 2,
                    backgroundImage: `url(${images[2]})`,
                    backgroundSize: '100%',
                    backgroundRepeat: 'no-repeat',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Container
                    sx={{
                      py: 1,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography variant='h4' noWrap color='#fff'>
                      Confidently Learn or Teach from Home
                    </Typography>

                    <Typography component='span' variant='body1' color='#fff'>
                      Move from a chat or a phone call to a meeting with a
                      single click
                    </Typography>
                  </Container>
                  <Container
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Button
                      variant='contained'
                      onClick={handleOpen}
                      sx={{ mx: 1, backgroundColor: 'yellow', color: 'purple' }}
                    >
                      Join Meeting
                    </Button>
                    {isTeacher && (
                      <Button
                        variant='contained'
                        sx={{
                          mx: 1,
                          backgroundColor: 'orange',
                          color: 'purple',
                        }}
                        onClick={handleCreateMeeting}
                      >
                        Create Meeting
                      </Button>
                    )}
                  </Container>
                </Box>
                {/* </RouterLink> */}
              </Card>
            </Grid>
            {routingData.map((item) => (
              <Grid item xs={6}>
                <Card
                  sx={{
                    borderRadius: 2,
                  }}
                >
                  <RouterLink to={item.link} style={{ textDecoration: 'none' }}>
                    <Box
                      sx={{
                        width: '100%',
                        height: 200,
                        backgroundImage: `url(${item.imageUrl}), linear-gradient(#000, #000)`,
                        backgroundSize: '100%',
                        backgroundRepeat: 'no-repeat',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Container
                        sx={{
                          py: 2,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'column',
                        }}
                      >
                        <Typography variant='h3' noWrap color='#fff'>
                          {item.title.toUpperCase()}
                        </Typography>

                        <Typography
                          component='span'
                          variant='body1'
                          color='#fff'
                        >
                          {item.description}
                        </Typography>
                      </Container>
                    </Box>
                  </RouterLink>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      );
    }
  }
}
