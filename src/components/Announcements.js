import React, { useState, useEffect } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {
  Typography,
  Button,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardActions,
  Container,
  CardContent,
  Box,
  Grid,
  Accordion,
  IconButton,
  TextField,
} from '@mui/material';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from 'src/firebase/firebase-config';
import { useAuthState } from 'react-firebase-hooks/auth';
import moment from 'moment';
import { getAuth } from 'firebase/auth';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { useParams } from 'react-router-dom';
import useIsTeacher from 'src/hooks/useIsTeacher';

const Announcements = () => {
  let { id } = useParams();
  const auth = getAuth();

  const [classroom, setClassroom] = useState(null);
  const [classroomAnnouncements, setClassroomAnnouncements] = useState([]);
  const [open, setopen] = React.useState(false);
  const [title, settitle] = React.useState('');
  const [description, setdescription] = React.useState('');
  const [user, loading, error] = useAuthState(auth);
  const isTeacher = useIsTeacher();
  // Tabs
  const [value, setValue] = React.useState('1');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleTitleChange = (event) => {
    settitle(event.target.value);
  };
  const handleDescChange = (event) => {
    setdescription(event.target.value);
  };

  const handleClose = () => {
    setopen(false);
  };
  const handleOpen = () => {
    setopen(true);
  };
  const handleAnnouncementSubmit = async () => {
    const docRef = doc(db, 'classrooms', id);
    const docSnap = await getDoc(docRef);
    const classRoomData = docSnap.data();
    let tempAnnouncements = classRoomData.announcements;
    tempAnnouncements.push({
      authorId: user.uid,
      content: { title, description },
      createdAt: moment().format('h:mm a, Do MMMM YYYY'),
      name: user.displayName,
    });
    updateDoc(docRef, {
      announcements: tempAnnouncements,
    });
    fetchClassAnnouncements();
    handleClose();
    settitle('');
    setdescription('');
  };

  console.log(classroom);

  const fetchClassAnnouncements = async () => {
    const docRef = doc(db, 'classrooms', id);
    const docSnap = await getDoc(docRef);
    const classRoomData = docSnap.data();
    setClassroomAnnouncements(classRoomData.announcements);
  };

  useEffect(async () => {
    const docRef = doc(db, 'classrooms', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setClassroom(docSnap.data());
      fetchClassAnnouncements();
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!');
    }
  }, []);

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
              value={description}
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
      <Grid
        container
        sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}
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
      {/* <Container> */}
      {classroomAnnouncements.map((announcement) => (
        <Accordion sx={{ border: '0.5px solid #3FCD71', my: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'
          >
            <Container>
              <Typography>{announcement.content.title}</Typography>
              <p style={{ fontSize: 12 }}>{announcement.name}</p>
              <p style={{ fontSize: 10 }}>{announcement.createdAt}</p>
            </Container>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{announcement.content.description}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
      {/* </Container> */}
    </Container>
  );
};

export default Announcements;
