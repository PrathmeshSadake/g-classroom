import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { collection, query, where } from 'firebase/firestore';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { db } from 'src/firebase/firebase-config';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { getAuth } from 'firebase/auth';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
  Typography,
  Button,
  IconButton,
  TextField,
  Card,
  CardActions,
  Container,
  CardContent,
  Box,
  Grid,
  Alert,
} from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import moment from 'moment';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Announcements from 'src/components/Announcements';
import ClassWork from 'src/components/ClassWork';
import ClassSubmissions from 'src/components/Submissions';
import Assignments from 'src/components/Assignments';
import ClassStudents from 'src/components/ClassStudents';

const AssignmentScreen = () => {
  let { id } = useParams();
  const [assignment, setAssignment] = useState(null);

  console.log(id);

  useEffect(async () => {
    const assignmentRef = collection(db, 'assignments');
    const q = query(assignmentRef, where('id', '==', id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, ' => ', doc.data());
      setAssignment(doc.data());
    });
  }, []);

  return (
    <Container>
      {assignment ? (
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Container>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}
                >
                  <AssignmentIndIcon sx={{ fontSize: 50 }} color='primary' />
                  <Typography
                    sx={{ fontSize: 50, fontWeight: '600' }}
                    color='primary'
                  >
                    {assignment.title}
                  </Typography>
                </div>

                <Typography
                  variant='body1'
                  component='p'
                  color='text.secondary'
                >
                  {assignment.name}
                </Typography>
                <Typography
                  variant='body2'
                  component='p'
                  color='text.secondary'
                >
                  {assignment.createdAt}
                </Typography>
              </Container>
            </Grid>
            <Grid item xs={4}>
              <Card sx={{ width: '100%', borderRadius: '10px', p: 2 }}>
                <CardContent>
                  <Typography
                    sx={{
                      fontSize: 30,
                      fontWeight: '600',
                    }}
                    color='primary'
                  >
                    Your work
                  </Typography>
                  <Typography
                    variant='body2'
                    component='p'
                    color='text.secondary'
                  >
                    Assigned
                  </Typography>
                </CardContent>

                <Button
                  variant='outlined'
                  sx={{ boxShadow: 'none', width: '100%', my: 2 }}
                  component={'a'}
                >
                  <a
                    href={assignment.downloadURL}
                    target='_blank'
                    style={{ textDecoration: 'none' }}
                  >
                    Download Assignment
                  </a>
                </Button>
                <Button
                  variant='contained'
                  sx={{ boxShadow: 'none', width: '100%' }}
                >
                  Add Submission
                </Button>
              </Card>
            </Grid>
          </Grid>
        </Container>
      ) : (
        <Container>
          <Typography color='#fff' variant='h3'>
            No Assignment Found
          </Typography>
        </Container>
      )}
    </Container>
  );
};

export default AssignmentScreen;
