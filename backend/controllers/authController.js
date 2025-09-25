const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req,res,next) =>{
  try{
    const { name, email, password } = req.body;
    if(!name||!email||!password) return res.status(400).json({message:'missing fields'});
    const existing = await User.findOne({ email });
    if(existing) return res.status(400).json({message:'user exists'});
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash: hash });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  }catch(err){ next(err); }
}

exports.login = async (req,res,next) =>{
  try{
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({message:'invalid creds'});
    const ok = await bcrypt.compare(password, user.passwordHash);
    if(!ok) return res.status(400).json({message:'invalid creds'});
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  }catch(err){ next(err); }
}
