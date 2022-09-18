import {useState} from 'react'
import BannedUsers from '../components/admin/BannedUsers'
import CoursesCatalog from '../components/admin/CoursesCatalog'
import SuspiciousActivities from '../components/admin/SuspiciousActivities'

const Admin = () => {
  const [menu, setMenu] = useState(0)
  return (
    <main>
        <div className='flex flex-col flex-wrap w-full h-screen bg-b1'>
        <div className='flex w-1/4 h-full '>
        <div className='flex flex-row flex-wrap w-full h-fit bg-w1 rounded m-8 p-8'>
                <div className={menu===0 ? 'flex w-full h-fit font-type1 font-bold text-[20px] underline': 'font-type1 w-full h-fit text-[20px]'} onClick={()=>{setMenu(0)}}>Activity Logs</div>
                <div className={menu===1 ? 'flex w-full h-fit font-type1 font-bold text-[20px] underline': 'font-type1 w-full h-fit text-[20px]'} onClick={()=>{setMenu(1)}}>Courses Editor</div>
                <div className={menu===2 ? 'flex w-full h-fit font-type1 font-bold text-[20px] underline': 'font-type1 w-full h-fit text-[20px]'} onClick={()=>{setMenu(2)}}>User Management</div>
            </div>
            </div>
            <div className='flex w-3/4 h-full'>
              {menu === 0 && <SuspiciousActivities/>}
              {menu === 1 && <CoursesCatalog/>}
              {menu === 2 && <BannedUsers/>}
            </div>
        </div>
    </main>
  )
}

export default Admin