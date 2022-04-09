// material
import { Stack, Button } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
// component
import Iconify from './Iconify';

export default function AuthSocial({ signInWithGoogle }) {
  const auth = getAuth();
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);
  return (
    <Stack direction='row' spacing={2} width={'50%'}>
      <Button
        fullWidth
        size='large'
        variant='contained'
        sx={{
          backgroundColor: '#4285F4',
          ':hover': {
            backgroundColor: '#005aed',
          },
        }}
        onClick={() => {
          if (user) {
            navigate('/dashboard/app', { replace: true });
          } else {
            signInWithGoogle();
            navigate('/dashboard/app', { replace: true });
          }
        }}
      >
        <Iconify icon='eva:google-fill' color='#FFF' height={24} />
      </Button>
    </Stack>
  );
}
