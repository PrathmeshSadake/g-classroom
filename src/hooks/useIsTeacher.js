import React from 'react';
import { getAuth } from 'firebase/auth';
import { addDoc, getDocs, query, collection, where } from 'firebase/firestore';

import { db } from 'src/firebase/firebase-config';
import { useAuthState } from 'react-firebase-hooks/auth';

const useIsTeacher = () => {
  const auth = getAuth();
  const [isTeacher, setIsTeacher] = React.useState(false);
  const [user, loading, error] = useAuthState(auth);

  // console.log(auth.currentUser.uid);
  const teacherQ = query(
    collection(db, 'teachers'),
    where('uid', '==', user.uid)
  );
  getDocs(teacherQ).then((querySnapshot) => {
    // console.log(querySnapshot.docs);
    if (querySnapshot.docs.length !== 0) {
      setIsTeacher(true);
    }
  });

  return isTeacher;
};

export default useIsTeacher;
