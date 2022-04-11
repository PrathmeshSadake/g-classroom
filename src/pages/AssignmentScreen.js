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
import { db, storage } from 'src/firebase/firebase-config';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAuth } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';

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
  Input,
} from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import moment from 'moment';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import LinearWithValueLabel from 'src/components/LinearProgressWithLabel';

const AssignmentScreen = () => {
  let { id } = useParams();
  const auth = getAuth();
  const [title, settitle] = React.useState('');

  const [assignment, setAssignment] = useState(null);
  const [open, setopen] = React.useState(false);
  const [submissionOpen, setSubmissionOpen] = React.useState(false);
  const [uploadingopen, setuploadingopen] = React.useState(false);
  const [uploadingProgress, setuploadingProgress] = useState(0);
  const [uploadingMessage, setuploadingMessage] = useState('');
  const [user, loading, error] = useAuthState(auth);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const changeHandler = (event) => {
    if (event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setIsFilePicked(true);
    } else {
      setSelectedFile(null);
      setIsFilePicked(false);
    }
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
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          // console.log('File available at', downloadURL);
          let submissions = assignment.submissions.push({
            submittedBy: user.uid,
            submittedUser: user.displayName,
            submittedAt: moment().format('h:mm a, Do MMMM YYYY'),
            fileUrl: downloadURL,
          });
          const assignmentRef = doc(db, 'assignments', id);
          await updateDoc(assignmentRef, {
            submissions: submissions,
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

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

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
            zIndex: 100,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography gutterBottom variant='h5' component='div'>
              Add Submission
            </Typography>
            <IconButton onClick={() => setopen(false)}>
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
            <Button size='small' onClick={() => setopen(false)}>
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
                // fetchAssignments();
                setuploadingProgress(0);
              }}
            >
              Done
            </Button>
          </CardActions>
        </Card>
      )}
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
                  onClick={handleOpen}
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
