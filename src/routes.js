import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import DashboardApp from './pages/DashboardApp';
import NotFound from './pages/Page404';
import ClassroomScreen from './pages/ClassroomsScreen';
import Classroom from './pages/Classroom';
import Profile from './pages/Profile';
import AssignmentScreen from './pages/AssignmentScreen';

// ----------------------------------------------------------------------

const routes = (isLoggedIn) => [
  {
    path: '/dashboard',
    element: isLoggedIn ? <DashboardLayout /> : <Navigate to='/login' />,
    children: [
      { path: 'app', element: <DashboardApp /> },
      { path: 'classroom', element: <ClassroomScreen /> },
      { path: 'classroom/:id', element: <Classroom /> },
      { path: 'assignment/:id', element: <AssignmentScreen /> },
      { path: 'profile/me', element: <Profile /> },
    ],
  },
  {
    path: '/',
    element: <LogoOnlyLayout />,
    children: [
      { path: '/', element: <Navigate to='/dashboard/app' /> },
      { path: 'login', element: <Login /> },
      { path: '404', element: <NotFound /> },
      { path: '*', element: <Navigate to='/404' /> },
    ],
  },
  { path: '*', element: <Navigate to='/404' replace /> },
];

export default routes;
