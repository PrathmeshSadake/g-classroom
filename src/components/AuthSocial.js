// material
import { Stack, Button } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { db } from 'src/firebase/firebase-config';
// component
import Iconify from './Iconify';

export default function AuthSocial({ signInWithGoogle }) {
  const auth = getAuth();
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      navigate('/dashboard/app', { replace: true });
      const q = query(collection(db, 'users'), where('uid', '==', user.uid));
      getDocs(q).then((querySnapshot) => {
        console.log(querySnapshot);
        if (querySnapshot.docs.length === 0) {
          // create a new user
          addDoc(collection(db, 'users'), {
            uid: user.uid,
            enrolledClassrooms: [],
          });
        }
      });
    }
  }, [user]);

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
          signInWithGoogle();
        }}
      >
        <Iconify icon='eva:google-fill' color='#FFF' height={24} />
      </Button>
    </Stack>
  );
}
