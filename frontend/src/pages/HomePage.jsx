// 外部ライブラリ
import * as React from 'react';
import axios from "axios";
import { useLocation } from 'react-router-dom';


const Home = () => {
  const location = useLocation()
  const [sessionInfo, setSessionInfo] = React.useState(location.state)
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
  }, [])
  return (
    <>
      {sessionInfo.token}
    </>
  );
};


export default Home;