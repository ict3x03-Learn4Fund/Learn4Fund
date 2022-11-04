import React from "react";
import http from "../../http-common";
import { toast } from "react-toastify";
import adminAuthService from "../../services/admin";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserManagementActivity({ account, fetchData }) {
  // [Logging & Management] Routes for admin management page only
  const navigate = useNavigate();
  const lockUnlockAccount = async (data) => {
    try {
      const response = await adminAuthService.lockUnlockAccount(data); // [Management] /services/admin.js
      axios.interceptors.response.use(
        (response) => {
          // [Error] To intercept error codes from Response
          return response.data.message; // [Error] Return error message
        },
        (error) => {
          navigate("/");
          return error.response.data.message;
        }
      );
      return response; // [Management] Lock/Unlock account successfully
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return message;
    }
  };

  const deleteAccount = async (data) => {
    try {
      const response = await adminAuthService.deleteAccount(data); // [Management] /services/admin.js
      axios.interceptors.response.use(
        (response) => {
          // [Error] To intercept error codes from Response
          return response.data.message; // [Error] Return error message
        },
        (error) => {
          navigate("/");
          return error.response.data.message;
        }
      );
      return response; // [Management] Account deleted successfully
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
      return message;
    }
  };

  // Lock/unlock the account depending on its current lockedOut value
  function HandleLockUnlockClick() {
    const data = { email: account.email, lockedOut: account.lockedOut };


    lockUnlockAccount(data); // [Logging] Lock or unlock account
    // http.post("/admin/lockUnlockAccount", data)
    refreshData();

    if (account.lockedOut) {
      toast.success("Account successfully unlocked");
    } else {
      toast.success("Account successfully locked");
    }
  }

  // Remove account
  function HandleRemoveClick() {
    const data = { email: account.email, lockedOut: account.lockedOut };
    deleteAccount(data); // [Management] Delete account
    // http.post("/admin/removeAccount", data)
    toast.success("Account successfully deleted");
    refreshData();
  }

  function refreshData() {
    fetchData();
    fetchData(); // NOT SURE WHY NEED TO FETCH TWICE TO TRIGGER THE STATE REFRESH PROPERLY
  }

  var value = "";
  if (account.lockedOut) {
    value = "UNLOCK";
  } else {
    value = "LOCK";
  }

  return (
    <tr>
      <td>{account._id + ""}</td>
      <td>{account.email}</td>
      <td>{account.firstName}</td>
      <td>{account.lockedOut + ""}</td>
      <td>
        <tr>
          <td>
            <button className="btn btn-primary" onClick={HandleLockUnlockClick}> {value} </button>
          </td>
          <td>
            <button className="btn btn-primary" onClick={HandleRemoveClick}> REMOVE </button>
          </td>
        </tr>
      </td>
    </tr>
  );
}
