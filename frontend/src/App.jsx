import { Routes, Route } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

import './css/App.css';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFound from "./pages/NotFoundPage"; 

function App() {
  const navigate = useNavigate();
  return (
    <div className='App' >
      <AppBar position='sticky' style={{ color: "#e0f2f1", backgroundColor: "#3c3c3c" }} >
        <Toolbar variant='dense'>
          <IconButton edge='start' color='inherit' aria-label='menu' onClick={()=>{navigate('/login')}}>
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' color='inherit' style={{ fontFamily:'serif' }}>
            TalkApp
          </Typography>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/talk" element={<HomePage/>} />
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/blog/:id" element={<BlogPage />} /> */}
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
