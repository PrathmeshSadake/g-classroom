import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
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

const Classroom = () => {
  let { id } = useParams();

  const [classroom, setClassroom] = useState(null);
  const [copied, setCopied] = React.useState(true);

  // Tabs
  const [value, setValue] = React.useState('1');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(async () => {
    const docRef = doc(db, 'classrooms', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setClassroom(docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!');
    }
  }, []);

  return (
    <Container>
      {classroom ? (
        <Container>
          <Box
            sx={{
              width: '100%',
              height: 200,
              background: `url(${classroom.banner})`,
              backgroundSize: '100%',
              backgroundRepeat: 'no-repeat',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography color='#fff' variant='h3'>
              {classroom.name}
            </Typography>
            <Typography color='#fff' variant='body1'>
              {classroom.creatorName}
            </Typography>

            <CopyToClipboard text={id} onCopy={() => setCopied(true)}>
              <Button
                variant='outlined'
                sx={{
                  my: 2,
                  borderColor: '#fff',
                  color: '#fff',
                }}
              >
                Copy Invite Code
                <ContentCopyIcon sx={{ ml: 1 }} />
              </Button>
            </CopyToClipboard>
          </Box>

          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList
                  onChange={handleChange}
                  aria-label='lab API tabs example'
                  // centered
                >
                  <Tab label='Announcements' value='1' />
                  <Tab label='Assignments' value='2' />
                  <Tab label='Class Work' value='3' />
                </TabList>
              </Box>
              <TabPanel value='1'>
                <Announcements />
              </TabPanel>
              <TabPanel value='2'>
                <Assignments />
              </TabPanel>
              <TabPanel value='3'>
                <ClassWork />
              </TabPanel>
            </TabContext>
          </Box>
        </Container>
      ) : (
        <Container>
          <Typography color='#fff' variant='h3'>
            No Classroom
          </Typography>
        </Container>
      )}
    </Container>
  );
};

export default Classroom;
