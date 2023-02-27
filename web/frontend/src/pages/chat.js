import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head';
import { DashboardLayout } from '../components/dashboard-layout';

import { useAuthContext } from '../contexts/auth-context';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

import {
  Grid,
  List,
  ListItem,
  Box,
  ListItemIcon,
  ListItemButton,
  TextField,
  ListItemText,
  Avatar,
  Divider,
  Button,
  Paper
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Container } from '@mui/system';

firebase.initializeApp({
  apiKey: "AIzaSyBAoctJXaWX8BxzWrxJHfcJqewbiCIbf0A",
  authDomain: "vesta-chat-b2aec.firebaseapp.com",
  projectId: "vesta-chat-b2aec",
  storageBucket: "vesta-chat-b2aec.appspot.com",
  messagingSenderId: "1006838308719",
  appId: "1:1006838308719:web:abf90b71f45dbb1a41d29a"
})
  
const firestore = firebase.firestore();
var unsubscribe = null;
var messagesRef = null;

// Adapted from https://github.com/fireship-io/react-firebase-chat
// and https://gist.github.com/muhammadawaisshaikh/542f9cff88caaed33e2b601142b7b0e0#file-chat-js

const Chat = () => {
  const {authAxios, userId} = useAuthContext();
  const router = useRouter();
  const [myName, setMyName] = useState('');
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const dummy = useRef();
  

  // get all the available rooms and create new one if needed
  useEffect(() => {
    const receiver = parseInt(router.query.receiver);
    
    if (receiver) {
      // create desired room if it doesnt exist
      const userPair = [userId, receiver].sort();
      const roomId = userPair.toString();
      firestore.collection('rooms').doc(roomId)
        .set({ users: userPair }, { merge: true })
        .then(() => {
          console.log("Room created")
        })
        .catch((error) => {
          console.error("Error writing document: ", error)
        });
    }

    // find all rooms that this user is part of
    firestore.collection('rooms').where('users', 'array-contains', userId)
      .get()
      .then((querySnapshot) => {
        const docMap = new Map();
        const requests = [];
        querySnapshot.forEach((doc) => {
          const users = doc.get('users');
          const otherId = (userId == users[0]) ? users[1] : users[0];
          docMap.set(otherId, doc);
          requests.push(authAxios.get(`/api/userinfo/${otherId}`));
        });

        axios.all(requests)
          .then((responses) => {
            const roomInfo = responses.map(res => ({
              doc: docMap.get(res.data.id),
              label: `${res.data.first_name} ${res.data.last_name}`
            }));
            setRooms(roomInfo);
            setFilteredRooms(roomInfo);
          });

        selectRoom(querySnapshot.docs[0], 0);
      })
      .catch((error) => {
        console.error("error getting documents: ", error);
      });		

    // update user's name in chat header
    authAxios.get(`/api/userinfo/${userId}`)
      .then((res) => {
        setMyName(`${res.data.first_name} ${res.data.last_name}`);
      })
      .catch((err) => {
        console.log(err);
      });

    return function cleanup() {
      // unsubscribe from chat rooms to stop incoming messages
      unsubscribe?.();
    };
  }, []);


  const selectRoom = (room, index) => {
    setSelectedIndex(index);
    // unsubscribe from previous chat room is there was one, empty previous messages
    console.log(unsubscribe);
    unsubscribe?.();
    setMessages([]);
    // load the latest 25 messages in this room
    messagesRef = room.ref.collection('messages');
    
    // subscribe for future messages in this chat room
    unsubscribe = messagesRef.orderBy('createdAt').limitToLast(20)
      .onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          console.log("change type:", change.type);
          if (change.type === "added") {
            console.log("new doc: ", change.doc.data());
            setMessages(oldMsgs => 
              [...oldMsgs, {
                id: change.doc.id, 
                ...change.doc.data()
              }]);
          }
        });
      });
  }

  const sendMessage = async (e) => {
    e.preventDefault();

    console.log (messagesRef);
    await messagesRef.add({
      text: messageText,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      sender: userId
    });
    setMessageText('');
    dummy.current.scrollIntoView({ behaviour: 'smooth' });
  }

  const filterRooms = (searchVal) => {
    if (!searchVal) {
      setFilteredRooms(rooms);
    } else {
      const filtered = rooms.filter((room) => {
        return room.label.toLowerCase().includes(searchVal.toLowerCase());
      });
      setFilteredRooms(filtered); 
    }
  }

  const avatarSize = {
    height: 40,
    width: 40,
    ml: 1,
  }

  const stringAvatar = (name) => ({
    sx: {
      ...avatarSize,
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')?.[0]?.[0]}${name.split(' ')?.[1]?.[0]}`,
  })

  const stringToColor = (string) => {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }

  return (
    <>
      <Head>
        <title>
            Chat | Vesta
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth={false}>
          <div>
            <h1>Chat</h1>
            <Grid container component={Paper} elevation={6}>
              <Grid item xs={3}>
                <List>
                  <ListItem key="JohnWick">
                    <ListItemIcon>
                      <Avatar {...stringAvatar(myName)}/>
                    </ListItemIcon>
                    <ListItemText primary={myName}></ListItemText>
                  </ListItem>
                </List>
                <Divider />
                <Grid item xs={12} style={{padding: '10px'}}>
                  <TextField
                    onChange={(event) => filterRooms(event.target.value)} 
                    label="Search" 
                    variant="outlined" 
                    fullWidth 
                  />
                </Grid>
                <Divider />
                <List>
                  {
                    filteredRooms.map((room, index) => (
                      <ListItemButton
                        key={index}
                        selected={selectedIndex===index}
                        onClick={() => selectRoom(room.doc, index)}
                      >
                        <ListItemIcon>
                          <Avatar {...stringAvatar(room.label)}/>
                        </ListItemIcon>
                        <ListItemText primary={room.label ? room.label : "John Smith"}></ListItemText>
                      </ListItemButton>
                    ))
                  }
                </List>
              </Grid>
              <Grid item xs={9} className="borderLeft500">
                <Container className='messageArea'>
                  {
                    messages.map((message) => (
                      <ChatMessage key={message.id} message={message} userId={userId} />
                    ))
                  }
                  <div ref={dummy}></div>
                </Container>
                <Divider />
                <form onSubmit={sendMessage}>
                  <Grid container style={{padding: '20px'}}>
                    <Grid item xs={11}>
                      <TextField value={messageText} onChange={(e) => setMessageText(e.target.value)} label="Type Something..." fullWidth />
                    </Grid>
                    <Grid xs={1} align="right">
                      <Button type="submit" disabled={!messageText} variant="contained" className="sendButton"><SendIcon /></Button>
                    </Grid>
                  </Grid>
                </form>
              </Grid>
            </Grid>
          </div>
        </Container>
      </Box>
    </>
  );
}


function ChatMessage(props) {
  const { text, sender } = props.message;
  const messageClass = sender === props.userId ? 'sent' : 'received';
  
  return (
    <div className={`message ${messageClass}`}>
      <p>{text}</p>
    </div>
  )
}


Chat.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Chat;