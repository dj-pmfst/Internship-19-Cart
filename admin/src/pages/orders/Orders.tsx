import { useState, useEffect, useRef } from 'react'
import Navbar from '../../component/navbar'

const API = 'http://localhost:3000'
const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
  'Content-Type': 'application/json',
})

export default function Orders() {
  
  return (
    <div className="page">
      <Navbar />

    </div>
  )
}