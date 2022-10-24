import { useSelector } from 'react-redux'
import { NavLink, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
  const { userInfo } = useSelector((state) => state.user)

  // show unauthorized screen if no user is found in redux store
  if (!userInfo) {
    return (
      <main className="p-8 bg-rose-200 h-screen">
      <div className="bg-rose-400 p-8">
        <p className="font-bold text-white">
          Unauthorized
        </p>
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