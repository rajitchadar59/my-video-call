import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';
import WithAuth from '../utils/withAuth';
import "./Home.css"
import IconButton from '@mui/material/IconButton'
import RestoreIcon from '@mui/icons-material/Restore'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { AuthContext } from "../context/AuthContext";
import {Link}  from "react-router-dom"

function Home() {

    let router = useNavigate();
      const {addUserHistory}=useContext(AuthContext);
    
    const [meetingCode, setmeetingCode] = useState("");

    let handleJoinVideoCall = async () => {
 
        await(addUserHistory(meetingCode))
        router(`/${meetingCode}`);

    }

    return (
        <>

            <div className="navBar">

                <div style={{ display: "flex", alignItems: "center" }}>
                    <h3>My Video Call <i class="fa-solid fa-video"></i>  </h3>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                    
                    <Link to={"/history"}>
                    
                    <IconButton>
                        <RestoreIcon /> 
                        <p style={{textDecoration:"none" ,fontSize:"1rem" ,margin:"0.3rem"}}>History</p>
                    </IconButton>

                    </Link>
                  

                    <Button onClick={() => {
                        localStorage.removeItem("token")
                        router("/auth")
                    }}>
                        Logout
                    </Button>

                </div>

            </div>


            <div className="meetContainer">
                <div className="leftPanel">
                    <div>
                        <h2 style={{marginBottom:"1rem"}}>Providing  Quality Video Call Just Like Quality Education</h2>

                        <div style={{ display: "flex", gap: "10px" }}>

                            <TextField

                                id="outline"
                                value={meetingCode}
                                onChange={(e) => setmeetingCode(e.target.value)}

                            />

                            <Button onClick={handleJoinVideoCall} variant='contained'>Join</Button>

                        </div>
                    </div>
                </div>

                <div className='rightPanel'>

                    <img srcSet='/logo3.png' alt="" />

                </div>

            </div>



        </>
    )
}



export default WithAuth(Home)
