import React from 'react'
import UserManagementActivity from './UserManagementActivity'

export default function UserManagementActivityList({ accounts, fetchData }) {
    return (
        accounts.map(account => {
            return (
                <UserManagementActivity key={account.id} account={account} fetchData={fetchData} />
            )
        })
    )
}