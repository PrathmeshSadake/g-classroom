import * as React from 'react';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Moment from 'react-moment';
import { styled } from '@mui/system';
import ModalUnstyled from '@mui/base/ModalUnstyled';
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  getDoc,
} from 'firebase/firestore';

import { db } from 'src/firebase/firebase-config';

import {
  Typography,
  Button,
  Grid,
  Box,
  Modal,
  IconButton,
  TextField,
  Card,
  CardActions,
  Container,
  CardContent,
  AlertTitle,
} from '@mui/material';

import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import useIsTeacher from 'src/hooks/useIsTeacher';

const auth = getAuth();

export default function AnnouncementScreen() {
  const [open, setopen] = React.useState(false);
  const [updateOpen, setUpdateOpen] = React.useState(false);
  const [title, settitle] = React.useState('');
  const [desc, setdesc] = React.useState('');
  const [updatingDocId, setUpdatingDocId] = React.useState('');
  const [announcements, setAnnouncements] = React.useState([]);
  const [user, loading, error] = useAuthState(auth);
  const [updateTitle, setupdateTitle] = React.useState('');
  const [updateDesc, setUpdateDesc] = React.useState('');

  const isTeacher = useIsTeacher();

  console.log(announcements);

  const handleTitleChange = (event) => {
    settitle(event.target.value);
  };
  const handleDescChange = (event) => {
    setdesc(event.target.value);
  };

  const handleClose = () => {
    setopen(false);
  };
  const handleOpen = () => {
    setopen(true);
  };

  const handleAnnouncementSubmit = async () => {
    const docRef = await addDoc(collection(db, 'announcements'), {
      title: title,
      description: desc,
      createdBy: user.uid,
      timestamp: serverTimestamp(),
    });
    await updateDoc(docRef, {
      id: docRef.id,
    });
    fetchAnnouncements();
    console.log('Document written with ID: ', docRef.id);
    handleClose();
    settitle('');
    setdesc('');
  };
  const handleAnnouncementDelete = async (id) => {
    await deleteDoc(doc(db, 'announcements', id));
    fetchAnnouncements();
  };
  const openUpdateAnnouncementModal = async (id) => {
    setupdateTitle();
    setUpdateDesc();
    setUpdateOpen(true);
    setUpdatingDocId(id);
    const announcementRef = doc(db, 'announcements', id);
    const docSnap = await getDoc(announcementRef);
    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data());
      const data = docSnap.data();
      setupdateTitle(data.title);
      setUpdateDesc(data.description);
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!');
    }
  };
  const handleUpdateAnnouncement = async () => {
    const announcementRef = doc(db, 'announcements', updatingDocId);
    await updateDoc(announcementRef, {
      title: updateTitle,
      description: updateDesc,
    });
    setupdateTitle();
    setUpdateDesc();
    setUpdateOpen(false);
    fetchAnnouncements();
  };

  const fetchAnnouncements = () => {
    const fetchedAnnouncements = [];
    getDocs(collection(db, 'announcements')).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        fetchedAnnouncements.push(doc.data());
      });
      setAnnouncements(fetchedAnnouncements);
    });
  };

  React.useEffect(() => {
    fetchAnnouncements();
  }, []);

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

  return (
    <Container>
      {/* <StyledModal
        aria-labelledby='unstyled-modal-title'
        aria-describedby='unstyled-modal-description'
        open={open}
        onClose={handleClose}
        BackdropComponent={Backdrop}
      > */}
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
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography gutterBottom variant='h5' component='div'>
              Create an Announcement
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
            <Button size='small' onClick={handleAnnouncementSubmit}>
              Submit
            </Button>
          </CardActions>
        </Card>
      )}
      {/* </StyledModal> */}
      {updateOpen && (
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
              Update an Announcement
            </Typography>
            <IconButton onClick={() => setUpdateOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>

          <CardContent>
            <TextField
              id='outlined-basic'
              label='Title'
              variant='outlined'
              value={updateTitle}
              fullWidth
              margin='normal'
              onChange={(e) => setupdateTitle(e.target.value)}
            />
            <TextField
              id='outlined-multiline-static'
              label='Description'
              multiline
              rows={3}
              fullWidth
              margin='normal'
              value={updateDesc}
              onChange={(e) => setUpdateDesc(e.target.value)}
            />
          </CardContent>

          <CardActions>
            <Button size='small' onClick={() => setUpdateOpen(false)}>
              Cancel
            </Button>
            <Button size='small' onClick={handleUpdateAnnouncement}>
              Submit
            </Button>
          </CardActions>
        </Card>
      )}
      <Grid
        container
        spacing={2}
        sx={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <Grid item>
          <Typography gutterBottom variant='h5' component='div'>
            Announcements
          </Typography>
        </Grid>
        {isTeacher && (
          <Grid item>
            <Button variant='contained' onClick={handleOpen}>
              Create Announcement
            </Button>
          </Grid>
        )}
      </Grid>
      <Container sx={{ py: 5 }}>
        {announcements.map((announcement) => (
          <Alert
            severity='success'
            key={announcement.id}
            sx={{ marginY: 2, border: '0.25px solid green' }}
            action={
              user.uid === announcement.createdBy ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <IconButton
                    color='inherit'
                    size='small'
                    onClick={() => openUpdateAnnouncementModal(announcement.id)}
                    sx={{ my: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color='inherit'
                    size='small'
                    onClick={() => handleAnnouncementDelete(announcement.id)}
                    sx={{ my: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              ) : null
            }
          >
            <AlertTitle> {announcement.title}</AlertTitle>
            <Moment format='DD/MM/YYYY'>
              {new Date(announcement.timestamp.toDate())}
            </Moment>
            <p>{announcement.description}</p>
          </Alert>
        ))}
      </Container>
    </Container>
  );
}
