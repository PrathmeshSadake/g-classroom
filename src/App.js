import { firebaseApp } from './firebase/firebase-config';

// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
import routes from './routes';
import { useRoutes } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/lab';
const auth = getAuth(firebaseApp);

// ----------------------------------------------------------------------

export default function App() {
  const [user, loading, error] = useAuthState(auth);
  const routing = useRoutes(routes(user));
  return (
    <ThemeConfig>
      <LocalizationProvider dateAdapter={DateAdapter}>
        <ScrollToTop />
        <GlobalStyles />
        {routing}
      </LocalizationProvider>
    </ThemeConfig>
  );
}
