import React, { useEffect, useState } from "react";
import mouse_open_cat from '../images/cataro1.png';
import mouse_close_cat from '../images/cataro2.png';
import '../css/cataro.scss'
import Grid from '@mui/material/Grid'

const Cataro = ({ inputInfo }) => {
  const [closeMouse, setCloseMouse] = React.useState(true)
  React.useEffect(() => {
    if (inputInfo.utterance !== '') {
      setCloseMouse(false)
      setTimeout(() => {
        setCloseMouse(true)
      }, 3000)
    }
  }, [inputInfo.createdat]);

  return(
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={6} md={6}>
          {
            closeMouse === true ?
            <></> :
            <div className="arrow_box">{inputInfo.utterance}</div>
          }
        </Grid>
        <Grid item xs={6} md={6}>
          {
            closeMouse === true ? 
              <img src={mouse_close_cat} width={400} /> : 
              <img src={mouse_open_cat} width={400} />
          }
        </Grid>
      </Grid>
    </>
  )
}

export default Cataro;