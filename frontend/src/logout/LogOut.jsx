import React from 'react'
import { Navigate } from 'react-router-dom'
import Cookies from 'js-cookie';
export default function LogOut() {
  Cookies.remove('token');
  return (
    <>
      {/* new */}
      <Navigate to={'/signin'}/>
    </>
  )
}
