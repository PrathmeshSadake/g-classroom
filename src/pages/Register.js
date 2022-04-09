import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Card, Link, Container, Typography } from '@mui/material';
// layouts
import AuthLayout from '../layouts/AuthLayout';
// components
import Page from '../components/Page';
import { RegisterForm } from '../sections/authentication/register';
import AuthSocial from '../sections/authentication/AuthSocial';
import React from 'react';
import ModalUnstyled from '@mui/base/ModalUnstyled';
import CloseIcon from '@mui/icons-material/Close';

import {
  Button,
  Grid,
  Modal,
  IconButton,
  TextField,
  CardActions,
  CardContent,
  AlertTitle,
} from '@mui/material';
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

export default function Register() {
  const [open, setopen] = React.useState(false);

  const handleClose = () => {
    setopen(false);
  };
  const handleOpen = () => {
    setopen(true);
  };
  return (
    <RootStyle title='Register | Minimal-UI'>
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
            maxWidth: '50%',
            bgcolor: '#fff',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>

          <CardContent>
            <Typography gutterBottom variant='h5' component='div'>
              Please Enter a Valid Access Key!
            </Typography>
          </CardContent>
          <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button size='small' onClick={handleClose}>
              Cancel
            </Button>
            <Button size='small' onClick={handleClose}>
              Try Again
            </Button>
          </CardActions>
        </Card>
      </StyledModal>
      <AuthLayout>
        Already have an account? &nbsp;
        <Link
          underline='none'
          variant='subtitle2'
          component={RouterLink}
          to='/login'
        >
          Login
        </Link>
      </AuthLayout>

      <SectionStyle sx={{ display: { xs: 'none', md: 'flex' } }}>
        <Typography variant='h3' sx={{ px: 5, mt: 10, mb: 5 }}>
          Manage the online schooling more effectively with Edulearn
        </Typography>
        <img
          alt='register'
          src='/static/illustrations/illustration_register.png'
        />
      </SectionStyle>

      <Container>
        <ContentStyle>
          <Box sx={{ mb: 5 }}>
            <Typography variant='h4' gutterBottom>
              Get started absolutely free.
            </Typography>
          </Box>

          <AuthSocial />

          <RegisterForm handleOpen={handleOpen} />

          <Typography
            variant='body2'
            align='center'
            sx={{ color: 'text.secondary', mt: 3 }}
          >
            By registering, I agree to Minimal&nbsp;
            <Link underline='always' color='textPrimary'>
              Terms of Service
            </Link>
            &nbsp;and&nbsp;
            <Link underline='always' color='textPrimary'>
              Privacy Policy
            </Link>
            .
          </Typography>

          <Typography
            variant='subtitle2'
            sx={{
              mt: 3,
              textAlign: 'center',
              display: { sm: 'none' },
            }}
          >
            Already have an account?&nbsp;
            <Link underline='hover' to='/login' component={RouterLink}>
              Login
            </Link>
          </Typography>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
