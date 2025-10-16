import React, { useRef, useState, useEffect } from 'react'
import "./VideoMeet.css"
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import io from "socket.io-client";
import IconButton from '@mui/material/IconButton';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEnd from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import Badge from '@mui/material/Badge';
import ChatIcon from '@mui/icons-material/Chat';
import {useNavigate} from 'react-router-dom'
import server from "../../environment"
import HomeIcon from '@mui/icons-material/Home';


const server_url =server;

const connections = {}

const peerConfigConnections = {
  "iceServers": [
    {
      "urls": "stun:stun.l.google.com:19302"
    }
  ]
}



export default function VideoMeet() {

  let socketRef = useRef();
  let socketIdRef = useRef();

  let localVideoRef = useRef();

  let [videoAvailable, setvideoAvailable] = useState(true);

  let [audioAvailable, setaudioAvailable] = useState(true);

  let [video, setvideo] = useState();

  let [audio, setaudio] = useState();

  let [screen, setscreen] = useState();

  let [showModel, setshowModel] = useState(true);

  let [screenAvailable, setscreenAvailable] = useState();

  let [messages, setmessages] = useState([]);

  let [message, setmessage] = useState("");

  let [newMessages, setnewMessages] = useState(0);

  let [askForUsername, setaskForUsername] = useState(true);

  let [username, setusername] = useState("");

  let videoRef = useRef([]);


  const [videos, setvideos] = useState([]);
   

  let routeTo = useNavigate();

  const getPermissions = async () => {

    try {

      const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });

      if (videoPermission) {

        setvideoAvailable(true);
      } else {
        setvideoAvailable(false);
      }



      const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });

      if (audioPermission) {

        setaudioAvailable(true);
      } else {
        setaudioAvailable(false);
      }


      if (navigator.mediaDevices.getDisplayMedia) {
        setscreenAvailable(true);
      }
      else {
        setscreenAvailable(false);
      }


      if (videoAvailable || audioAvailable) {

        const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });

        if (userMediaStream) {
          window.localStream = userMediaStream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = userMediaStream;
          }
        }

      }



    } catch (err) {

      console.log(err);

    }

  }


  useEffect(() => {

    getPermissions();

  }, [])

  let getUserMediaSuccess = (stream) => {
    try {

      window.localStream.getTracks().forEach(track => track.stop())

    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for (let id in connections) {
      if (id == socketIdRef.current) continue;

      connections[id].addStream(window.localStream)

      connections[id].createOffer().then((description) => {
        connections[id].setLocalDescription(description)
          .then(() => {
            socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }))
          })
          .catch(e => console.log(e));
      })

    }

    stream.getTracks().forEach(track => track.onended = () => {
      setaudio(false);
      setvideo(false);

      try {
        let tracks = localVideoRef.current.srcObject.getTracks()
        tracks.forEach(track => track.stop())

      } catch (e) {
        console.log(e);
      }

      let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
      window.localStream = blackSilence();
      localVideoRef.current.srcObject = window.localStream;




      for (let id in connections) {
        connections[id].addStream(window.localStream)
        connections[id].createOffer().then((description) => {

          connections[id].setLocalDescription(description)
            .then(() => {
              socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }))
            }).catch(e => console.log(e));
        })



      }
    })

  }


  let silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
  }


  let black = ({ width = 640, height = 480 } = {}) => {

    let canvas = Object.assign(document.createElement("canvas"), { width, height });
    canvas.getContext('2d').fillRect(0, 0, width, height);
    let stream = canvas.captureStream();

    return Object.assign(stream.getVideoTracks()[0], { enabled: false })

  }





  let getUserMedia = () => {

    if ((video && videoAvailable) || (audio && audioAvailable)) {

      navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess)
        .then((stream) => { })
        .catch((e) => console.log(e))

    }
    else {
      try {

        let tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop())

      }
      catch {

      }
    }


  }




  useEffect(() => {

    if (video != undefined && audio != undefined) {
      getUserMedia();
    }

  }, [audio, video])



  let gotMessageFromServer = (fromId, message) => {
    let signal = JSON.parse(message);

    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socketRef.current.emit(
                        "signal",
                        fromId,
                        JSON.stringify({ sdp: connections[fromId].localDescription })
                      );
                    })
                    .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log(e));
      }

      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };





  let addMessage = (data, sender, socketIdSender) => {
    setmessages((prevMessages) => [
      ...prevMessages,
      { sender: sender, data: data }
    ])

    if (socketIdSender != socketIdRef.current) {
      setnewMessages((prev) => prev + 1);
    }

  }



  let connectToSocketServer = () => {

    socketRef.current = io.connect(server_url, { secure: false });


    socketRef.current.on("signal", gotMessageFromServer);

    socketRef.current.on("connect", () => {

      socketRef.current.emit("join-call", window.location.href);
      socketIdRef.current = socketRef.current.id;

      socketRef.current.on("chat-message", addMessage)

      socketRef.current.on("user-left", (id) => {

        setvideos((videos) => videos.filter((video => video.socketId != id)))

      })


      socketRef.current.on("user-joined", (id, clients) => {

        clients.forEach((socketListId) => {

          connections[socketListId] = new RTCPeerConnection(peerConfigConnections);

          connections[socketListId].onicecandidate = (event) => {


            if (event.candidate != null) {
              socketRef.current.emit("signal", socketListId, JSON.stringify({ ice: event.candidate }))
            }

          }

          connections[socketListId].onaddstream = (event) => {

            let videoExits = videoRef.current.find(video => video.socketId === socketListId);

            if (videoExits) {
              setvideos(videos => {
                const updatedVideos = videos.map(video =>
                  video.socketId === socketListId ? { ...video, stream: event.stream } : video

                );

                videoRef.current = updatedVideos;
                return updatedVideos;
              })
            } else {

              let newVideo = {
                socketId: socketListId,
                stream: event.stream,
                autoPlay: true,
                playsinline: true

              }

              setvideos(videos => {

                const updatedVideos = [...videos, newVideo]
                videoRef.current = updatedVideos;
                return updatedVideos;

              })

            }


          }




          if (window.localStream != undefined && window.localStream != null) {

            connections[socketListId].addStream(window.localStream);

          }
          else {
            let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            connections[socketListId].addStream(window.localStream);
          }


        })


        if (id === socketIdRef.current) {
          for (let id2 in connections) {

            if (id2 == socketIdRef.current) continue

            try {

              connections[id2].addStream(window.localStream);

            }
            catch (e) { }

            connections[id2].createOffer().then((description) => {
              connections[id2].setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit("signal", id2, JSON.stringify({ "sdp": connections[id2].localDescription }))
                })
                .catch(e => console.log(e))

            })



          }
        }



      })




    })

  }




  let getMedia = () => {
    setvideo(videoAvailable);
    setaudio(audioAvailable);

    connectToSocketServer();

  }

  let connect = () => {
    setaskForUsername(false);
    getMedia();
  }


  let handleVideo = () => {
    setvideo(!video);
  }


  let handleAudio = () => {
    setaudio(!audio);
  }


  let getDisplayMediaSuccess = (stream) => {

    try {
      window.localStream.getTracks().forEach(track => track.stop())


    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue
      connections[id].addStream(window.localStream);
      connections[id].createOffer().then((description) => {
        connections[id].setLocalDescription(description)
          .then(() => {
            socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }))
          })
          .catch(e => console.log(e));
      })
    }



    stream.getTracks().forEach(track => track.onended = () => {
      setscreen(false);

      try {
        let tracks = localVideoRef.current.srcObject.getTracks()
        tracks.forEach(track => track.stop())

      } catch (e) {
        console.log(e);
      }

      let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
      window.localStream = blackSilence();
      localVideoRef.current.srcObject = window.localStream;



      getUserMedia();

    })

  }

  let getDisplayMedia = () => {

    if (screen && navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      navigator.mediaDevices.getDisplayMedia({ video: true })
        .then(getDisplayMediaSuccess)
        .catch(e => console.log("getDisplayMedia error:", e));
    }
  }

  useEffect(() => {
    if (screen != undefined) {
      getDisplayMedia();
    }

  }, [screen]);


  let handleScreen = () => {
    setscreen(!screen);
  }


  let handleChat = () => {
  
    setshowModel(!showModel);

  }


  let sendMessage = () => {

    socketRef.current.emit("chat-message", message, username);
    setmessage("");

  }


  /*
  
  let handleEndCall=()=>{
    try{
      let tracks=localVideoRef.current.srcObject.getTracks();
      tracks.forEach(track=>track.stop());

    }catch(e){
      console.log(e);
    }
    
    
    routeTo("/home");
     
  }


  */


  let handleEndCall = () => {
  try {
    // Stop local video/audio tracks
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const tracks = localVideoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }

    // Close all peer connections
    for (let id in connections) {
      try {
        connections[id].close();
      } catch (e) {
        console.log("Error closing peer:", e);
      }
      delete connections[id];
    }

    
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    
    window.localStream = null;
  } catch (e) {
    console.log("Error ending call:", e);
  }

 
  const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };

  if (!isAuthenticated()) {
    routeTo("/");
  } else {
    routeTo("/home");
  }

};


  return (
    <div>

      {askForUsername === true ?
         
         <div className="lobbyContainer">

           <IconButton
          onClick={() => routeTo("/")}
          sx={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
            color: "white",
            zIndex: 1000,
          }}
        >
          <HomeIcon />
        </IconButton>


          <div className="lobbyBox">
            <h2 style={{color:"white"}}>Enter into Lobby</h2>
            <TextField
              id="outlined-basic"
              label="username"
              value={username}
              onChange={(e) => setusername(e.target.value)}
              variant="outlined"
            />
            <Button variant="contained" onClick={connect}>Connect</Button>

            <video ref={localVideoRef} autoPlay muted></video>
          </div>
        </div>  :

        <div className='meetVideoContainer'>

          <video className='meetUserVideo' ref={localVideoRef} autoPlay ></video>

          {showModel ? <div className="chatRoom">


            <div className='chatContainer'>

              <h1>Chat</h1>

              <div className="chattingArea">


                <div className="chattingDisplay">

                  {messages.length> 0 ? messages.map((item, i) => (

                    <div key={i}  style={{marginBottom:"20px"}}>
                      <p style={{fontWeight:"bold"}}><p>{item.sender === username ? "You" : item.sender}</p></p>
                      <p>{item.data}</p>
                    </div>

                  )):<p>No Messages Yet</p>}

                </div>

                <TextField id="outlined-basic" label="Type a Message " variant="outlined" value={message} onChange={(e) => setmessage(e.target.value)} />
                <Button variant='contained' onClick={sendMessage}>Send</Button>


              </div>

            </div>

          </div> : <></>}


          <div className="buttonContainers">
            <IconButton style={{ color: "white" }} onClick={handleVideo}>
              {(video == true) ? <VideocamIcon style={{ fontSize: "2rem" }} /> : <VideocamOffIcon style={{ fontSize: "2rem" }} />}
            </IconButton>

            <IconButton style={{ color: "white" }} onClick={handleEndCall}>
              < CallEnd style={{ fontSize: "2rem", color: "red" }} />
            </IconButton>


            <IconButton style={{ color: "white" }} onClick={handleAudio}>
              {(audio == true) ? <MicIcon style={{ fontSize: "2rem" }} /> : <MicOffIcon style={{ fontSize: "2rem" }} />}
            </IconButton>


            {screenAvailable == true ?
              <IconButton onClick={handleScreen}>
                {screen == true ? <ScreenShareIcon style={{ fontSize: "2rem", color: "white" }} /> : <StopScreenShareIcon style={{ fontSize: "2rem", color: "white" }} />}
              </IconButton>
              : <></>
            }

            <Badge badgeContent={newMessages} max={999} color='secondary'>

              <IconButton style={{ color: "white" }} onClick={handleChat}>
                <ChatIcon />
              </IconButton>

            </Badge>

          </div>

          <div className='confrenceView'>
            {

              videos.map((video) => (
                <div key={video.socketId}  >


                  <video
                    data-socket={video.socketId}

                    ref={(ref) => {
                      if (ref && video.stream) {
                        ref.srcObject = video.stream;
                      }
                    }}
                    autoPlay
                    playsInline
                   

                  >
                  </video>


                </div>
              ))
            }

          </div>



        </div>


      }



    </div>
  )

}



