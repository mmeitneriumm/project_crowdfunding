import React from 'react'

const CountBox = ({ title, value }) => {
  return (
    <div className="flex flex-col items-center w-[150px] h-[109px] animate-[fade-in_1s_ease-in-out] shadow-[4px_2px_20px_4px_rgba(0,0,0,0.1)]">
      <h4 className="font-epilogue font-bold text-[30px] text-black dark:text-white p-3 bg-[#fff] dark:bg-[#1c1c24] rounded-t-[10px] w-full text-center truncate">{value}</h4>
      <p className="font-epilogue font-normal text-[16px] text-[#808191] bg-[#F7F8FA] dark:bg-[#28282e] px-3 py-2 w-full rouned-b-[10px] text-center">{title}</p>
    </div>
  )
}

export default CountBox