// 外部ライブラリ
import * as React from 'react';
import axios from "axios";
import { useLocation } from 'react-router-dom';
import UttranceInput from '../components/uttranceInput'
import Cataro from '../components/cataro';
import PersonaInfo from '../components/personaInfo';
import Grid from '@mui/material/Grid';



const Home = () => {
  const location = useLocation()
  const [sessionInfo, setSessionInfo] = React.useState(location.state)
  const [threadInfo, setThreadInfo] = React.useState(null)
  const [uttrances, setUttrances] = React.useState(null)
  const [utterance, setUtterance] = React.useState("")
  const [createdat, setCreatedat] = React.useState("0")
  const [userPersonaInfo, setUserPersonaInfo] = React.useState(null)
  const [systemPersonaInfo, setSystemPersonaInfo] = React.useState(null)

  React.useEffect(() => {
    startThread()
  }, [])

  // マウント直後に開始するThread生成関数
  const startThread = async () => {
    const baseURL = 'http://127.0.0.1:8080/api/thread'
    const now = Date.now()
    axios.post(baseURL, {
      title: String(now)
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Token '+ sessionInfo.token, 
      }
    })
    .then(res => {
      const threadInfo = res.data
      setThreadInfo(threadInfo)
    })
  }

  const postPersona = async (baseURL, message, utterance_uuid) => {
    try {
      await axios.post(baseURL, {
        thread: threadInfo.uuid,
        utterance: utterance_uuid,
        content: message,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization':'Token '+ sessionInfo.token, 
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
        thread: threadInfo.uuid,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization':'Token '+ sessionInfo.token, 
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
          'Authorization':'Token '+ sessionInfo.token, 
        },
        params: {
          thread: threadInfo.uuid
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
          'Authorization':'Token '+ sessionInfo.token, 
        },
        params: {
          thread: threadInfo.uuid
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
    <Grid 
      container 
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      <Grid item xs={6} md={6}>
        <Grid 
          container 
          direction="column"
          justifyContent="center"
          alignItems="center"
        > 
          <Grid item xs={12} md={12}>
            <Cataro inputInfo={ {'createdat': createdat, 'utterance': utterance} }/>
          </Grid>
          <Grid item xs={12} md={12}>
            <UttranceInput  onSendMessage={handleSendMessage}/>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={6} md={6}>
        <PersonaInfo personaInfo={{'personaInfo':userPersonaInfo, 'name':'ユーザー'}}></PersonaInfo>
        <PersonaInfo personaInfo={{'personaInfo':systemPersonaInfo, 'name':'システム'}}></PersonaInfo>
      </Grid>
    </Grid>
    </>
  );
};


export default Home;