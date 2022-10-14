import React from 'react'
import Activity from './Activity'

export default function ActivityList({accounts, fetchData}){    
    return (
        accounts.map(account =>{
            return (                
                <Activity key={account.id} account={account} fetchData={fetchData}/>
            )
        })
    )
}