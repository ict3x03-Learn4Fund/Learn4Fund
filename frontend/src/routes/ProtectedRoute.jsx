import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {toast} from "react-toastify";

const ProtectedRoute = () => {
  const { userInfo } = useSelector((state) => state.user)
  const navigate = useNavigate();
  useEffect(()=>{
    if (!localStorage.getItem('userId')) {
      toast.warning('You are not authorised to access this page')
    setTimeout(() => {
      navigate('/login')
    },5000)
      
    }
  },[navigate])

  // show unauthorized screen if no user is found in redux store
  if (!userInfo) {
    return (
      <main className="p-8 h-screen">
      <div className="bg-gray-400 p-8">
        <p className="font-bold text-2xl text-white">
          Unauthorized &nbsp;
        </p>
        <p>Redirecting to login screen in 5</p>
        <span className='mr-2'>
          <NavLink to='/login' className="font-bold text-blue-600">Login</NavLink> to gain access. 
        </span>
          If you suspect this is a bug, please contact us at{" "}
          <a
            href="mailto:learn4fund@gmail.com"
            className="font-bold"
          >
            learn4fund@gmail.com
          </a>
      </div>
    </main>
    )
  }

  // returns child route elements
  return <Outlet />
}
export default ProtectedRoute