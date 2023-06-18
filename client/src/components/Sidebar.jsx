import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../assets';

import { useStateContext } from '../context';

import { logo, sun } from '../assets';
import { navlinks } from '../constants';
import useDarkMode from '../utils/useDarkMode';

const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick }) => (
  <div className={`w-[48px] h-[48px] rounded-[10px] ${isActive && isActive === name && 'bg-[#f0fcf8] dark:bg-[#2c2f32]'} flex justify-center items-center animate-[fade-in_1s_ease-in-out] dark:hover:bg-[#303030] hover:bg-[#f7f8fa]  ${!disabled && 'cursor-pointer'} ${styles}`} onClick={handleClick}>
    {!isActive ? (
      <img src={imgUrl} alt="fund_logo" className="w-1/2 h-1/2" />
    ) : (
      <img src={imgUrl} alt="fund_logo" className={`w-1/2 h-1/2 ${isActive !== name && 'grayscale'}`} />
    )}
  </div>
)

const Sidebar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState('dashboard');
  const { disconnect, address } = useStateContext();

  const [colorTheme, setTheme] = useDarkMode();
    const [darkMode, setDarkMode] = useState(
        colorTheme === "light" ? true : false
    );
 
    const toggleDarkMode = () => {
        setTheme(colorTheme);
        setDarkMode(!darkMode);
    };

  return (
    <div className="flex justify-between items-center flex-col sticky top-5 h-[93vh] z-10">
      <Link to="/">
        <Icon styles="w-[52px] h-[52px] bg-[#1с1с24] dark:bg-[#2c2f32] hover:fill-white-500" imgUrl={logo} />
      </Link>

      <div className="flex-1 flex flex-col justify-between items-center bg-[#fff] shadow-[4px_2px_20px_4px_rgba(0,0,0,0.1)] dark:bg-[#1c1c24] rounded-[20px] w-[76px] py-4 mt-12 animate-[fade-in_1s_ease-in-out]">
        <div className="flex flex-col justify-center items-center gap-3">
          {navlinks.map((link) => (
            <Icon 
              key={link.name}
              {...link}
              isActive={isActive}
              handleClick={() => {
                if(!link.disabled) {
                  setIsActive(link.name);
                  navigate(link.link);
                }
              }}
            />
          ))}
             <Icon 
              key={'logout'}
              imgUrl= {logout}
              isActive={isActive}
              handleClick={() => {
                if(address) {
                  disconnect()
                }
              }}
            />
        </div>

        <Icon styles="bg-[#fff] shadow-[4px_2px_20px_4px_rgba(0,0,0,0.1)] dark:bg-[#1c1c24]" imgUrl={sun} handleClick={toggleDarkMode}/>
      </div>
    </div>
  )
}

export default Sidebar