import React from 'react'
import http from "../../http-common";
import toast from 'react-hot-toast';

export default function UserManagementActivity({account, fetchData}){

    // Lock/unlock the account depending on its current lockedOut value
    function handleLockUnlockClick() {                
        const data = {'email': account.email, 'lockedOut': account.lockedOut}
        http.post("/accounts/lockUnlockAccount", data)
        refreshData()

        if (account.lockedOut){
            toast.success('Account successfully unlocked');
        }else{
            toast.success('Account successfully locked');
        }
    }

    // Remove account
    function handleRemoveClick() {
        const data = {'email': account.email, 'lockedOut': account.lockedOut}
        http.post("/accounts/removeAccount", data)
        toast.success("Account successfully deleted")
        refreshData()
    }

    function refreshData() {
        fetchData()
        fetchData() // NOT SURE WHY NEED TO FETCH TWICE TO TRIGGER THE STATE REFRESH PROPERLY
    }
    
    var value = ""
    if (account.lockedOut){
        value = "UNLOCK"
    }else{
        value = "LOCK"
    }

    return (
        <tr>
            <td>{account._id + ''}</td>
            <td>{account.email}</td>
            <td>{account.firstName}</td>
            <td>{account.lockedOut+ ''}</td>            
            <td>                
                <td><button onClick = {handleLockUnlockClick}> {value} </button></td>                
                <td><button onClick = {handleRemoveClick}> REMOVE </button></td>
            </td>            
        </tr>
    )
}

