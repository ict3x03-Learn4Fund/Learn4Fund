import React, { useState } from 'react'
import { useEffect } from 'react'
import ChangePassword from '../components/profile/ChangePassword'
import Profile from '../components/profile/Profile'
import TransactionHistory from '../components/profile/TransactionHistory'
import { useNav } from "../hooks/useNav";

/*** Just to see the settings tab */
function Settings() {
  const [menu, setMenu] = useState(0)
  const { setTab } = useNav();

  useEffect(() => {
    window.scrollTo(0, 0);
    setTab('settings');
  }, [])
  return (
    <main>
      <div className='flex flex-col flex-wrap w-full h-screen bg-b1'>
        <div className='flex w-1/4 h-full '>
          <div className='flex flex-row flex-wrap w-full h-fit bg-w1 rounded m-8 p-8'>
            <div className={menu === 0 ? 'flex w-full h-fit font-type1 font-bold text-[20px] underline' : 'font-type1 w-full h-fit text-[20px]'} onClick={() => { setMenu(0) }}>Profile</div>
            <div className={menu === 1 ? 'flex w-full h-fit font-type1 font-bold text-[20px] underline' : 'font-type1 w-full h-fit text-[20px]'} onClick={() => { setMenu(1) }}>Change Password</div>
            <div className={menu === 2 ? 'flex w-full h-fit font-type1 font-bold text-[20px] underline' : 'font-type1 w-full h-fit text-[20px]'} onClick={() => { setMenu(2) }}>Transaction History</div>
          </div>
        </div>
        <div className='flex w-3/4 h-full'>
          {menu === 0 && <Profile />}
          {menu === 1 && <ChangePassword />}
          {menu === 2 && <TransactionHistory />}
        </div>
      </div>
    </main>
  )
}

export default Settings