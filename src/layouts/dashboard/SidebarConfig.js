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
];

export default sidebarConfig;
