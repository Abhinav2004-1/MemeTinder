import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import socket from 'socket.io';
import bodyparser from 'body-parser';
import sanitizer from 'express-sanitizer';
import dotenv from 'dotenv';
import cors from 'cors';

import RegisterRoute from './Routes/register-route.js';
import CheckJWTRoute from './Routes/check-jwt-route.js';
import ForgetPasswordRoute from './Routes/Password-confirmation-route.js';
import LoginRoute from './Routes/login-route.js';
import MessageRoute from './Routes/message-route.js';
import MatchesRoute from './Routes/matches-route.js';
import FriendRequestRoute from './Routes/friend-request.js';
import DeleterRoute from './Routes/delete-route.js';
import PostRoute from './Routes/posts-route.js';
import ProfileRouter from './Routes/profile-route.js';
import ProfileConfirmRoute from './Routes/profile-confirm.js';
import PostReactRoute from './Routes/change-reacted-profile.js';
import NotificationRoute from './Routes/notifications.js';
import CrashNotifyRoute from './Routes/crash-notification.js';
import MobileRegisterRoute from './Routes/mobile-register.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socket(server);
const PORT = process.env.PORT || 8000;

// middleware
app.use(bodyparser.json({limit: '50mb'}));

// XSS prevention;
app.use(sanitizer());

// disabling Origin change for DDOS prevention;
app.use(cors({
    origin: ['http://localhost:5000', 'http://192.168.0.105:5000', 'https://localhost:3000', 'https://192.168.0.105:3000']
}));

// Socket Connection
io.on('connection', (socket)=>{

    socket.on('join-room', (username)=>{
        socket.join(username)
    })

    socket.on('call-user', data => {
        socket.broadcast.to(data.to).emit("call-incoming", data.sender);
    });

    socket.on("accept-call", data => {
        socket.broadcast.to(data.transmit_to).emit("call-accepted", data.signalData)
    })

    socket.on("call-busy", to => {
        socket.broadcast.to(to).emit("client-busy");
    })

    socket.on('Send-Friend-Request', ( room, sender_name, sender_profile )=>{
        socket.broadcast.to(room).emit('client-request-finder', sender_name, sender_profile )
    })

    socket.on('accept', (username, profile, friend_name)=>{
        socket.broadcast.to(friend_name).emit('match', username, profile)
    })

    socket.on('receive-message-server', (sender, receiver, message)=>{
        socket.broadcast.to(receiver).emit('receive-message-client', sender, message)
    })

    socket.on('notification-server', ( sender, room, profile )=>{
        socket.broadcast.to(room).emit('notification-client', sender, profile);
    })

    socket.on('disconnect', ()=>{})
});

// api Endpoints
app.use('/register', RegisterRoute);
app.use('/check', CheckJWTRoute);
app.use('/forget', ForgetPasswordRoute);
app.use('/login', LoginRoute);
app.use('/matches', MatchesRoute);
app.use('/message', MessageRoute);
app.use('/friend-requests', FriendRequestRoute);
app.use('/delete', DeleterRoute);
app.use('/post', PostRoute);
app.use('/profile', ProfileRouter);
app.use('/profile-confirm', ProfileConfirmRoute);
app.use('/post-react', PostReactRoute);
app.use('/add-notification', NotificationRoute);
app.use('/crash-notification', CrashNotifyRoute);
app.use('/mobile', MobileRegisterRoute);

// DB connection
mongoose.connect(process.env.URI, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log('Connected to mongoDB')
}).catch(()=>{
    console.log('Didnot connect to mongoDB')
});
// listener
server.listen(PORT, ()=>{
    console.log('Listening to localhost:8000')
});