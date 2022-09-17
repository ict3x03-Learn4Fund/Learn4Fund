import React from 'react'

const BannedUsers = () => {
  return (
    <div className="flex flex-row flex-wrap w-full bg-w1 rounded m-8 p-8 content-start">
      <span className="flex w-full font-type1 text-[20px] font-bold">
        User Management
      </span>
      <p className="flex w-full">Block or unblock users account</p>
      <span className="h-[2px] bg-[black] w-full my-2" />

      
      <div className="flex-row flex-nowrap w-full space-y-2 p-2">
        <table class="flex-row w-full table-fixed text-center border border-separate">
  <thead>
    <tr>
      <th className='w-1/6 border'>ID</th>
      <th className='w-1/6 border'>Email</th>
      <th className='w-1/6 border'>Name</th>
      <th className='w-1/6 border'>Locked Out</th>
      <th className='w-1/6 border'>Session</th>
      <th className='w-1/6 border'>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>test@gmail.com</td>
      <td>test ing</td>
      <td>F</td>
      <td>UID</td>
      <td>Block/Unblock</td>
    </tr>
    <tr>
    <td>1</td>
      <td>test@gmail.com</td>
      <td>test ing</td>
      <td>F</td>
      <td>UID</td>
      <td>Block/Unblock</td>
    </tr>
    <tr>
    <td>1</td>
      <td>test@gmail.com</td>
      <td>test ing</td>
      <td>F</td>
      <td>UID</td>
      <td>Block/Unblock</td>
    </tr>
  </tbody>
</table>
      </div>
    </div>
  )
}

export default BannedUsers