// Pure React
import * as React from 'react';
import { Routes, Route } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

// Recoil
import {
  useRecoilValue,
} from 'recoil';
import { userInfo } from './atoms/userInfo';

// MUI
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

// pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFound from "./pages/NotFoundPage"; 
import AnalysisPage from "./pages/AnalysisPage";
import LogoutCheck from './pages/LogoutCheck';
import History from './pages/HistoryPage';

// icons

import MenuIcon from '@mui/icons-material/Menu';
import ChatIcon from '@mui/icons-material/Chat';
import StorageIcon from '@mui/icons-material/Storage';
import LogoutIcon from '@mui/icons-material/Logout';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

// CSS
import './css/App.css';


function App() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const sessionToken = useRecoilValue(userInfo.session_token);

  // 関数クロージャ(関数を展開せずに返す関数)
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' 
      && (event.key === 'Tab')||(event.key === 'Shift')) 
    {
      return;
    }
    setOpen(open);
  }

  const iconList = [
    <ChatIcon/>,
    <StorageIcon/>,
    <ManageSearchIcon/>,
    <LogoutIcon/>,
  ]

  const drawerItem = [
    'Talk with Cataro',
    'Analysis',
    'History',
    'Logout',
  ]

  const routePath = [
    '/talk',
    '/analysis',
    '/history',
    '/logout',
  ]

  const drawerList = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      {
        sessionToken === "" ? 
        <List>
          {drawerItem.map((text, index) => (
            <ListItem 
              key={text} 
              disablePadding
            >
              <ListItemButton
                onClick={() => {
                  navigate(routePath[index])
                }}
                disabled
              >
                <ListItemIcon>{iconList[index]}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List> 
        : <List>
          {drawerItem.map((text, index) => (
            <ListItem 
              key={text} 
              disablePadding
            >
              <ListItemButton
                onClick={() => {
                  navigate(routePath[index])
                }}
              >
                <ListItemIcon>{iconList[index]}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      }
      
    </Box>
  );


  return (
    <div className='App' >
      <AppBar position='sticky' style={{ color: "#e0f2f1", backgroundColor: "#3c3c3c" }} >
        <Toolbar variant='dense'>
          <IconButton 
            edge='start' 
            color='inherit' 
            aria-label='menu' 
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' color='inherit' style={{ fontFamily:'serif' }}>
            TalkApp
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor={'left'}
        open={open}
        onClose={toggleDrawer(false)}
      >
        {drawerList()}
      </Drawer>
      <Routes>
        <Route path="/talk" element={<HomePage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/logout" element={<LogoutCheck/>} />
        <Route path="/history" element={<History/>} />
        {/* <Route path="/blog/:id" element={<BlogPage />} /> */}
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
