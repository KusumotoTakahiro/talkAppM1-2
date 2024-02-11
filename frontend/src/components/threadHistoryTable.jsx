// Pure React
import * as React from 'react';

// MUI 
import {
  List, 
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Collapse,
  IconButton,
  Divider,
} from '@mui/material';
import { TransitionGroup } from 'react-transition-group';

// icons
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';



const ThreadHistoryTable =  (
    {
      threads, 
      nowThread, 
      handleThreadSelect,
    }
  ) => {

  const generateTable = () => {
    return threads.map((thread, index) => (
      <Collapse key={index}>
        <ListItem key={index}>
          <ListItemButton 
            onClick={(event) => {
              handleThreadSelect(event, thread)
            }}
            disableRipple
          >
            <ListItemAvatar>
              <IconButton>
                {thread.uuid === nowThread ? (
                  <Avatar
                    style={{
                      color: '#333333',
                      backgroundColor: '#deb887'
                    }}
                  >
                    <CheckBoxOutlinedIcon/>
                  </Avatar>
                ) : (
                  <Avatar
                    style={{
                      color: '#333333',
                      backgroundColor: '#deb887'
                    }}
                  >
                    <CheckBoxOutlineBlankIcon/>
                  </Avatar>
                )}
              </IconButton>
            </ListItemAvatar>
            <ListItemText> {thread.title} </ListItemText>
            <ListItemText> {thread.created_at} </ListItemText>
            <ListItemText> {thread.prompt_type} </ListItemText>
          </ListItemButton>
        </ListItem>
        <Divider component="li" />
      </Collapse>
    ))
  }


  return (
    <List style={{width:'60%'}}>
      <ListItem>
        <ListItemText>雑談スレッドのタイトル</ListItemText>
        <ListItemText>雑談スレッドの作成日</ListItemText>
        <ListItemText>プロンプトタイプ</ListItemText>
      </ListItem>
      <Divider component="li" />
      <TransitionGroup>
        {generateTable()}
      </TransitionGroup>
    </List>
  )
}

export default ThreadHistoryTable;