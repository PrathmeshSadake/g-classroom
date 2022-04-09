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
  Container,
  Avatar,
  Grid,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { getAuth, updateProfile } from 'firebase/auth';
import { addDoc, getDocs, query, collection, where } from 'firebase/firestore';

export default function Profile({ handleOpen }) {
  const navigate = useNavigate();
  const [password, setpassword] = useState('');
  const [confirmpassword, setconfirmpassword] = useState('');
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
  });

  const formik = useFormik({
    initialValues: {
      firstName: auth.currentUser.displayName.split(' ')[0],
      lastName: auth.currentUser.displayName.split(' ')[1],
      email: auth.currentUser.email,
      password: '',
    },
    validationSchema: RegisterSchema,
    onSubmit: () =>
      updateProfile(auth.currentUser, {
        displayName: `${values.firstName} ${values.lastName}`,
      })
        .then(() => {
          console.log(`Profile updated!`);
        })
        .catch(() => {
          console.log(`Profile updation Failed!`);
        }),
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

  console.log(auth.currentUser);
  return (
    <Container
      maxWidth='md'
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Container
            sx={{ display: 'flex', justifyContent: 'flex-start', mb: 4 }}
          >
            <Avatar
              src={
                auth.currentUser.photoURL
                  ? auth.currentUser.photoURL
                  : '/static/mock-images/avatars/avatar_default.jpg'
              }
              alt='photoURL'
              sx={{ width: 100, height: 100 }}
            />
          </Container>
        </Grid>
        <Grid item xs={8}>
          <FormikProvider value={formik}>
            <Form autoComplete='off' noValidate onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    label='First name'
                    value={auth.currentUser.displayName.split(' ')[0]}
                  />

                  <TextField
                    fullWidth
                    label='Last name'
                    value={auth.currentUser.displayName.split(' ')[1]}
                  />
                </Stack>

                <TextField
                  fullWidth
                  type='email'
                  label='Email address'
                  {...getFieldProps('email')}
                  disabled
                />
              </Stack>
            </Form>
          </FormikProvider>
        </Grid>
      </Grid>
    </Container>
  );
}
