import React from 'react';
import './CustomButton.css';

const CustomButton = ({ btnType = 'button', title, handleClick, styles = '' }) => (

  //   const CustomButton = ({ btnType, title, handleClick, styles }) => {
  //   return (
  //     <button
  //       type={btnType}
  //       className={`font-epilogue font-semibold text-[16px] leading-[26px] 
  //       text-white min-h-[52px] px-4 rounded-[10px] ${styles}`}
  //       onClick={handleClick}
  //     >
  //       {title}
  //     </button>
  //   )
  // }
  <button
    type={btnType}
    className={`custom-btn font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] ${styles}`}
    onClick={handleClick}
  >
    <span className="custom-btn__label">{title}</span>
    <span className="custom-btn__clip" aria-hidden="true">
      <span className="custom-btn__corner custom-btn__corner--left-top"></span>
      <span className="custom-btn__corner custom-btn__corner--right-bottom"></span>
      <span className="custom-btn__corner custom-btn__corner--right-top"></span>
      <span className="custom-btn__corner custom-btn__corner--left-bottom"></span>
    </span>
    <span className="custom-btn__arrow custom-btn__arrow--right" aria-hidden="true"></span>
    <span className="custom-btn__arrow custom-btn__arrow--left" aria-hidden="true"></span>
  </button>
);

export default CustomButton;