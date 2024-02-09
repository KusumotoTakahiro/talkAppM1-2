import * as React from 'react';
import { useNavigate } from 'react-router-dom';

// MUI
import {
  Grid,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography
} from '@mui/material';

import { useRecoilState } from 'recoil';
import { userInfo } from '../atoms/userInfo';

import LogoutIcon from '@mui/icons-material/Logout';

const LogoutCheck = () => {
  const [sessionToken, setSessionToken] = useRecoilState(userInfo.session_token)
  const [userId, setUserId] = useRecoilState(userInfo.user_id)
  const navigate = useNavigate()

  const logout = () => {
    setSessionToken('')
    setUserId('')
    navigate("/login", {replace:true})
  }
  return (
    <>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        height="100vh" // 画面の高さいっぱいに広げる
      >
        <Grid item>
          <Card sx={{ maxWidth: 500 }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                LogOut
              </Typography>
              <LogoutIcon style={{fontSize: 100}}></LogoutIcon>
            </CardContent>
            <CardActions>
              <Button
                className='custom-button'
                onClick={logout}
              >ログアウトします</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default LogoutCheck;