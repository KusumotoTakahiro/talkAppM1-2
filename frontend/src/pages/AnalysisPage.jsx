// Pure React
import * as React from 'react';

// Library
import axios from 'axios';

// Component
import PersonaInfo from '../components/personaInfo';
import TalkLog from '../components/talklog';

// MUI
import {
  Grid,
} from '@mui/material';

// Recoil
import { useRecoilValue } from 'recoil';
import { userInfo } from '../atoms/userInfo';



const Analysis = () => {
  const sessionToken = useRecoilValue(userInfo.session_token);
  // const userId = useRecoilValue(userInfo.user_id);
  const nowThread = useRecoilValue(userInfo.now_thread);
  const [userPersonaInfo, setUserPersonaInfo] = React.useState(null);
  const [systemPersonaInfo, setSystemPersonaInfo] = React.useState(null);
  const [uttrances, setUttrances] = React.useState(null);

  React.useEffect(() => {
    const baseURL = 'http://127.0.0.1:8080/api';

    // Persona情報の受け取り関数
    const getPersonaInfo = async (url, isUser) => {
      try {
        await axios.get(url, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization':'Token '+ sessionToken, 
          },
          params: {
            thread: nowThread
          },
        }).then((res) => {
          if (isUser) {
            setUserPersonaInfo(res.data);
          }
          else {
            setSystemPersonaInfo(res.data);
          }
        });
      }
      catch (error) {
        console.log(error);
      }
    }

    // 現在のThreadの会話歴をすべて受け取る関数.
    const getTalk = async () => {
      const baseURL = 'http://127.0.0.1:8080/api/Uttrance'
      try {
        await axios.get(baseURL, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization':'Token '+ sessionToken, 
          },
          params: {
            thread: nowThread
          },
        }).then((res) => {
          setUttrances(res.data);
        });
      }
      catch (error) {
        console.log(error);
      }
    }

    getPersonaInfo(baseURL+'/UserPersona', true);
    getPersonaInfo(baseURL+'/SystemPersona', false);
    getTalk();
  }, [sessionToken, nowThread])

  return (
    <>
      <Grid>
        <Grid item xs={12} md={12}>
          <PersonaInfo 
            personaInfo={{'personaInfo':userPersonaInfo, 'name':'ユーザー'}}
          ></PersonaInfo>
        </Grid>
        <Grid item xs={12} md={12}>
          <PersonaInfo 
            personaInfo={{'personaInfo':systemPersonaInfo, 'name':'システム'}}
          ></PersonaInfo>
        </Grid >
        <Grid item xs={12} md={12}>
        <TalkLog utterances={{'utterances': uttrances, 'name': ''}}/>
        </Grid>
      </Grid>
    </>
  )
}

export default Analysis;