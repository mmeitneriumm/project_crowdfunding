import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { CountBox, CustomButton, Loader } from '../components';
import { calculateBarPercentage, daysLeft } from '../utils';
import { thirdweb } from '../assets';

const CampaignDetails = () => {
  const { state } = useLocation();
  console.log(state)
  const navigate = useNavigate();
  const { donate, getDonations, contract, address, deleteCampaign } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [donators, setDonators] = useState([]);

  const remainingDays = daysLeft(state.deadline);

  const fetchDonators = async () => {
    const data = await getDonations(state.pId);

    setDonators(data);
  }

  useEffect(() => {
    if(contract) fetchDonators();
  }, [contract, address])

  const handleDonate = async () => {
    setIsLoading(true);

    await donate(state.pId, amount); 

    navigate('/')
    setIsLoading(false);
  }

  const handleDelete = async() => {
    setIsLoading(true)
        await deleteCampaign(state.pId); 
        setIsLoading(false);
        navigate('/');
  }

  return (
    <div>
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col animate-[fade-in_1s_ease-in-out]">
          <img src={state.image} alt="campaign" className="w-full h-[410px] object-cover rounded-xl"/>
          <div className="relative w-full h-[5px] bg-[#f7f8fa] dark:bg-[#3a3a43] mt-2">
            <div className="absolute h-full bg-[#14f195]" style={{ width: `${calculateBarPercentage(state.target, state.amountCollected)}%`, maxWidth: '100%'}}>
            </div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox title="Осталось дней" value={remainingDays} />
          <CountBox title={`Собрано из ${state.target}`} value={state.amountCollected} />
          <CountBox title="Сторонников" value={donators.length} />
        </div>
      </div>

      <div className='mt-[40px]'><h1 className='font-epilogue font-semibold text-[24px] text-[#1c1c24] dark:text-white uppercase'>{state.title}</h1></div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5 animate-[fade-in_1s_ease-in-out]">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-[#1c1c24] dark:text-white uppercase">Создатель</h4>

            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#f7f8fa] dark:bg-[#2c2f32] cursor-pointer">
                <img src={thirdweb} alt="user" className="w-[100%] h-[100%] object-contain"/>
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-[#1c1c24] dark:text-white break-all">{state.owner}</h4>
                <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">10 кампаний</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-[#1c1c24] dark:text-white uppercase">История</h4>

              <div className="mt-[20px]">
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{state.description}</p>
              </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-[#1c1c24] dark:text-white uppercase">Донатеры</h4>

              <div className="mt-[20px] flex flex-col gap-4">
                {donators.length > 0 ? donators.map((item, index) => (
                  <div key={`${item.donator}-${index}`} className="flex justify-between items-center gap-4">
                    <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">{index + 1}. {item.donator}</p>
                    <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-ll">{item.donation}</p>
                  </div>
                )) : (
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">Донатеров пока нет. Будь первым!</p>
                )}
              </div>
          </div>
          {address == state.owner ? 
            <>
            <div className='flex flex-col gap-4'>
                <h4 className="font-epilogue font-semibold text-[18px] text-[#1c1c24] dark:text-white uppercase">Действия</h4>
                <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll cursor-pointer">Редактировать</p>
                <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll cursor-pointer" onClick={handleDelete}>Удалить</p>
              </div>
            </> : null
          }
        </div>

        <div className="flex-1 animate-[fade-in_1s_ease-in-out]">
          <h4 className="font-epilogue font-semibold text-[18px] text-[#1c1c24] dark:text-white uppercase">Поддержать</h4>   

          <div className="mt-[20px] flex flex-col p-4 bg-[#fff] shadow-[4px_2px_20px_4px_rgba(0,0,0,0.1)] dark:bg-[#1c1c24] rounded-[10px]">
            <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
              Финансировать кампанию
            </p>
            <div className="mt-[30px]">
              <input 
                type="number"
                placeholder="ETH 0.1"
                step="0.01"
                className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-[#1c1c24] dark:text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <div className="my-[20px] p-4 bg-[#f7f8fa] dark:bg-[#13131a] rounded-[10px]">
                <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-[#1c1c24] dark:text-white">Поддержите это, потому что вы верите в это.</h4>
                <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">Поддержите проект без вознаграждения, просто потому, что он вам подходит.</p>
              </div>

              <CustomButton 
                btnType="button"
                title="Поддержать"
                styles="w-full bg-[#ab66ff]"
                handleClick={handleDonate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetails