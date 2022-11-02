import React from 'react'
import SuspiciousActivityList from './SuspiciousActivityList'

const SuspiciousActivities = ({logs, fetchLogData}) => {
  return (
    <div className="flex flex-row flex-wrap w-full bg-w1 rounded m-8 p-8 content-start overflow-y-auto">
      <span className="flex w-full font-type1 text-[20px] font-bold">
        Suspicious Activities
      </span>
      <p className="flex mt-2 mb-2 w-full">Show Security Related Vulnerabilities of the System</p>

      <button
          className="w-full btn btn-primary align-centre" type="REFRESH"
          onClick={() => fetchLogData()}
        >
          <span className="font-type1 font-bold text-[14px] leading-[22px] text-white">
          REFRESH
          </span>
        </button>
      <span className="h-[2px] bg-[black] w-full my-2" />

      
      <div className="w-full table-responsive">
        <table className="table w-full table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th className='border'>Time</th>          
              <th className='border'>Identifier</th>    
              <th className='border'>Reason</th>      
            </tr>
          </thead>
          <tbody className="table-group-divider">
            <SuspiciousActivityList logs={logs}/>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SuspiciousActivities