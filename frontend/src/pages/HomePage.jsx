// 外部ライブラリ
import * as React from 'react';
import axios from "axios";
import { useLocation } from 'react-router-dom';
import UttranceInput from '../components/uttranceInput'
import Cataro from '../components/cataro';
import Grid from '@mui/material/Grid';


const Home = () => {
  const location = useLocation()
  const [sessionInfo, setSessionInfo] = React.useState(location.state)
  const [threadInfo, setThreadInfo] = React.useState(null)
  const [uttrances, setUttrances] = React.useState(null)
  const [inputFlag, setInputFlag] = React.useState("0")

  React.useEffect(() => {
    // この形で情報が取れる
    axios.get("http://127.0.0.1:8080/account/accounts/", {
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Token '+ sessionInfo.token, 
      }
    })
    .then(res=>{
      console.log(res);
    })
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

  // uttranceInputで使う関数
  const handleSendMessage = async (message) => {
    const baseURL = 'http://127.0.0.1:8080/api/Uttrance'
    try {
      await axios.post(baseURL, {
        content: message,
        talker: 'user',
        thread: threadInfo.uuid,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization':'Token '+ sessionInfo.token, 
        }
      })
      .then(res => {
        handleGetMessage()
        setInputFlag(String(Date.now()))
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
        }
      }).then((res) => {
        setUttrances(res.data);
      });
    }
    catch (error) {
      console.log(error)
    }
  }

  return (
    <>
    <Grid 
      container 
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Grid item xs={12} md={12}>
        <Cataro inputFlag={ inputFlag }/>
      </Grid>
      <Grid item xs={12} md={12}>
        <UttranceInput  onSendMessage={handleSendMessage}/>
      </Grid>
    </Grid>
    </>
  );
};


export default Home;