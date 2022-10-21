import React from 'react'

const CoursesCatalog = () => {
  return (
    <div className="flex flex-row flex-wrap w-full bg-w1 rounded m-8 p-8 content-start">
      <span className="flex w-full font-type1 text-[20px] font-bold">
        Courses Catalog
      </span>
      <p className="flex mt-2 mb-2 w-full">Add, update, deactivate courses</p>
      <span className="h-[2px] bg-[black] w-full my-2" />

      <div class="w-full table-responsive">
        <table class="table w-full table-striped table-bordered table-hover table">
          <thead>
            <tr>
              <th className='w-1/6 border'>ID</th>
              <th className='w-1/6 border'>Name</th>
              <th className='w-1/6 border'>Img</th>
              <th className='w-1/6 border'>Quantity</th>
              <th className='w-1/6 border'>Actions</th>
            </tr>
          </thead>
          <tbody class="table-group-divider">
            <tr>
              <td>1</td>
              <td>Some Course</td>
              <td>Some Img</td>
              <td>50</td>
              <td>Edit/Delete</td>
            </tr>
            <tr>
              <td>1</td>
              <td>Some Course</td>
              <td>Some Img</td>
              <td>50</td>
              <td>Edit/Delete</td>
            </tr>
            <tr>
              <td>1</td>
              <td>Some Course</td>
              <td>Some Img</td>
              <td>50</td>
              <td>Edit/Delete</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CoursesCatalog