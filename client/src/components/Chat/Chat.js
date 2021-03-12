import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from 'socket.io-client';
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import DisplayUsers from "../DisplayUsers/DisplayUsers";

import './Chat.css';

let socket;

const Chat = ( { location } ) => {

    const [ name, setName ] = useState('');
    const [ room, setRoom ] = useState('');
    const [ users, setUsers ] = useState('');
    const [ message, setMessage ] = useState('');
    const [ messages, setMessages ] = useState([]);

    const ENDPOINT = 'https://temp-chat-application.herokuapp.com/';

    var connectionOptions =  {
        "force new connection" : true,
        "reconnectionAttempts": "Infinity", 
        "timeout" : 10000,                  
        "transports" : ["websocket"]
    };

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);

        socket = io(ENDPOINT, connectionOptions)

        setName(name);
        setRoom(room);

        socket.emit('join', { name, room }, (error) => {
            if(error) alert(error);
        });
    }, [ENDPOINT, location.search]);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages(messages => [...messages, message]);
        });

        socket.on('roomData', ({ users }) => {
            setUsers(users);
        });

    }, []);

    const sendMessage = (event) => {
        event.preventDefault();



        if(message){
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    console.log("Message: ",message);
    console.log("Messages-> ",messages);
    console.log("Users: ",users);

    return(
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room}/>
                <Messages messages={ messages } name={ name }/>
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
            <DisplayUsers users={users}/>
        </div>
    )
};

export default Chat;