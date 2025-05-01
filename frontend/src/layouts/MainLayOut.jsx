import React from 'react'
import Navbar from '../Navbar/Navbar.jsx'
import { Outlet } from 'react-router-dom'

export default function MainLayOut() {
  return (
    <>
      <Navbar/>
     <Outlet/>
    </>
  )
}
