import React from 'react'
import SuspiciousActivityList from './SuspiciousActivityList'

const SuspiciousActivities = ({logs, fetchLogData}) => {
  return (
    <div className="flex flex-row flex-wrap w-full bg-w1 rounded m-8 p-8 content-start">
      <span className="flex w-full font-type1 text-[20px] font-bold">
        Suspicious Activities
      </span>
      <p className="flex w-full">Show Security Related Vulnerabilities of the System</p>

      <button
          className="flex w-full h-[40px] rounded-sm bg-blue-500 justify-center items-center"
          onClick={() => fetchLogData()}
        >
          <span className="font-type1 font-bold text-[14px] leading-[22px] text-white">
          REFRESH
          </span>
        </button>
      <span className="h-[2px] bg-[black] w-full my-2" />

      
      <div className="flex-row flex-nowrap w-full space-y-2 p-2">
        <table class="flex-row w-full table-fixed text-center border-separate">
  <thead>
    <tr>
      <th className='border'>Time</th>          
      <th className='border'>Email</th>    
      <th className='border'>Reason</th>      
    </tr>
  </thead>
  <tbody>
    <SuspiciousActivityList logs={logs}/>
  </tbody>
</table>
      </div>
    </div>
  )
}

export default SuspiciousActivities