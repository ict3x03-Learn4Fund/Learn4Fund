import React from 'react'
import SuspiciousActivity from './SuspiciousActivity'

export default function SuspiciousActivityList({ logs }) {
    return (
        logs.map(log => {
            return (
                <SuspiciousActivity key={log._id} log={log} />
            )
        })
    )
}