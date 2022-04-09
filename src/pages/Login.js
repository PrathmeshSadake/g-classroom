import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Card, Stack, Link, Container, Typography } from '@mui/material';
// layouts
import AuthLayout from '../layouts/AuthLayout';
// components
import Page from '../components/Page';

import { getAuth } from 'firebase/auth';
import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import AuthSocial from 'src/components/AuthSocial';
import { useEffect } from 'react';

const auth = getAuth();

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  width: '100%',
  maxHeight: '100%',
  flexDirection: 'column',
  justifyContent: 'center',
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  // maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate('/dashboard/app', { replace: true });
    }
  }, [user]);

  return (
    <RootStyle title='G Classroom'>
      <Container maxWidth='sm'>
        <ContentStyle>
          <Typography variant='h3'>Welcome to G Classroom</Typography>
          <Typography variant='h6'>Please sign in to Continue</Typography>
          <Stack sx={{ mb: 5 }}></Stack>
          <AuthSocial signInWithGoogle={signInWithGoogle} />
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
