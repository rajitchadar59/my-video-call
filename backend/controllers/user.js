const User = require('../models/User');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Meeting = require('../models/Meeting');

module.exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "please provide" }); // 400 Bad Request
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "user not found" }); // 404 Not Found
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "invalid password" }); // 401 Unauthorized
    }

    let token = crypto.randomBytes(20).toString("hex");
    user.token = token;
    await user.save();

    return res.status(201).json({ token: token ,message:"logged in successful " }); // 201 OK
  }
  catch (e) {
    res.status(500).json({ message: "something went wrong" }); // 500 Internal Server Error
  }
}


module.exports.register = async (req, res) => {
  const { name, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" }); // 409 Conflict
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: name,
      username: username,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: "User Registered" }); // 201 Created
  }
  catch (e) {
    res.status(500).json({ message: `something went wrong ${e}` }); // 500 Internal Server Error
  }
}


module.exports.getUserHistory=async(req,res)=>{
  const {token} = req.query;
  try{
   const user= await User.findOne({token:token}); 
   const meetings= await Meeting.find({user_id:user.username});
   res.json(meetings);

  }
  catch(err){
    res.json({message:`something went wrong ${err} `})
  }
}


module.exports.addToHistory= async(req,res)=>{
    const {token ,meetingCode} = req.body; 

    try{
      const user = await User.findOne({token:token});

      const newMeeting=new Meeting({
        user_id:user.username,
        meetingCode:meetingCode
      })

      await newMeeting.save();

      res.status(201).json({ message: "Added code to history" });

    }
    catch(err){
       res.json({message:`something went wrong ${err} `})
    }

}