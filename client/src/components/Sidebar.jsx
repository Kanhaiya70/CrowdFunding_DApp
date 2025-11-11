import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { logo, sun } from "../assets";
import { navlinks } from "../constants";
import { useTheme } from "../context/ThemeContext"; // 👈 import the theme hook


const Icon = ({
  styles,
  name,
  imgUrl,
  isActive,
  disabled,
  handleClick,
}) => (
  <div
  className={`w-[48px] h-[48px] rounded-[10px] ${
    isActive && isActive === name && "bg-gray-white dark:bg-[#2c2f32]"
  } flex justify-center items-center ${
    !disabled && "cursor-pointer"
  } ${styles} transition-colors duration-300`}
  onClick={handleClick}
>
    {!isActive ? (
      <img src={imgUrl} alt="fund_logo" className="w-1/2 h-1/2" />
    ) : (
      <img
        src={imgUrl}
        alt="fund_logo"
        className={`w-1/2 h-1/2 ${isActive !== name && "grayscale"}`}
      />
    )}
  </div>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("dashboard");
  const { toggleTheme } = useTheme(); // 👈 access theme + toggle function

  return (
    <div className="flex justify-between items-center flex-col sticky top-5 h-[93vh]">
      <Link to="/">
        <Icon styles="w-[52px] h-[52px] bg-[#2c2f32]" imgUrl={logo} />
      </Link>

      <div className="flex-1 flex flex-col justify-between items-center bg-gray-200 dark:bg-[#020220] rounded-[20px] w-[76px] py-4 mt-12 transition-colors duration-300">
        <div className="flex flex-col justify-center items-center gap-3">
          {navlinks.map((link) => (
            <Icon
              key={link.name}
              {...link}
              isActive={isActive}
              handleClick={() => {
                if (!link.disabled) {
                  setIsActive(link.name);
                  navigate(link.link);
                }
              }}
            />
          ))}
        </div>

        {/* Theme toggle button */}
        <Icon
          styles="bg-gray-white dark:bg-[#1c1c24] shadow-secondary transition-colors duration-300"
          imgUrl={sun}
          handleClick={toggleTheme} // now toggles theme
        />
      </div>
    </div>
  );
};

export default Sidebar;
