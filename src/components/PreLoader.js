import React from 'react';
import style from './PreLoader.css';

function Preloader() {
  return (
    <div className={style.container}>
      <div className={style.loader}></div>
    </div>
  );
}

export default Preloader;