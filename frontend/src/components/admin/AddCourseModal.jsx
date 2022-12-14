import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux';
import { AiOutlineCloseSquare } from 'react-icons/ai';
import courseService from "../../services/courses";
import { toast } from 'react-toastify';
import coursesService from '../../services/courses';
import imagesService from "../../services/images";
import validator from 'validator';

export const AddCourseModal = ({ closeModal, courseInfo }) => {
  const [buttonState, setButtonState] = useState(false);
  const [file, setFile] = useState(null);
  const [checkBox, setCheckBox] = useState(false);
  const discountAmtRef = useRef(null);
  const originalAmtRef = useRef(null);
  const formData = new FormData();
  const { userInfo } = useSelector(state => state.user)
  const [updatedList, setUpdatedList] = React.useState({
    canBeDiscounted: false,
    company: "",
    courseDescription: "",
    courseDiscountedPrice: 0.00,
    courseImg: "",
    courseName: "",
    courseOriginalPrice: 0.00,
    courseTutor: "",
    courseType: "IT",
    quantity: 0,
    _id: ""
  });
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      // Anything in here is fired on component unmount.
      document.body.style.overflow = 'unset';
    }
  }, [])

  useEffect(() => {
    if (courseInfo._id) {
      setCheckBox(courseInfo.canBeDiscounted);
      setUpdatedList(courseInfo)
      originalAmtRef.current.value = courseInfo.courseOriginalPrice
      discountAmtRef.current.value = courseInfo.courseDiscountedPrice
    }
  }, [courseInfo, setUpdatedList])

  function validation() {
    let error = false;
    if (updatedList.courseDescription && updatedList.courseName && updatedList.courseTutor && updatedList.quantity && updatedList.courseOriginalPrice) {
      if (!validator.isLength(updatedList.courseDescription, { max: 500 })) { toast.error("Course description: 500 characters only"); error = true; }
      if (!validator.isLength(updatedList.courseName, { max: 100 })) { toast.error("Course name: 100 characters only"); error = true; }
      if (!validator.isLength(updatedList.courseTutor, { max: 50 })) { toast.error("Course Tutor: Within 50 characters"); error = true; }
      if (!validator.isInt(updatedList.quantity.toString()) || !validator.isLength(updatedList.quantity.toString(), { min: 1 })) { toast.error("Invalid Quantity"); error = true; }
      if (!validator.isFloat(updatedList.courseOriginalPrice.toString())) { toast.error("Invalid: Original Price"); error = true; }
      if (!error) {
        updatedList.courseName = validator.escape(updatedList.courseName)
        updatedList.courseDescription = validator.escape(updatedList.courseDescription)
        updatedList.courseTutor = validator.escape(updatedList.courseTutor)
        return true;

      }
      else { return false; }

    }
    else {
      toast.error("Please fill up all the fields");
      return false;
    }

  }
  function handleOriginalPrice(e) {
    if (e.key !== "Backspace") {
      if (originalAmtRef.current.value.includes(".")) {
        if (originalAmtRef.current.value.split(".")[1].length >= 2) {
          var num = parseFloat(originalAmtRef.current.value);
          var cleanNum = num.toFixed(2);
          originalAmtRef.current.value = cleanNum;
          e.preventDefault();
        }
      }
    }
  }

  function handleDiscountedPrice(e) {
    if (e.key !== "Backspace") {
      if (discountAmtRef.current.value.includes(".")) {
        if (discountAmtRef.current.value.split(".")[1].length >= 2) {
          var num = parseFloat(discountAmtRef.current.value);
          var cleanNum = num.toFixed(2);
          discountAmtRef.current.value = cleanNum;
          e.preventDefault();
        }
      }
    }
  }

  const editInput = (e) => {
    setUpdatedList((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
  }, [updatedList])

  const uploadImage = (e) => {
    e.preventDefault();

    if(file === null){
      toast.error('Please choose an image', {autoClose: false, limit: 1})
      return
    }
    
    if (file.type != "image/jpeg" && file.type != "image/png") {
      toast.error("Please choose only jpeg and png images")
      return
    }
    formData.append("image", file);

    imagesService
      .uploadImage(formData, localStorage.getItem('userId'))
      .then((response) => {
        if (response.status == 200) {
          updatedList.courseImg = response.data.id;
          const imgId = response.data.id;
          coursesService
            .uploadCourseImage(imgId, localStorage.getItem('userId'))
            .then(() => {
              toast.success("Successfully uploaded image of course");
            })
            .catch((error) => {
              toast.error(error.response.data.message);
            });
        }
      })
      .catch((error) => {
        if (error.response.data.message) {
          return toast.error(error.response.data.message)
        }
        toast.error(error.message);
      });
  };

  const swapSelection = () => {
    setCheckBox(!checkBox)
    updatedList.canBeDiscounted = checkBox;
    setUpdatedList(updatedList)
  }

  const addOrUpdateCourse = () => {
    if(buttonState) return;
    setButtonState(true);
    // check if price amounts are more than a certain value
    if (originalAmtRef.current.value <= 0) {
      toast.error("Price amounts must be more than 0", { autoClose: false, limit: 1 })
      setButtonState(false);
      return;
    }
    // check if price amounts are more than a certain value
    if (originalAmtRef.current.value > 50000 || discountAmtRef.current.value > 50000) {
      toast.error("Price amounts cannot be more than $50,000", { autoClose: false, limit: 1 })
      setButtonState(false);
      return;
    }

    if (updatedList.courseTutor > 70){
      toast.error("Tutor name cannot be more than 70 characters", { autoClose: false, limit: 1 })
    }

    if (updatedList.quantity > 1000 || updatedList.quantity < 1){
      toast.error("Quantity must be between 1 and 1000", { autoClose: false, limit: 1 })
      setButtonState(false);
      return;
    }

    // set original amount to the ref value
    updatedList.courseOriginalPrice = originalAmtRef.current.value;
    updatedList.courseDiscountedPrice = discountAmtRef.current.value;

    if (parseFloat(updatedList.courseOriginalPrice) < parseFloat(updatedList.courseDiscountedPrice)) {
      toast.error("Discounted price cannot be more than original price", { autoClose: false, limit: 1 })
      setButtonState(false);
      return;
    }
    if (!validation()) {
      setButtonState(false);
      return
    }
    // update course
    if (updatedList._id) {
      updateCourses(updatedList._id, updatedList)
    } else {
      // insert course
      createCourses(updatedList)
    }
    setButtonState(false);
    closeModal(false);
  }

  // create courses
  const createCourses = (data) => {
    courseService
      .createCourse(data, localStorage.getItem('userId'))
      .then((response) => {
        toast.success('Course Created');
      })
      .catch((e) => {
        if (e.response.data.message) {
          return toast.error(e.response.data.message)
        }
        toast.error('Error creating course');
      });

  };

  // update courses
  const updateCourses = (id, data) => {

    courseService
      .updateCourse(id, data, localStorage.getItem('userId'))
      .then((response) => {
        toast.success('Course Updated');
      })
      .catch((e) => {
        if (e.response.data.message) {
          return toast.error(e.response.data.message)
        }
        toast.error('Error updating course');
      });

  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="fixed w-screen h-screen bg-[rgba(100,100,100,0.2)] top-0 left-0 overflow-auto transition ease-in-out delay-300" style={{ zIndex: 999 }}>
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
              <div className='flex h-[6vh] flex-wrap mr-8'>
                <label className='self-center font-type3 text-lg font-bold w-1/3'>Id</label> <input name="_id" type="text" className='border-2 border-b1 w-2/3 text-center' readOnly value={updatedList._id ? updatedList._id : 'New Entry'} disabled />
              </div>
              <div className='flex h-[6vh] flex-wrap mr-8'>
                <label className='self-center font-type3 text-lg font-bold w-1/3'>Company Name</label> <input required name="company" type="text" className='border-2 border-b1 w-2/3 text-center' onChange={editInput} value={updatedList.company} />
              </div>
              <div className='flex h-[6vh] flex-wrap mr-8'>
                <label className='self-center font-type3 text-lg font-bold w-1/3'>Course Name</label> <input required type="text" name="courseName" className='border-2 border-b1 w-2/3 text-center' onChange={editInput} value={updatedList.courseName} />
              </div>
              <div className='flex h-[6vh] flex-wrap mr-8'>
                <label className='self-center font-type3 text-lg font-bold w-1/3'>Course Tutor</label> <input required type="text" name="courseTutor" className='border-2 border-b1 w-2/3 text-center' onChange={editInput} value={updatedList.courseTutor} />
              </div>
              <div className='flex h-[6vh] flex-wrap mr-8'>
                <label className='self-center font-type3 text-lg font-bold w-1/3'>Course Type</label>
                <select name="courseType" className='border-2 border-b1 w-2/3 text-center' defaultValue={'IT'} onChange={editInput} value={updatedList.courseType}>
                  <option value="IT">IT</option>
                  <option value="Business">Business</option>
                  <option value="Health">Health</option>
                  <option value="Lifestyle">Lifestyle</option>
                </select>
              </div>


            </div>
            <div className='flex-col w-1/2 space-y-2'>
              <div className='flex h-[12vh] flex-wrap mr-8 mt-2'>
                <label className='self-center font-type3 text-lg font-bold w-1/3'>Upload Image</label><img className='bg-cover w-1/4 h-full' src={updatedList.courseImg ? `https://learn4fund.tk/v1/api/images/getImg/${updatedList.courseImg}` : require('../../assets/vectors/noimage.png')} />
                <div className='flex-col w-2/5'>
                  <input
                    type="file"
                    name="file"
                    accept=".jpeg, .png"
                    onChange={(e) => handleFile(e)}
                  ></input>
                  <button className='btn h-[6vh] w-full mt-2' onClick={(e) => uploadImage(e)}>Upload image</button>
                </div>
              </div>
              <div className='flex h-[6vh] flex-wrap mr-8'>
                <label className='self-center font-type3 text-lg font-bold w-1/3'>Original Price</label> <input required type="number" name="courseOriginalPrice" className='border-2 border-b1 w-2/3 text-center'
                  step=".01"
                  ref={originalAmtRef}
                  defaultValue={originalAmtRef.current}
                  onKeyDown={(e) => {
                    handleOriginalPrice(e);
                  }} />
              </div>
              <div className='flex h-[6vh] flex-wrap mr-8'>
                <label className='self-center font-type3 text-lg font-bold w-1/3'>Discounted Price</label> <input type="number" name="courseDiscountedPrice" className='border-2 border-b1 w-1/2 text-center'
                  step=".01"
                  ref={discountAmtRef}
                  defaultValue={discountAmtRef.current}
                  onKeyDown={(e) => {
                    handleDiscountedPrice(e);
                  }} />
                <input type="checkbox" className='border-2 border-b1 w-[20px] h-[20px] text-center m-auto' checked={checkBox} onChange={() => swapSelection()} />
              </div>
              <div className='flex h-[6vh] flex-wrap mr-8'>
                <label className='self-center font-type3 text-lg font-bold w-1/3'>Quantity</label> <input required name="quantity" type="number" className='border-2 border-b1 w-2/3 text-center' onChange={editInput} value={updatedList.quantity} />
              </div>
            </div>
            <div className='flex flex-wrap w-full mt-2 justify-between pr-8'>
              <label className='self-center font-type3 text-lg font-bold w-1/6'>Course Description</label>
              <textarea name="courseDescription" className='border-2 border-b1 w-full h-[100px]' onChange={editInput} value={updatedList.courseDescription} required></textarea>
            </div>
          </div>

          <div className="flex w-full justify-center text-[1vw]">
            {userInfo.role === 'admin' && <button className="bg-success text-w1 font-bold py-2 px-4 rounded-full" onClick={() => addOrUpdateCourse()} disabled={buttonState}>
              Confirm {updatedList._id ? 'Update Course' : 'Add Course'}
            </button>}

          </div>
        </div>
      </div>
    </div>
  )
}
