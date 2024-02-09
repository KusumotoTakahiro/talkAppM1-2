// 外部ライブラリ
import * as React from 'react';
import axios from "axios";
import UttranceInput from '../components/uttranceInput'
import Cataro from '../components/cataro';
import PersonaInfo from '../components/personaInfo';
import TalkLog from '../components/talklog';
import {
  Grid,
  Button,
} from '@mui/material';
import { useRecoilValue, useRecoilState } from 'recoil';
import { userInfo } from '../atoms/userInfo';

import '../css/home.scss';



const Home = () => {
  // Recoil経由で保存しているuserのlogin時発行のtoken
  const sessionToken = useRecoilValue(userInfo.session_token)
  const userId = useRecoilValue(userInfo.user_id)
  const [nowThread, setNowThread] = useRecoilState(userInfo.now_thread)
  const [uttrances, setUttrances] = React.useState(null)
  const [utterance, setUtterance] = React.useState("")
  const [createdat, setCreatedat] = React.useState("0")
  const [userPersonaInfo, setUserPersonaInfo] = React.useState(null)
  const [systemPersonaInfo, setSystemPersonaInfo] = React.useState(null)

  React.useEffect(() => {
    getThreads()
  }, [])

  const makeThread = async () => {
    const baseURL = 'http://127.0.0.1:8080/api/thread'
    const now = Date.now()
    axios.post(baseURL, {
      title: String(now),
      user: userId,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Token '+ sessionToken, 
      }
    })
    .then(res => {
      const threadInfo = res.data
      setNowThread(threadInfo.uuid)
    })
  }

  const getThreads = async () => {
    const baseURL = 'http://127.0.0.1:8080/api/thread'
    try {
      await axios.get(baseURL, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization':'Token '+ sessionToken, 
        },
        params: {
          user : userId,
        },
      }).then((res) => {
        const threads = res.data;
        if (threads.length > 0) {
          setNowThread(threads[0].uuid);
        }
        else {
          setNowThread('');
        }
      });
    }
    catch (error) {
      console.log(error);
    }
  }

  const postPersona = async (baseURL, message, utterance_uuid) => {
    try {
      await axios.post(baseURL, {
        thread: nowThread,
        utterance: utterance_uuid,
        content: message,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization':'Token '+ sessionToken, 
        }
      })
      .then(res => {
        console.log(res)
      })
    } catch (error) {
      console.log(error)
    }
  }

  // uttranceInputで使う関数
  const handleSendMessage = async (message) => {
    const baseURL = 'http://127.0.0.1:8080/api'
    try {
      await axios.post(baseURL+'/Uttrance', {
        content: message,
        talker: 'user',
        thread: nowThread,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization':'Token '+ sessionToken, 
        }
      })
      .then(async res => {
        const data = res.data
        const user_data = data.user
        const system_data = data.system
        setUtterance(system_data.content)
        setCreatedat(String(Date.now()))
        await postPersona(baseURL+'/UserPersona', user_data.content, user_data.uuid)
        await postPersona(baseURL+'/SystemPersona', system_data.content, system_data.uuid)
        await getPersonaInfo(baseURL+'/UserPersona', true)
        await getPersonaInfo(baseURL+'/SystemPersona', false)
        handleGetMessage()
      })
      .catch(error => {
        console.log(error)
      })
    }
    catch (error) {
      console.log(error)
    }
  }

  // メッセージの受け取り関数.
  const handleGetMessage = async () => {
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

  return (
    <>
    { 
      nowThread === '' ? 
      <>
      <div className="center-container">
        <div className="content">
          <p className='para'>過去の雑談履歴はありません。</p>
          <Button className='custom-button' onClick={makeThread}>雑談を開始する</Button>
        </div>
      </div>
      </> 
      : 
      <Grid 
        container 
        direction="row"
        justifyContent="center"
        alignItems="center"
        style={{ height: '85vh' }}
      >
        <Grid item xs={6} md={6}>
          <Grid 
            container 
            direction="column"
            justifyContent="center"
            alignItems="center"
          > 
            <Grid item xs={12} md={12} >
              <Cataro inputInfo={ {'createdat': createdat, 'utterance': utterance} }/>
            </Grid>
            <Grid item xs={12} md={12} >
              <UttranceInput  onSendMessage={handleSendMessage}/>
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid item xs={6} md={6} sx={{ overflowY: 'auto', maxHeight: '90vh' }} >
          <PersonaInfo personaInfo={{'personaInfo':userPersonaInfo, 'name':'ユーザー'}}></PersonaInfo>
          <PersonaInfo personaInfo={{'personaInfo':systemPersonaInfo, 'name':'システム'}}></PersonaInfo>
          <TalkLog utterances={{'utterances': uttrances, 'name': ''}}/>
        </Grid> */}
      </Grid>
    }
    </>
  );
};


export default Home;