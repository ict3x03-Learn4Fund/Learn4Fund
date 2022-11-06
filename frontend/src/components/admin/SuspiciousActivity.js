import React from 'react'
import http from "../../http-common";
import { toast } from "react-toastify";

export default function SuspiciousActivity({ log }) {
    return (
        <tr>
            <td>{log.time}</td>
            <td>{log.email}</td>
            <td>{log.reason}</td>
        </tr>
    )
}

