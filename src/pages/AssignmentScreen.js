import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
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
import { collection, query, where } from 'firebase/firestore';

const AssignmentScreen = () => {
  let { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [copied, setCopied] = React.useState(true);

  // Tabs
  const [value, setValue] = React.useState('1');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(async () => {
    // Create a query against the collection.
    const q = query(collection(db, 'assignments'), where('id', '==', id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((d) => setAssignment(d.data()));
  }, [assignment]);

  return <Container></Container>;
};

export default AssignmentScreen;
