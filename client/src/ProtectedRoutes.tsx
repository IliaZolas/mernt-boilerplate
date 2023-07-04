import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const ProtectedRoutes = () => {
  const auth = cookies.get("TOKEN");
  console.log("auth:", auth)

return (
    auth ? <Outlet/> : <Navigate to='/login'/>
  )
}

export default ProtectedRoutes