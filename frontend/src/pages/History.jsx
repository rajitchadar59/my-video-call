import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton'
import HomeIcon from '@mui/icons-material/Home';
import Snackbar from '@mui/material/Snackbar';
import "./History.css"

function History() {
  const { getUserHistory } = useContext(AuthContext);
  const [meetings, setmeetings] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const routeTo = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {

        const history = await getUserHistory();
        setmeetings(history);

      }
      catch {
        setSnackbarMsg("Failed to fetch history");
        setSnackbarOpen(true);
      }
    }

    fetchHistory();
  }, [])

  let formatDate=(dateString)=>{
    const date=new Date(dateString);
    const day=date.getDate().toString().padStart(2,"0");
    const month=(date.getMonth()+1).toString().padStart(2,"0");
    const year=date.getFullYear();
    return `${day}/${month}/${year}`
  }


  return (
    <div className='history-container'>

      <IconButton className="homeButton" onClick={()=>{
        routeTo("/home")
      }}>
       <HomeIcon/>
      </IconButton>

      {meetings.length > 0 ? meetings.map((el, i) => {
        return (

          <>

            <Card className="historyCard" variant="outlined" key={i}>


              <CardContent>
                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                  Code:{el.meetingCode}
                </Typography>

                <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                  Date:{formatDate(el.date)}
                </Typography>
             
              </CardContent>
              

            </Card>

          </>

        )
      }) : <p  className="noHistory">No History Available</p>}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMsg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

    </div>
  )
}

export default History
