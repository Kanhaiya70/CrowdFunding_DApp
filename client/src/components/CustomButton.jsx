import React from 'react';
import './CustomButton.css';

const CustomButton = ({ btnType, title, handleClick, styles }) => {
  return (
    <button
      type={btnType}
      className={`font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] 
      transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-95 flex items-center justify-center
      ${styles}`}
      onClick={handleClick}
    >
      {title}
    </button>
  )
}

export default CustomButton;