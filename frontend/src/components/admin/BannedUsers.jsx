import React from 'react'
import ActivityList from './UserManagementActivityList'


const BannedUsers = ({accounts, fetchData}) => {
  return (
    <div className="flex flex-row flex-wrap w-full bg-w1 rounded m-8 p-8 content-start">
      <span className="flex w-full font-type1 text-[20px] font-bold">
        User Management
      </span>
      <p className="flex mt-2 mb-2 w-full">Lock/unlock or remove user accounts.</p>
      <span className="h-[2px] bg-[black] w-full my-2" />

      
      <div className="w-full table-responsive">
        <table className="table w-full table-striped table-bordered table-hover overflow: auto">
          <thead>
            <tr className="align-middle">
              <th>ID</th>
              <th>Email</th>
              <th>Name</th>
              <th>Locked</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            <ActivityList accounts={accounts} fetchData={fetchData}/>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BannedUsers