import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import NotFound from './pages/Page404';
import AnnouncementScreen from './pages/AnnouncementsScreen';
import ScheduleScreen from './pages/Schedule';
import ChatScreen from './pages/Chatroom';
import ClassroomScreen from './pages/ClassroomsScreen';
import Classroom from './pages/Classroom';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ChatroomsScreen from './pages/Chatrooms';
import AssignmentScreen from './pages/AssignmentScreen';

// ----------------------------------------------------------------------

const routes = (isLoggedIn) => [
  {
    path: '/dashboard',
    element: isLoggedIn ? <DashboardLayout /> : <Navigate to='/login' />,
    children: [
      { path: 'app', element: <DashboardApp /> },
      { path: 'announcements', element: <AnnouncementScreen /> },
      { path: 'classroom', element: <ClassroomScreen /> },
      { path: 'classroom/:id', element: <Classroom /> },
      { path: 'assignments/:id', element: <AssignmentScreen /> },
      { path: 'messages', element: <ChatScreen /> },
      { path: 'chats-room', element: <ChatroomsScreen /> },
      { path: 'chats-room/:id', element: <ChatScreen /> },
      { path: 'schedule', element: <ScheduleScreen /> },
      { path: 'profile/me', element: <Profile /> },
    ],
  },
  {
    path: '/',
    element: <LogoOnlyLayout />,
    children: [
      { path: '/', element: <Navigate to='/dashboard/app' /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: '404', element: <NotFound /> },
      { path: '*', element: <Navigate to='/404' /> },
    ],
  },
  { path: '*', element: <Navigate to='/404' replace /> },
];

export default routes;
