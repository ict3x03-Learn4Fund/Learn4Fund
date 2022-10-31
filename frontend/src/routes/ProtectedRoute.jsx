import { useSelector } from 'react-redux'
import {useEffect} from 'react'
import { useNavigate, NavLink, Outlet } from 'react-router-dom'
import { toast } from 'react-toastify'


const ProtectedRoute = () => {
  const { userInfo } = useSelector((state) => state.user)
  const navigate = useNavigate()

  useEffect(() => {
    if(!userInfo){
    toast.warning('You are not authorised to access this page')
    setTimeout(() => {
      navigate('/login')
    },5000)
  }

  },[userInfo, navigate])

  
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