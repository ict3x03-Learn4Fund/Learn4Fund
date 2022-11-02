import BannedUsers from "../components/admin/BannedUsers";
import CoursesCatalog from "../components/admin/CoursesCatalog";
import SuspiciousActivities from "../components/admin/SuspiciousActivities";
import { React, useState, useEffect } from "react";
import http from "../http-common";
import { useNavigate } from "react-router-dom";
import adminAuthService from "../services/admin";
import axios from "axios";
import {toast} from "react-toastify";
import { useNav } from "../hooks/useNav";

function testPostLog() {
  const data = { email: "addme@gmail.com", reason: "Account lockout" };
  http.post("/accounts/addLog", data);
}

const Admin = () => {
  const [menu, setMenu] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();
  const {setTab} = useNav();

  const fetchLogData = async () => {
    try {
      const response = await adminAuthService.getAllLogs();
      axios.interceptors.response.use(
        (response) => {
          return response.data.message;
        },
        (error) => {
          navigate("/");
        }
      );
      setLogs(response.data);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
    }
  };


  const fetchData = async () => {
    try {
      const response = await adminAuthService.getAllAccounts(); // [Logging] /services/admin.js
      axios.interceptors.response.use((response) => {                   // [Error] To intercept error codes from Response
          return response.data.message; // [Error] Return error message
        },
        (error) => {
          if (error.response.status === 401) {
            navigate("/");
          }
          return error.response.data.message;
        }
      );
      if (response.status === 200) {
        setAccounts(response.data);          // [Logging] Got all accounts successfully
      } else {
        navigate("/");
      }
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
    }
  };

  // Fetch all accounts on initial load
  useEffect(() => {
    window.scrollTo(0, 0);
    setTab("admin");
    fetchData();
    fetchLogData();
  }, []);

  return (
    <main>
      <div className="flex flex-col flex-wrap w-full h-screen bg-b1">
        <div className="flex w-1/4 h-full ">
          <div className="flex flex-row flex-wrap w-full h-fit bg-w1 rounded m-8 p-8">
            <div
              className={
                menu === 0
                  ? "flex w-full h-fit font-type1 font-bold text-[20px] underline"
                  : "font-type1 w-full h-fit text-[20px]"
              }
              onClick={() => {
                setMenu(0);
              }}
            >
              Activity Logs
            </div>
            <div
              className={
                menu === 1
                  ? "flex w-full h-fit font-type1 font-bold text-[20px] underline"
                  : "font-type1 w-full h-fit text-[20px]"
              }
              onClick={() => {
                setMenu(1);
              }}
            >
              Courses Editor
            </div>
            <div
              className={
                menu === 2
                  ? "flex w-full h-fit font-type1 font-bold text-[20px] underline"
                  : "font-type1 w-full h-fit text-[20px]"
              }
              onClick={() => {
                setMenu(2);
              }}
            >
              User Management
            </div>
          </div>
        </div>
        <div className="flex w-3/4 h-full">
          {menu === 0 && (
            <SuspiciousActivities logs={logs} fetchLogData={fetchLogData} />
          )}
          {menu === 1 && <CoursesCatalog />}
          {menu === 2 && (
            <BannedUsers accounts={accounts} fetchData={fetchData} />
          )}
        </div>
      </div>
    </main>
  );
};

export default Admin;
