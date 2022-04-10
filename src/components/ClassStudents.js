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
  Input,
  Alert,
  Tooltip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import { v4 as uuidv4 } from 'uuid';

import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from 'src/firebase/firebase-config';
import { useAuthState } from 'react-firebase-hooks/auth';
import moment from 'moment';
import { getAuth } from 'firebase/auth';
import { Link, useParams } from 'react-router-dom';

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import LinearWithValueLabel from './LinearProgressWithLabel';
import { Avatar } from '@chatscope/chat-ui-kit-react';

const ClassStudents = () => {
  let { id } = useParams();
  const auth = getAuth();

  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [user, loading, error] = useAuthState(auth);

  useEffect(async () => {
    const docRef = doc(db, 'classrooms', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setClassroom(docSnap.data());
      setStudents(docSnap.data().students);
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!');
    }
  }, []);

  return (
    <Container>
      <Typography gutterBottom variant='h5' component='div'>
        {classroom && `Classroom Admin: ${classroom.creatorName}`}
      </Typography>
      <Typography gutterBottom variant='h5' component='div'>
        {classroom &&
          `Total ${students.length} ${
            students.length === 1 ? 'Student' : 'Students'
          }`}
      </Typography>

      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {students.map((student) => (
          <ListItem alignItems='flex-start'>
            <ListItemAvatar>
              <Avatar alt={student} />
            </ListItemAvatar>
            <ListItemText primary={student.name} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default ClassStudents;
