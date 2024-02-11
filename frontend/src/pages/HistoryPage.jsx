// Pure React
import * as React from 'react';

// Library
import axios from 'axios';

// MUI
import {
  Box,
} from '@mui/material';

// Component
import ThreadHistoryTable from '../components/threadHistoryTable';

// Recoil
import { useRecoilValue, useRecoilState } from 'recoil';
import { userInfo } from '../atoms/userInfo';



const History = () => {
  const sessionToken = useRecoilValue(userInfo.session_token);
  const userId = useRecoilValue(userInfo.user_id);
  const [nowThread, setNowThread] = useRecoilState(userInfo.now_thread);
  const [ownThreads, setOwnThreads] = useRecoilState(userInfo.own_threads);
  const baseURL = 'http://127.0.0.1:8080/api';

  React.useEffect(() => {
    const getThreads = async () => {
      try {
        await axios.get(baseURL+'/thread', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization':'Token '+ sessionToken, 
          },
          params: {
            user : userId,
          },
        }).then((res) => {
          const threads = res.data;
          setOwnThreads(threads);
        });
      }
      catch (error) {
        console.log(error);
      }
    }
    getThreads()
  }, [sessionToken, userId])

  const handleThreadSelect = (event, thread) => {
    setNowThread(thread.uuid);
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: '85vh', // 画面の高さいっぱいに要素を配置する場合
        padding: '30px'
      }}
    >
      <ThreadHistoryTable 
        threads={ownThreads} 
        nowThread={nowThread}
        handleThreadSelect={handleThreadSelect}
      />
    </Box>
    
  )
}

export default History;