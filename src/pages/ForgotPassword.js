import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { LoadingButton } from '@mui/lab';

import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import {
  Card,
  Stack,
  Link,
  Container,
  Typography,
  TextField,
} from '@mui/material';
// layouts
import AuthLayout from '../layouts/AuthLayout';
// components
import Page from '../components/Page';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}));

const ForgotPassword = () => {
  const auth = getAuth();
  const [email, setemail] = useState('');
  const [loading, setloading] = useState(false);

  const handleSendEmail = () => {
    setloading(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log(`Password reset email sent!`);
        setloading(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  return (
    <RootStyle title='Edulearn'>
      <AuthLayout>
        Don’t have an account? &nbsp;
        <Link
          underline='none'
          variant='subtitle2'
          component={RouterLink}
          to='/register'
        >
          Get started
        </Link>
      </AuthLayout>

      <SectionStyle sx={{ display: { xs: 'none', md: 'flex' } }}>
        <Typography variant='h3' sx={{ px: 5, mt: 10, mb: 5 }}>
          Trouble Logging in?
        </Typography>
        <img src='/static/illustrations/illustration_login.png' alt='login' />
      </SectionStyle>

      <Container maxWidth='sm'>
        <ContentStyle>
          <Stack sx={{ mb: 5 }}>
            <Typography variant='h4' gutterBottom>
              Forgot your password?
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Enter your registered email below to receive password reset
              instructions
            </Typography>
          </Stack>

          <TextField
            fullWidth
            type='email'
            label='Email address'
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />
          <LoadingButton
            fullWidth
            size='large'
            type='submit'
            variant='contained'
            disabled={!email.length > 3}
            loading={loading}
            sx={{ my: 3 }}
            onClick={handleSendEmail}
          >
            Save
          </LoadingButton>

          <Typography
            variant='body2'
            align='center'
            sx={{
              mt: 3,
              display: { sm: 'none' },
            }}
          >
            Don’t have an account?&nbsp;
            <Link
              variant='subtitle2'
              component={RouterLink}
              to='register'
              underline='hover'
            >
              Get started
            </Link>
          </Typography>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
};

export default ForgotPassword;
