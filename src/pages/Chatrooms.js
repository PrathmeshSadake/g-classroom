import React, { useEffect } from 'react';
import {
  Container,
  Grid,
  Button,
  Typography,
  IconButton,
  TextField,
  Card,
  CardActions,
  CardContent,
} from '@mui/material';
import { styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';

import ModalUnstyled from '@mui/base/ModalUnstyled';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection,
  onSnapshot,
  query,
  where,
  updateDoc,
  doc,
  addDoc,
  getDocs,
  getDoc,
  arrayUnion,
} from 'firebase/firestore';

import useIsTeacher from 'src/hooks/useIsTeacher';
import { db } from 'src/firebase/firebase-config';
import ChatroomCard from 'src/components/ChatroomCard';

const auth = getAuth();

const StyledModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Backdrop = styled('div')`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;
const ChatroomsScreen = () => {
  const [open, setopen] = React.useState(false);
  const [joinOpen, setJoinOpen] = React.useState(false);
  const [title, settitle] = React.useState('');
  const [joiningChatroomId, setJoiningChatroomId] = React.useState('');
  const [desc, setdesc] = React.useState('');
  const [chatrooms, setchatrooms] = React.useState([]);
  const [user, loading, error] = useAuthState(auth);
  const isTeacher = useIsTeacher();

  const handleTitleChange = (event) => {
    settitle(event.target.value);
  };
  const handleDescChange = (event) => {
    setdesc(event.target.value);
  };

  const handleClose = () => {
    setopen(false);
  };
  const handleJoinOpen = () => {
    setJoinOpen(true);
  };

  const handleJoinClose = () => {
    setJoinOpen(false);
  };
  const handleOpen = () => {
    setopen(true);
  };
  const images = [
    'https://res.cloudinary.com/prathmeshsadake-devprojects/image/upload/v1647760258/edulearn/1_dfdurx.jpg',
    'https://res.cloudinary.com/prathmeshsadake-devprojects/image/upload/v1647760257/edulearn/2_sstp9r.jpg',
    'https://res.cloudinary.com/prathmeshsadake-devprojects/image/upload/v1647760256/edulearn/3_sxsfdf.jpg',
    'https://res.cloudinary.com/prathmeshsadake-devprojects/image/upload/v1647760256/edulearn/4_wrzkoh.jpg',
  ];
  var imageURL = images[Math.floor(Math.random() * images.length)];
  const handleCreateClassroom = async () => {
    // console.log(imageURL);
    try {
      const chatroomRef = await addDoc(collection(db, 'chatrooms'), {
        creatorUid: user.uid,
        name: title,
        creatorName: user.displayName,
        banner: imageURL,
        messages: [],
      });
      updateDoc(chatroomRef, {
        id: chatroomRef.id,
      });
      const chatroomSnap = await getDoc(chatroomRef);
      const chatroom = chatroomSnap.data();

      const userQ = query(
        collection(db, 'users'),
        where('uid', '==', user.uid)
      );
      getDocs(userQ).then((userRef) => {
        const docId = userRef.docs[0].id;
        const userData = userRef.docs[0].data();
        let userChatrooms = userData.chatrooms;
        userChatrooms.push({
          id: chatroomRef.id,
          name: title,
          creatorName: user.displayName,
          banner: chatroom.banner,
          creatorPhoto: user.photoURL,
        });
        const docRef = doc(db, 'users', docId);
        // const docSnap = await getDoc(docRef);
        updateDoc(docRef, {
          chatrooms: userChatrooms,
        });
      });
      handleClose();
      settitle('');
      setdesc('');
      // alert('Classroom created successfully!');
    } catch (err) {
      alert(`Cannot create class - ${err.message}`);
    }
  };

  const handleJoinClassroom = async () => {
    try {
      const chatroomRef = doc(db, 'chatrooms', joiningChatroomId);
      const chatroomSnap = await getDoc(chatroomRef);
      if (!chatroomSnap.exists()) {
        return alert(`Chatroom doesn't exist, please provide correct ID`);
      }
      const chatroom = chatroomSnap.data();
      console.log(chatroom);
      const userQ = query(
        collection(db, 'users'),
        where('uid', '==', user.uid)
      );
      getDocs(userQ).then((userRef) => {
        const docId = userRef.docs[0].id;
        const userData = userRef.docs[0].data();
        let userChatrooms = userData.chatrooms;
        console.log(userChatrooms);
        userChatrooms.push({
          id: chatroom.id,
          name: chatroom.name,
          banner: chatroom.banner,
          creatorName: chatroom.creatorName,
          // creatorPhoto: chatroom.creatorPhoto,
        });

        const docRef = doc(db, 'users', docId);
        // const docSnap = await getDoc(docRef);
        updateDoc(docRef, {
          chatrooms: userChatrooms,
        })
          .then(() => console.log(`Chatroom updated`))
          .catch((e) => console.log(e.message));
        setJoinOpen(false);
        setJoiningChatroomId('');
      });
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const fetchChatrooms = async () => {
    try {
      const userQ = query(
        collection(db, 'users'),
        where('uid', '==', user.uid)
      );

      onSnapshot(userQ, (querySnapshot) => {
        setchatrooms(querySnapshot?.docs[0]?.data().chatrooms);
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (loading) return;
    fetchChatrooms();
  }, [user, loading]);

  return (
    <Container>
      <StyledModal
        aria-labelledby='unstyled-modal-title'
        aria-describedby='unstyled-modal-description'
        open={open}
        onClose={handleClose}
        BackdropComponent={Backdrop}
      >
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
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography gutterBottom variant='h5' component='div'>
              Create a new Chat Room
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>

          <CardContent>
            <TextField
              id='outlined-basic'
              label='Title'
              variant='outlined'
              value={title}
              fullWidth
              margin='normal'
              onChange={handleTitleChange}
            />
            <TextField
              id='outlined-multiline-static'
              label='Description'
              multiline
              rows={3}
              fullWidth
              margin='normal'
              value={desc}
              onChange={handleDescChange}
            />
          </CardContent>

          <CardActions>
            <Button size='small' onClick={handleClose}>
              Cancel
            </Button>
            <Button size='small' onClick={handleCreateClassroom}>
              Create
            </Button>
          </CardActions>
        </Card>
      </StyledModal>

      <StyledModal
        aria-labelledby='unstyled-modal-title'
        aria-describedby='unstyled-modal-description'
        open={joinOpen}
        onClose={handleJoinClose}
        BackdropComponent={Backdrop}
      >
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
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography gutterBottom variant='h5' component='div'>
              Join a new Chatroom
            </Typography>
            <IconButton onClick={handleJoinClose}>
              <CloseIcon />
            </IconButton>
          </div>

          <CardContent>
            <TextField
              id='outlined-basic'
              label='Classroom ID'
              variant='outlined'
              value={joiningChatroomId}
              fullWidth
              margin='normal'
              onChange={(e) => setJoiningChatroomId(e.target.value)}
            />
          </CardContent>

          <CardActions>
            <Button size='small' onClick={handleJoinClose}>
              Cancel
            </Button>
            <Button size='small' onClick={handleJoinClassroom}>
              Join
            </Button>
          </CardActions>
        </Card>
      </StyledModal>
      <Grid
        container
        sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}
      >
        <Grid item>
          <Typography gutterBottom variant='h5' component='div'>
            Your Chatrooms
          </Typography>
        </Grid>
        <Grid item sx={{ display: 'flex', justifyContent: '', mb: 4 }}>
          <Grid item>
            <Button variant='contained' sx={{ mr: 3 }} onClick={handleJoinOpen}>
              Join Chatroom
            </Button>
          </Grid>
          {isTeacher && (
            <Grid item>
              <Button variant='contained' onClick={handleOpen}>
                Create Chatroom
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
      {chatrooms.length === 0 ? (
        <Typography
          gutterBottom
          variant='h5'
          component='div'
          textAlign={'center'}
        >
          Chatrooms not found Please Join One
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {chatrooms.map((classroom) => (
            <Grid item xs={4}>
              <ChatroomCard classroom={classroom} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ChatroomsScreen;
