import ClassIcon from '@mui/icons-material/Class';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import ForumIcon from '@mui/icons-material/Forum';
import DashboardIcon from '@mui/icons-material/Dashboard';

const sidebarConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: <DashboardIcon />,
  },
  {
    title: 'classroom',
    path: '/dashboard/classroom',
    icon: <ClassIcon />,
  },
  {
    title: 'schedule',
    path: '/dashboard/schedule',
    icon: <CalendarTodayIcon />,
  },
  // {
  //   title: 'messages',
  //   path: '/dashboard/messages',
  //   icon: <ForumIcon />,
  // },
  {
    title: 'messages',
    path: '/dashboard/chats-room',
    icon: <ForumIcon />,
  },
  {
    title: 'announcements',
    path: '/dashboard/announcements',
    icon: <AnnouncementIcon />,
  },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: getIcon('eva:lock-fill'),
  // },
  // {
  //   title: 'register',
  //   path: '/register',
  //   icon: getIcon('eva:person-add-fill'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: getIcon('eva:alert-triangle-fill'),
  // },
];

export default sidebarConfig;
