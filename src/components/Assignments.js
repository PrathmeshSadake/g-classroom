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

const storage = getStorage();

const Assignments = () => {
  let { id } = useParams();
  const auth = getAuth();
  const [title, settitle] = React.useState('');

  const [classroom, setClassroom] = useState(null);
  const [assignments, setassignments] = useState([]);
  const [open, setopen] = React.useState(false);
  const [submissionOpen, setSubmissionOpen] = React.useState(false);
  const [uploadingopen, setuploadingopen] = React.useState(false);
  const [uploadingProgress, setuploadingProgress] = useState(0);
  const [uploadingMessage, setuploadingMessage] = useState('');
  const [user, loading, error] = useAuthState(auth);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFilePicked, setIsFilePicked] = useState(false);
  const changeHandler = (event) => {
    if (event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setIsFilePicked(true);
    } else {
      setSelectedFile(null);
      setIsFilePicked(false);
    }
  };

  const handleSubmission = () => {
    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, 'assignments/' + selectedFile.name);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);
    handleClose();
    settitle('');
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        setuploadingopen(true);
        setuploadingProgress(progress);
        switch (snapshot.state) {
          case 'paused':
            setuploadingMessage('Upload is paused');
            break;
          case 'running':
            setuploadingMessage('Upload is running');
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;

          // ...

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          const docRef = doc(db, 'classrooms', id);
          const assignmentId = uuidv4();
          const createdAt = moment().format('h:mm a, Do MMMM YYYY');
          addDoc(collection(db, 'assignments'), {
            authorId: user.uid,
            downloadURL,
            title,
            createdAt,
            name: user.displayName,
            submissions: [],
            id: assignmentId,
          });
          getDoc(docRef).then((docSnap) => {
            const classRoomData = docSnap.data();
            let tempAssignments = classRoomData.assignments;
            tempAssignments.push({
              authorId: user.uid,
              downloadURL,
              title,
              createdAt,
              createdTime: Date.now(),
              name: user.displayName,
              // submissions: [],
              id: assignmentId,
            });
            updateDoc(docRef, {
              assignments: tempAssignments,
            });
            handleClose();
            setSelectedFile(null);
            setIsFilePicked(false);
          });
        });

        handleClose();
        setSelectedFile(null);
        setIsFilePicked(false);
      }
    );
  };

  const handleAssignmentSubmission = () => {
    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, 'assignments/' + selectedFile.name);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        setuploadingopen(true);
        setuploadingProgress(progress);
        switch (snapshot.state) {
          case 'paused':
            setuploadingMessage('Upload is paused');
            break;
          case 'running':
            setuploadingMessage('Upload is running');
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;

          // ...

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          const docRef = doc(db, 'classrooms', id);
          getDoc(docRef).then((docSnap) => {
            const classRoomData = docSnap.data();
            let tempAssignments = classRoomData.assignments;
            tempAssignments.push({
              authorId: user.uid,
              downloadURL,
              title,
              createdAt: moment().format('h:mm a, Do MMMM YYYY'),
              createdTime: Date.now(),
              name: user.displayName,
              submissions: [],
              id: uuidv4(),
            });
            updateDoc(docRef, {
              assignments: tempAssignments,
            });
            handleClose();
            setSelectedFile(null);
            setIsFilePicked(false);
          });
        });

        handleClose();
        setSelectedFile(null);
        setIsFilePicked(false);
      }
    );
  };

  const handleClose = () => {
    setopen(false);
  };
  const handleOpen = () => {
    setopen(true);
  };

  const fetchAssignments = async () => {
    const docRef = doc(db, 'classrooms', id);
    const docSnap = await getDoc(docRef);
    const classRoomData = docSnap.data();
    const fetchedAssignment = classRoomData.assignments;
    fetchedAssignment.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.createdTime) - new Date(a.createdTime);
    });
    setassignments(fetchedAssignment);
  };

  console.log(assignments);

  useEffect(async () => {
    const docRef = doc(db, 'classrooms', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setClassroom(docSnap.data());
      fetchAssignments();
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!');
    }
  }, []);

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

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
              Upload a ClassWork
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
              onChange={(e) => settitle(e.target.value)}
            />
            <div>
              <Grid
                container
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}
              >
                <Grid item>
                  <Input
                    type='file'
                    name='file'
                    color='primary'
                    disableUnderline
                    fullWidth
                    margin='dense'
                    onChange={changeHandler}
                  />
                </Grid>
                {isFilePicked && (
                  <Grid item>
                    <IconButton
                      onClick={() => {
                        setIsFilePicked(false);
                        setSelectedFile(null);
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Grid>
                )}
              </Grid>

              {isFilePicked && (
                <div>
                  <p>Filename: {selectedFile.name}</p>
                  <p>Size: {formatBytes(selectedFile.size)}</p>
                  {/* <p>
                    lastModifiedDate:{' '}
                    {selectedFile.lastModifiedDate.toLocaleDateString()}
                  </p> */}
                </div>
              )}
            </div>
          </CardContent>

          <CardActions>
            <Button size='small' onClick={handleClose}>
              Cancel
            </Button>
            <Button
              size='small'
              onClick={() => {
                handleSubmission();
              }}
            >
              Submit
            </Button>
          </CardActions>
        </Card>
      )}

      {submissionOpen && (
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
            zIndex: 100,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography gutterBottom variant='h5' component='div'>
              Add Submission
            </Typography>
            <IconButton onClick={() => setSubmissionOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>

          <CardContent>
            <div>
              <Grid
                container
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 3,
                }}
              >
                <Grid item>
                  <Input
                    type='file'
                    name='file'
                    color='primary'
                    disableUnderline
                    fullWidth
                    margin='dense'
                    onChange={changeHandler}
                  />
                </Grid>
                {isFilePicked && (
                  <Grid item>
                    <IconButton
                      onClick={() => {
                        setIsFilePicked(false);
                        setSelectedFile(null);
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Grid>
                )}
              </Grid>

              {isFilePicked && (
                <div>
                  <p>Filename: {selectedFile.name}</p>
                  <p>Size: {formatBytes(selectedFile.size)}</p>
                  {/* <p>
                    lastModifiedDate:{' '}
                    {selectedFile.lastModifiedDate.toLocaleDateString()}
                  </p> */}
                </div>
              )}
            </div>
          </CardContent>

          <CardActions>
            <Button size='small' onClick={() => setSubmissionOpen(false)}>
              Cancel
            </Button>
            <Button size='small' onClick={handleAssignmentSubmission}>
              Submit
            </Button>
          </CardActions>
        </Card>
      )}

      {uploadingopen && (
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
          <CardContent>
            {uploadingProgress < 100 && (
              <Typography gutterBottom variant='h5' component='div'>
                {uploadingMessage}
              </Typography>
            )}

            {uploadingProgress < 100 ? (
              <LinearWithValueLabel progress={uploadingProgress} />
            ) : (
              <Typography gutterBottom variant='h6' component='div'>
                File uploaded successfully
              </Typography>
            )}
          </CardContent>

          <CardActions>
            <Button
              disabled={uploadingProgress !== 100}
              size='small'
              onClick={() => {
                setuploadingopen(false);
                fetchAssignments();
                setuploadingProgress(0);
              }}
            >
              Done
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
            Assignments
          </Typography>
        </Grid>

        <Grid item>
          <Button variant='contained' onClick={handleOpen}>
            Add Assignment
          </Button>
        </Grid>
      </Grid>
      {assignments.length < 1 ? (
        <Container>No assignments yet. Lucky you!</Container>
      ) : (
        assignments.map((work) => (
          <Container sx={{ my: 2 }}>
            <Alert
              variant='outlined'
              icon={false}
              action={
                <Tooltip title='Download'>
                  <IconButton>
                    <a
                      href={work.downloadURL}
                      target='_blank'
                      download
                      style={{ textDecoration: 'none' }}
                    >
                      <DownloadIcon />
                    </a>
                  </IconButton>
                </Tooltip>
              }
              severity='success'
            >
              <Container>
                <Link to={`/dashboard/assignment/${work.id}`}>
                  <Typography variant='h6' color={'#000'}>
                    {work.title}
                  </Typography>
                </Link>

                <p style={{ fontSize: 12 }}>{work.name}</p>
                <p style={{ fontSize: 10 }}>{work.createdAt}</p>

                {/* <Link
                  to={`/dashboard/assignment/${work.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Button
                    variant='contained'
                    size='small'
                    sx={{ mt: 2 }}
                    onClick={() => setSubmissionOpen(true)}
                  >
                    View Submissions
                  </Button>
                </Link>

                <Button
                  variant='contained'
                  size='small'
                  sx={{ mt: 2 }}
                  onClick={() => setSubmissionOpen(true)}
                >
                  Add Submission
                </Button> */}
              </Container>
            </Alert>
          </Container>
        ))
      )}
    </Container>
  );
};

export default Assignments;
