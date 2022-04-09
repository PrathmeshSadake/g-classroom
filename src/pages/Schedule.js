import React from 'react';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/system';
import ModalUnstyled from '@mui/base/ModalUnstyled';
import { TimePicker, DateTimePicker } from '@mui/lab';
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  getDocs,
  onSnapshot,
  query,
  getDoc,
} from 'firebase/firestore';

import { db } from 'src/firebase/firebase-config';
import {
  Button,
  Card,
  CardContent,
  IconButton,
  TextField,
  CardActions,
  Container,
  Typography,
  CircularProgress,
} from '@mui/material';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import useIsTeacher from 'src/hooks/useIsTeacher';
import Moment from 'react-moment';
import moment from 'moment';

const auth = getAuth();

const ScheduleScreen = () => {
  const [open, setopen] = React.useState(false);
  const [title, settitle] = React.useState('');
  const [desc, setdesc] = React.useState('');
  const [link, setlink] = React.useState('');
  const [events, setevents] = React.useState([]);
  const [clickedEventID, setClickedEventID] = React.useState(null);
  const [clickedEvent, setClickedEvent] = React.useState(null);
  const [eventOpen, setEventOpen] = React.useState(false);

  const [date, setdate] = React.useState(null);
  const [user, loading, error] = useAuthState(auth);
  const isTeacher = useIsTeacher();
  const handleTitleChange = (event) => {
    settitle(event.target.value);
  };
  const handleLinkChange = (event) => {
    setlink(event.target.value);
  };
  const handleDateClick = (dateClickInfo) => {
    const date = new Date(dateClickInfo.date).toISOString();
    setdate(date);
    // setValue(date);
    // console.log(date);
    setopen(true);
  };
  const handleDescChange = (event) => {
    setdesc(event.target.value);
  };

  const handleClose = () => {
    setopen(false);
  };

  const handleAddEventSubmit = async () => {
    const docRef = await addDoc(collection(db, 'events'), {
      title,
      description: desc,
      link: link,
      date: new Date(date).toISOString(),
      createdBy: user.uid,
      createdName: user.displayName,
      createdAt: Date.now(),
    });
    await updateDoc(docRef, {
      id: docRef.id,
    });

    console.log('Document written with ID: ', docRef.id);
    fetchEvents();
    handleClose();
    settitle('');
    setdate('');
    setlink('');
    setdesc('');
  };

  const handleEventClick = async (info) => {
    // alert('Event: ' + info.event.title);
    info.jsEvent.preventDefault();
    setClickedEventID(info.event.id);
    setEventOpen(true);

    const docRef = doc(db, 'events', info.event.id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setClickedEvent(docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!');
    }
  };
  console.log(clickedEvent);

  const fetchEvents = async () => {
    let eventsData = [];
    const querySnapshot = await getDocs(collection(db, 'events'));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      eventsData.push(doc.data());
    });
    setevents(eventsData);
  };

  React.useEffect(() => {
    fetchEvents();
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
      {open && (
        <Card
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '50%',
            bgcolor: '#fff',
            p: 2,
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography gutterBottom variant='h5' component='div'>
              Create a Class
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
            <TextField
              id='outlined-multiline-static'
              label='Link'
              fullWidth
              margin='normal'
              value={link}
              onChange={handleLinkChange}
            />
            <DateTimePicker
              renderInput={(props) => (
                <TextField margin='normal' fullWidth {...props} />
              )}
              label='Date and Time'
              value={date}
              onChange={(newValue) => {
                setdate(newValue);
              }}
            />
          </CardContent>

          <CardActions>
            <Button size='small' onClick={handleClose}>
              Cancel
            </Button>
            <Button size='small' onClick={handleAddEventSubmit}>
              Submit
            </Button>
          </CardActions>
        </Card>
      )}

      {eventOpen && (
        <Card
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '50%',
            bgcolor: '#fff',
            p: 2,
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '20px',
            }}
          >
            <Typography gutterBottom variant='h5' component='div'>
              Class Information
            </Typography>
            <IconButton onClick={() => setEventOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>
          {!clickedEvent ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '300px',
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            <div>
              <CardContent>
                <TextField
                  id='outlined-basic'
                  label='Title'
                  variant='outlined'
                  value={clickedEvent.title}
                  fullWidth
                  disabled
                  margin='normal'
                />
                {clickedEvent.description.length > 0 && (
                  <TextField
                    id='outlined-multiline-static'
                    label='Description'
                    multiline
                    rows={3}
                    fullWidth
                    disabled
                    margin='normal'
                    value={clickedEvent.description}
                  />
                )}

                <TextField
                  id='outlined-multiline-static'
                  label='Date and Time'
                  fullWidth
                  disabled
                  margin='normal'
                  value={moment(clickedEvent.date).format(
                    'Do MMMM YYYY, h:mm a'
                  )}
                />
                {clickedEvent.link.length > 0 ? (
                  <TextField
                    id='outlined-multiline-static'
                    label='Link'
                    fullWidth
                    disabled
                    margin='normal'
                    value={clickedEvent.link}
                  />
                ) : (
                  <Typography gutterBottom variant='body1' component='div' color={'red'}>
                    Class Meeting Link not available kindly check after
                    sometime!
                  </Typography>
                )}
              </CardContent>

              <CardActions>
                {/* <Button size='small' onClick={() => setEventOpen(false)}>
              Cancel
            </Button> */}
                {/* <Button size='small' onClick={handleAddEventSubmit}>
              Submit
            </Button> */}
              </CardActions>
            </div>
          )}
        </Card>
      )}

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView='dayGridMonth'
        selectable={isTeacher}
        events={events}
        dateClick={isTeacher ? handleDateClick : null}
        eventClick={handleEventClick}
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short',
        }}
        eventColor={'#04AB56'}
        eventBackgroundColor='#04ab56'
      />
    </Container>
  );
};

export default ScheduleScreen;
