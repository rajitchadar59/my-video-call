import React from 'react'
import "./landing.css"
import { Link } from "react-router-dom"
import { useNavigate } from 'react-router-dom'
import FavoriteIcon from "@mui/icons-material/Favorite";
import { IconButton } from "@mui/material";
export default function Landing() {
  const routeTo = useNavigate();
  return (
    <div className="landingContainer">
      <nav>
        <div className='navHeader'>

          <h3>My Video Call <i class="fa-solid fa-video"></i>  </h3>

        </div>

        <div className='navList'>

          <p onClick={() => {
            routeTo(`abcjhi${Math.floor(100 + Math.random() * 900)}jdjkbcjkb${Math.floor(100 + Math.random() * 900)}kdcdcm`);
          }}>Join as Guest</p>

          <p onClick={() => {
            routeTo("/auth")
          }}>Register</p>

          <div role='button' className='nav-button' onClick={() => {
            routeTo("/auth")
          }}>
            <p >Login</p>
          </div>


        </div>

      </nav>

      <div className="landingMainContainer">
        <div className='left-text'>
          <h1> <span style={{ color: "#00b3ff" }}>Stay Closer</span> , No Matter the Distance

            <IconButton
              sx={{
                color: "#00b3ff",
                transition: "all 0.3s ease",
                "&:hover": {
                  color: "#00b3ff",
                  transform: "scale(1.2)",
                 
                  
                },
              }}
            >
              <FavoriteIcon style={{ fontSize:"3rem"}} />
            </IconButton>

          </h1>
          <p style={{ color: "#847e7eff", fontSize: "1.3rem" }}>Bring hearts closer with my video call</p>

          <div role='button' className='left-text-button'>
            <Link to={"/auth"} style={{ textDecoration: "none" }}><p>Get Started</p></Link>
          </div>

        </div>
        <div className='right-img'>

          <img src="/nn.png" />

        </div>
      </div>

    </div>
  )
}
