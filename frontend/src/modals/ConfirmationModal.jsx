import { useDispatch, useSelector } from 'react-redux';
import React from 'react'
import courseService from '../services/courses';
import { AiOutlineCloseSquare } from 'react-icons/ai';

export const ConfirmationModal = ({closeModal, courseInfo}) => {
    const { loading, userInfo, error, success } = useSelector(state => state.user)
    const deleteCourse = () => {
        courseService
          .deleteCourse(courseInfo._id)
          .then((response) => {
            console.log(response.data);
          })
          .catch((e) => {
            console.log(e);
          });
      }
  return (
    <div className="fixed w-screen h-screen bg-[rgba(100,100,100,0.2)] top-0 left-0 overflow-auto z-90 transition ease-in-out delay-300">
      <div className="flex justify-center items-center h-full w-full">
        <div className="flex-column w-1/2 py-4 bg-white rounded-lg shadow-lg m-[16px] space-y-4">
          <div className="flex w-full rounded-lg h-1/5 px-[16px]">
          <div className="text-black text-center w-full font-bold self-center text-[24px]">
              Delete Course
          </div>

            <button
              className="text-[black] bg-transparent text-[24px]"
              onClick={() => closeModal(false)}
            >
              <AiOutlineCloseSquare />
            </button>
          </div>

          <div className='flex w-full px-4 justify-center'>Are you sure you want to delete &nbsp;<b>{courseInfo.courseName}</b></div>
          
          <div className="flex w-full justify-center text-[1vw]">
            {userInfo.role === 'admin' && <button className="bg-red-500 text-w1 font-bold py-2 px-4 rounded-full" onClick={()=>deleteCourse()}>
                    Confirm Delete
                </button>}
                
            </div>
        </div>
      </div>
    </div>
  )
}
