import * as Yup from 'yup';
import React, { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
// material
import {
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';

import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { addDoc, getDocs, query, collection, where } from 'firebase/firestore';

import { db } from 'src/firebase/firebase-config';

export default function RegisterForm({ handleOpen }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const auth = getAuth();

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('First name required'),
    lastName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Last name required'),
    email: Yup.string()
      .email('Email must be a valid email address')
      .required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const accessKeys = ['v678123', 'v098321', 'v456987', 'v394857', 'v102938'];
  const [key, setkey] = useState('');

  const match = () => {
    console.log(key);
    if (accessKeys.indexOf(key) > -1) {
      return true;
    } else {
      return false;
    }
  };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    validationSchema: RegisterSchema,
    onSubmit: () => {
      if (role == 'Teacher' && !match()) {
        console.log('Enter a valid access key!');
        handleOpen();
        setSubmitting(false);
        return;
      }
      createUserWithEmailAndPassword(auth, values.email, values.password)
        .then(() =>
          updateProfile(auth.currentUser, {
            displayName: `${values.firstName} ${values.lastName}`,
          })
            .then(() => {
              console.log(`Profile updated!`);
              if (role == 'Teacher') {
                const teacherQ = query(
                  collection(db, 'teachers'),
                  where('uid', '==', auth.currentUser.uid)
                );

                getDocs(teacherQ).then((querySnapshot) => {
                  if (querySnapshot.docs.length === 0) {
                    // create a new user
                    addDoc(collection(db, 'teachers'), {
                      uid: auth.currentUser.uid,
                    });
                  }
                });
              }
              const q = query(
                collection(db, 'users'),
                where('uid', '==', auth.currentUser.uid)
              );

              getDocs(q).then((querySnapshot) => {
                if (querySnapshot.docs.length === 0) {
                  // create a new user
                  addDoc(collection(db, 'users'), {
                    uid: auth.currentUser.uid,
                    enrolledClassrooms: [],
                    chatrooms: [],
                  });
                }
              });
              navigate('/dashboard/app', { replace: true });
            })
            .catch((error) => {
              setSubmitting(false);

              console.log(`An error occurred`, error);
            })
        )
        .catch((error) => {
          setSubmitting(false);

          console.log(`An error occurred`, error);
        });
    },
  });

  const {
    errors,
    touched,
    values,
    handleSubmit,
    isSubmitting,
    getFieldProps,
    setSubmitting,
  } = formik;
  const [role, setrole] = React.useState('Student');
  const handleRoleChange = (e) => {
    setrole(e.target.value);
  };
  return (
    <FormikProvider value={formik}>
      <Form autoComplete='off' noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label='First name'
              {...getFieldProps('firstName')}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />

            <TextField
              fullWidth
              label='Last name'
              {...getFieldProps('lastName')}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />
          </Stack>

          <TextField
            fullWidth
            autoComplete='username'
            type='email'
            label='Email address'
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete='current-password'
            type={showPassword ? 'text' : 'password'}
            label='Password'
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    edge='end'
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    <Iconify
                      icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Role</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={role}
              label='Role'
              onChange={handleRoleChange}
            >
              <MenuItem value={'Student'}>Student</MenuItem>
              <MenuItem value={'Teacher'}>Teacher</MenuItem>
            </Select>
          </FormControl>
          {role == 'Teacher' && (
            <TextField
              fullWidth
              label='Access Key'
              value={key}
              onChange={(e) => setkey(e.target.value)}
            />
          )}

          <LoadingButton
            fullWidth
            size='large'
            type='submit'
            variant='contained'
            loading={isSubmitting}
          >
            Register
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
