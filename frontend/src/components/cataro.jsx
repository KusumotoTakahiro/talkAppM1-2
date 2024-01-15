import React, { useEffect, useState } from "react";
import cat1 from '../images/cataro1.png';
import cat2 from '../images/cataro2.png';

const Cataro = ({ inputFlag }) => {
  const [closeMouse, setCloseMouse] = React.useState(true)
  React.useEffect(() => {
    setCloseMouse(!closeMouse)
  }, [inputFlag]);

  // const changeImage = (pngNumber) => {
  //   const cataroImg = document.getElementById("cataroImg");
  //   if (pngNumber%2 === 1) {
  //     cataroImg.src = cat2;
  //   } else {
  //     cataroImg.src = cat1;
  //   }
  // }

  // const drawCataro = () => {
  //   const interval = 1000;
  //   const finishTime = 10000;
  //   let pngNumber = 0;
  //   const intervalID = setInterval(() => {
  //     changeImage(pngNumber);
  //     pngNumber += 1;
  //   }, interval);
  //   setTimeout(clearInterval(intervalID), finishTime);
  // }

  return(
    <>
      {
        closeMouse === true ? 
          <img src={cat2} width={400} /> : 
          <img src={cat1} width={400} /> 
      }
    </>
  )
}

export default Cataro;