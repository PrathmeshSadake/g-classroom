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

import ClassroomCard from '../components/ClassroomCard';
import useIsTeacher from 'src/hooks/useIsTeacher';
import { db } from 'src/firebase/firebase-config';

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
const ClassroomScreen = () => {
  const [open, setopen] = React.useState(false);
  const [joinOpen, setJoinOpen] = React.useState(false);
  const [title, settitle] = React.useState('');
  const [joiningClassId, setJoiningClassId] = React.useState('');
  const [desc, setdesc] = React.useState('');
  const [classrooms, setclassrooms] = React.useState([]);
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
  var imageURL = '/static/illustrations/bg.png';
  const handleCreateClassroom = async () => {
    // console.log(imageURL);
    try {
      const classRef = await addDoc(collection(db, 'classrooms'), {
        creatorUid: user.uid,
        name: title,
        creatorName: user.displayName,
        banner: imageURL,
        creatorPhoto: user.photoURL,
        classwork: [],
        submissions: [],
        assignments: [],
        students: [],
      });
      updateDoc(classRef, {
        id: classRef.id,
      });
      const classSnap = await getDoc(classRef);
      const classData = classSnap.data();
      let classStudents = classData.students;
      let isPresent = classStudents.find((student) => student.uid === user.uid);
      if (!isPresent) {
        classStudents.push({
          name: user.displayName,
          uid: user.uid,
          avatar: user.photoURL,
        });
      }
      updateDoc(classRef, {
        students: classStudents,
      });
      const userQ = query(
        collection(db, 'users'),
        where('uid', '==', user.uid)
      );
      getDocs(userQ).then((userRef) => {
        const docId = userRef.docs[0].id;
        const userData = userRef.docs[0].data();
        let userClasses = userData.enrolledClassrooms;
        userClasses.push({
          id: classRef.id,
          name: title,
          creatorName: user.displayName,
          banner: classData.banner,
          creatorPhoto: user.photoURL,
        });
        const docRef = doc(db, 'users', docId);
        // const docSnap = await getDoc(docRef);
        updateDoc(docRef, {
          enrolledClassrooms: userClasses,
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
      const classRef = doc(db, 'classrooms', joiningClassId);
      const classSnap = await getDoc(classRef);
      if (!classSnap.exists()) {
        return alert(`Class doesn't exist, please provide correct ID`);
      }
      const classData = classSnap.data();
      let classStudents = classData.students;
      let isPresent = classStudents.find((student) => student.uid === user.uid);
      if (!isPresent) {
        classStudents.push({
          name: user.displayName,
          uid: user.uid,
          avatar: user.photoURL,
        });
      }
      updateDoc(classRef, {
        students: classStudents,
      });
      const userQ = query(
        collection(db, 'users'),
        where('uid', '==', user.uid)
      );
      getDocs(userQ).then((userRef) => {
        const docId = userRef.docs[0].id;
        const userData = userRef.docs[0].data();
        let userClasses = userData.enrolledClassrooms;
        console.log(userClasses);
        userClasses.push({
          id: classData.id,
          name: classData.name,
          banner: classData.banner,
          creatorName: classData.creatorName,
          creatorPhoto: classData.creatorPhoto,
        });
        // console.log(userClasses);

        const docRef = doc(db, 'users', docId);
        // const docSnap = await getDoc(docRef);
        updateDoc(docRef, {
          enrolledClassrooms: userClasses,
        })
          .then(() => console.log(`ClassRoom updated`))
          .catch((e) => console.log(e.message));
        setJoinOpen(false);
        setJoiningClassId('');
      });
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const fetchClasses = async () => {
    try {
      const userQ = query(
        collection(db, 'users'),
        where('uid', '==', user.uid)
      );

      onSnapshot(userQ, (querySnapshot) => {
        setclassrooms(querySnapshot?.docs[0]?.data().enrolledClassrooms);
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (loading) return;
    fetchClasses();
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
              Create a new Classroom
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
              Create a new Classroom
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
              value={joiningClassId}
              fullWidth
              margin='normal'
              onChange={(e) => setJoiningClassId(e.target.value)}
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
            Your Classrooms
          </Typography>
        </Grid>
        <Grid item sx={{ display: 'flex', justifyContent: '', mb: 4 }}>
          <Grid item>
            <Button variant='contained' sx={{ mr: 3 }} onClick={handleJoinOpen}>
              Join Classroom
            </Button>
          </Grid>

          <Grid item>
            <Button variant='outlined' onClick={handleOpen}>
              Create Classroom
            </Button>
          </Grid>
        </Grid>
      </Grid>
      {classrooms.length === 0 ? (
        <Typography
          gutterBottom
          variant='h5'
          component='div'
          textAlign={'center'}
        >
          Classrooms not found Please Join One
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {classrooms.map((classroom) => (
            <Grid item xs={4}>
              <ClassroomCard classroom={classroom} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ClassroomScreen;
