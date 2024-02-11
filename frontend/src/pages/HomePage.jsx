// Pure React
import * as React from 'react';

// Library
import axios from "axios";

// Component
import UttranceInput from '../components/uttranceInput'
import Cataro from '../components/cataro';

// MUI
import {
  Grid,
  Button,
  Fab,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  List, 
  ListItem,
  Divider,
} from '@mui/material';


// Recoil
import { useRecoilValue, useRecoilState } from 'recoil';
import { userInfo } from '../atoms/userInfo';

import '../css/home.scss';



const Home = () => {
  // Recoil経由で保存しているuserのlogin時発行のtoken
  const sessionToken = useRecoilValue(userInfo.session_token);
  const userId = useRecoilValue(userInfo.user_id);
  const [nowThread, setNowThread] = useRecoilState(userInfo.now_thread);
  const [utterance, setUtterance] = React.useState("");
  const [createdat, setCreatedat] = React.useState("0");
  const [threadTitle, setThreadTitle] = React.useState(""); // 現在のThreadTitle
  const [newThreadTitle, setNewThreadTitle] = React.useState(String(Date.now())); // 新規作成の際のフォームで使う
  const [promptType, setPromptType] = React.useState('user_and_system_have_persona')
  const [open, setOpen] = React.useState(false);
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
          console.log(nowThread);
          if (threads.length > 0) {
            if (nowThread === '') {
              setNowThread(threads[threads.length - 1].uuid);
              setThreadTitle(threads[threads.length - 1].title);
            } else {
              let tempThread = threads.filter(thread => thread.uuid === nowThread)
              setThreadTitle(tempThread[0].title);
            }
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
    getThreads()
  }, [sessionToken, userId])

  const makeThread = async () => {
    const now = Date.now();
    axios.post(baseURL+'/thread', {
      title: newThreadTitle,
      user: userId,
      prompt_type: promptType,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization':'Token '+ sessionToken, 
      }
    })
    .then(res => {
      const threadInfo = res.data
      setNowThread(threadInfo.uuid)
      setThreadTitle(threadInfo.title)
      setNewThreadTitle(String(now));
      setPromptType('user_and_system_have_persona')
      setOpen(false);
    })
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
      })
      .catch(error => {
        console.log(error)
      })
    }
    catch (error) {
      console.log(error)
    }
  }

  const handleChangeTitle = (event) => {
    setThreadTitle(event.target.value);
  };

  const handleBlurTitle = async (event) => {
    try {
      await axios.patch(baseURL+'/thread/'+nowThread+'/', {
        title: threadTitle,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization':'Token '+ sessionToken, 
        }, 
      })
    }
    catch (error) {
      console.log(error)
    }
  }

  const changeTitle = (event) => {
    setNewThreadTitle(event.target.value);
  };

  const changePromptType = (event) => {
    setPromptType(event.target.value);
  }

  const handleOpen =  () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
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
      <>
        <TextField
          id="outlined-basic" 
          label="雑談タイトル" 
          variant="outlined"
          value={threadTitle}
          onChange={handleChangeTitle}
          onBlur={handleBlurTitle}
          style={{
            position: 'fixed',
            top: '100px',
            left: '30px',
            width: '300px',
            fontSize: '50px',
          }}
        />
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
        </Grid>
        <Fab 
          className='new-talk-button' 
          size='large'
          onClick={handleOpen}
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '30px',
            width: '200px',
            height: '100px',
            fontSize: '25px',
          }}
        >
          雑談を変える
        </Fab>
        <Dialog
          open={open}
          onClose={handleClose}
        >
          <DialogTitle>新しい雑談始める</DialogTitle>
          <DialogContent>
            <DialogContentText>
              タイトルとプロンプトを設定してください。<br/>
              変更がなければ、そのまま作成を押してください。<br/>
            </DialogContentText>
            <List>
              <Divider component="li" />
              <ListItem>
                <TextField
                  id="outlined-basic" 
                  label="雑談タイトル" 
                  variant="outlined"
                  value={newThreadTitle}
                  onChange={changeTitle}
                  style={{width: '100%'}}
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">プロンプトの設定</InputLabel>
                  <Select 
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    label="プロンプトの設定" 
                    value={promptType} 
                    onChange={changePromptType}
                  >
                    <MenuItem value={'user_and_system_have_persona'}>
                      ユーザとシステムのペルソナあり
                    </MenuItem>
                    <MenuItem value={'user_have_persona'}>
                      ユーザのペルソナあり
                    </MenuItem>
                    <MenuItem value={'system_have_persona'}>
                      システムのペルソナあり
                    </MenuItem>
                    <MenuItem value={'no_persona'}>
                      ペルソナなし(ChatGPTのみ)
                    </MenuItem>
                  </Select>
                </FormControl>
              </ListItem>
              <Divider component="li" />
            </List>
            
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>キャンセル</Button>
            <Button onClick={makeThread}>作成する</Button>
          </DialogActions>
        </Dialog>
      
      </>
    }
    </>
  );
};


export default Home;