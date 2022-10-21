import React from 'react'
import http from "../../http-common";
import toast from 'react-hot-toast';
import { useAuth } from "../../hooks/useAuth";

export default function UserManagementActivity({account, fetchData}){
    const {lockUnlockAccount, deleteAccount } = useAuth();                  // [Logging & Management] Routes for admin management page only
    // Lock/unlock the account depending on its current lockedOut value
    function HandleLockUnlockClick() {   
        
        const data = { 'email': account.email, 'lockedOut': account.lockedOut }
        lockUnlockAccount(data);                                            // [Logging] Lock or unlock account
        // http.post("/admin/lockUnlockAccount", data)
        refreshData()

        if (account.lockedOut){
            toast.success('Account successfully unlocked');
        }else{
            toast.success('Account successfully locked');
        }
    }

    // Remove account
    function HandleRemoveClick() {
        const data = { 'email': account.email, 'lockedOut': account.lockedOut }
        deleteAccount(data);                                                // [Management] Delete account
        // http.post("/admin/removeAccount", data)
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
                <td><button onClick = {HandleLockUnlockClick}> {value} </button></td>                
                <td><button onClick = {HandleRemoveClick}> REMOVE </button></td>
            </td>            
        </tr>
    )
}

