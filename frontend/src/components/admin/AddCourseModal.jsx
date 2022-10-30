import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineCloseSquare } from 'react-icons/ai';

export const AddCourseModal = ({closeModal, courseInfo}) => {
    
    const { loading, userInfo, error, success } = useSelector(state => state.user)
    const [updatedList,setUpdatedList] = React.useState({
      canBeDiscounted: false,
      company: "",
      courseDescription: "",
      courseDiscountedPrice: 0.00,
      courseImg: "",
      courseName: "",
      courseOriginalPrice: 0.00,
      courseTutor: "",
      courseType: "",
      quantity: 0,
      _id: ""
    });
    

    useEffect(() => {
      if (courseInfo._id){
        setUpdatedList(courseInfo)
      }
    }, [courseInfo, setUpdatedList])

    const editInput = (e) => {
        setUpdatedList((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value,
        }));
      };

    const swapSelection = () =>{
        updatedList.canBeDiscounted = !updatedList.canBeDiscounted
        setUpdatedList(updatedList);
         console.log(updatedList)
    }

    const addOrUpdateCourse = () => {
        // update course
        if(updatedList._id){

        }else{
        // insert course

        }
    }

  return (
    <div className="fixed w-screen h-screen bg-[rgba(100,100,100,0.2)] top-0 left-0 overflow-auto z-90 transition ease-in-out delay-300">
      <div className="flex justify-center items-center h-full w-full">
        <div className="flex-column w-3/4 py-4 bg-white rounded-lg shadow-lg m-[16px] space-y-4">
          <div className="flex w-full rounded-lg h-1/5 px-[16px]">
          <div className="text-black text-center w-full font-bold self-center text-[24px]">
              {updatedList._id ? 'Update Existing Course' : 'Add A New Course'}
          </div>

            <button
              className="text-[black] bg-transparent text-[24px]"
              onClick={() => closeModal(false)}
            >
              <AiOutlineCloseSquare />
            </button>
          </div>

          <div className='flex flex-wrap w-full px-4 justify-center'>
            <div className='flex-col w-1/2 space-y-2'>
                <div className='flex h-[40px] flex-wrap mr-8'>
                <label className='self-center font-type3 text-lg font-bold w-1/3'>Id</label> <input name="_id" type="text" className='border-2 border-b1 w-2/3 text-center' readOnly value={updatedList._id?updatedList._id: 'New Entry'} disabled/>
                </div>
                <div className='flex h-[40px] flex-wrap mr-8'>
                <label className='self-center font-type3 text-lg font-bold w-1/3'>Company Name</label> <input name="company" type="text" className='border-2 border-b1 w-2/3 text-center' onChange={editInput} value={updatedList.company}/>
                </div>
                <div className='flex h-[40px] flex-wrap mr-8'>
                <label className='self-center font-type3 text-lg font-bold w-1/3'>Course Name</label> <input type="text" name="courseName" className='border-2 border-b1 w-2/3 text-center' onChange={editInput} value={updatedList.courseName}/>
                </div>
                <div className='flex h-[40px] flex-wrap mr-8'>
                <label className='self-center font-type3 text-lg font-bold w-1/3'>Course Tutor</label> <input type="text" name="courseTutor" className='border-2 border-b1 w-2/3 text-center' onChange={editInput} value={updatedList.courseTutor}/>
                </div>
                <div className='flex h-[40px] flex-wrap mr-8'>
                <label className='self-center font-type3 text-lg font-bold w-1/3'>Course Type</label>
                <select name="courseType" className='border-2 border-b1 w-2/3 text-center' onChange={editInput} value={updatedList.courseType}>
                    <option value="IT">IT</option>
                    <option value="Business">Business</option>
                </select>
                </div>
                
                
            </div>
            <div className='flex-col w-1/2 space-y-2'>
            <div className='flex h-[80px] flex-wrap mr-8 mt-2'>
                <label className='self-center font-type3 text-lg font-bold w-1/3'>Upload Image</label><img className='bg-cover w-1/4 h-full' src={updatedList.courseImg ? `http://localhost:5000/v1/api/images/getImg/${updatedList.courseImg}`: require('../../assets/vectors/noimage.png')}/> 
                <button className='btn h-[40px] self-center m-auto'>Upload image</button>
                </div>
                <div className='flex h-[40px] flex-wrap mr-8'>
                <label className='self-center font-type3 text-lg font-bold w-1/3'>Original Price</label> <input type="text" name="courseOriginalPrice" className='border-2 border-b1 w-2/3 text-center' onChange={editInput} value={updatedList.courseOriginalPrice}/>
                </div>
                <div className='flex h-[40px] flex-wrap mr-8'>
                <label className='self-center font-type3 text-lg font-bold w-1/3'>Discounted Price</label> <input type="text" name="courseDiscountedPrice" className='border-2 border-b1 w-1/2 text-center' onChange={editInput} value={updatedList.courseDiscountedPrice}/>
                <input type="checkbox" className='border-2 border-b1 w-[50px] text-center' checked={updatedList.canBeDiscounted} onChange={()=>swapSelection()}/>
                </div>
                <div className='flex h-[40px] flex-wrap mr-8'>
                <label className='self-center font-type3 text-lg font-bold w-1/3'>Quantity</label> <input name="quantity" type="number" className='border-2 border-b1 w-2/3 text-center' onChange={editInput} value={updatedList.quantity}/>
                </div>
            </div>
            <div className='flex flex-wrap w-full mt-2 justify-between pr-8'>
                <label className='self-center font-type3 text-lg font-bold w-1/6'>Course Description</label> 
                <textarea name="courseDescription" className='border-2 border-b1 w-full h-[100px]' onChange={editInput} value={updatedList.courseDescription}></textarea>
                </div>
          </div>
          
          <div className="flex w-full justify-center text-[1vw]">
            {userInfo.role === 'admin' && <button className="bg-success text-w1 font-bold py-2 px-4 rounded-full" onClick={()=>addOrUpdateCourse()}>
                    Confirm {updatedList._id ? 'Update' : 'Add'}
                </button>}
                
            </div>
        </div>
      </div>
    </div>
  )
}
