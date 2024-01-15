import '../css/uttranceInput.scss';
import { ReactComponent as PaperPlaneIcon } from '../images/paperPlane.svg';
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';


function UttranceInput({ onSendMessage }) {
  const [message, setMessage] = useState('');

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      onSendMessage(message);
      setMessage("");
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if ((event.shiftKey) && event.key === 'Enter') {
        return;
      }
      event.preventDefault();
      handleSendMessage();
    }
  }

  return (
    <>
      <div className="message-input-container">
        <TextField
          id="outlined-multiline-flexible"
          className="text"
          placeholder="メッセージを入力してください．．．"
          multiline
          maxRows={10}
          value={message}
          onChange={handleMessageChange}
          onKeyDown={handleKeyPress}
          fullWidth
          variant="outlined"
        />
        <button className='send-button' onClick={handleSendMessage}>
          <PaperPlaneIcon className='send-button-icon' />
        </button>
      </div>
    </>
  )
}

export default UttranceInput;