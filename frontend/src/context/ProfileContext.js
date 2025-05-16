import axios from "axios";
import { createContext, useState } from "react";
import Cookies from 'js-cookie';

export  let ProfileContext=createContext(0)


// function get Categories

async function getProfileData(){
    return axios.get('http://localhost:8000/api/v1/user/profile',{
          headers:{
            authorization:`Bearer ${Cookies.get('token')}`,
          }
      }).then(({data})=>data).catch(err => err)
  }

 export default  function ProfileContextProvider({children}){
    let [userData, setUserData] = useState({});
    return <ProfileContext.Provider
     value={{
        userData,
        setUserData,
        getProfileData,
        }}>
        {children}

    </ProfileContext.Provider>
}