import React from 'react'

const CoursesCatalog = () => {
  return (
    <div className="flex flex-row flex-wrap w-full bg-w1 rounded m-8 p-8 content-start">
      <span className="flex w-full font-type1 text-[20px] font-bold">
        Courses Catalog
      </span>
      <p className="flex w-full">Add, update, deactivate courses</p>
      <span className="h-[2px] bg-[black] w-full my-2" />

      
      <div className="flex-row flex-nowrap w-full space-y-2 p-2">
        <div className="flex w-full justify-between">
        <div className="self-center">
          <b>Delete my account</b> </div>
          <button className="btn bg-red-500">Confirm Delete</button>
          </div>
      </div>
    </div>
  )
}

export default CoursesCatalog