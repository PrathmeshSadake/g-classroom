import React, { useEffect } from 'react';
import { useState } from 'react';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';
import Moment from 'react-moment';
import SendIcon from '@mui/icons-material/Send';

import { IconButton, Button } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  Avatar,
  MessageInput,
  MessageSeparator,
} from '@chatscope/chat-ui-kit-react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from 'src/firebase/firebase-config';
import { useParams } from 'react-router-dom';

const ChatScreen = () => {
  const auth = getAuth();
  let { id } = useParams();
  const [copied, setCopied] = React.useState(true);

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [user, loading, error] = useAuthState(auth);
  const [chatroom, setchatroom] = useState(null);

  // const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));

  // useEffect(() => {
  //   onSnapshot(q, (snapshot) =>
  //     setMessages(snapshot.docs.map((doc) => doc.data()))
  //   );
  // }, []);
  // useEffect(() => {}, [messages]);

  async function sendMessage() {
    const msg = input;
    setInput('');
    const docRef = doc(db, 'chatrooms', id);
    const docSnap = await getDoc(docRef);
    const classRoomData = docSnap.data();
    let tempMessages = classRoomData.messages;
    tempMessages.push({
      text: msg,
      uid: user.uid,
      senderName: user.displayName,
      avatar: user.photoURL,
      timestamp: Date.now(),
    });
    updateDoc(docRef, {
      messages: tempMessages,
    });
    fetchChatroomMessages();
    // handleClose();
  }

  const fetchChatroomMessages = async () => {
    const docRef = doc(db, 'chatrooms', id);
    const docSnap = await getDoc(docRef);
    const chatroomData = docSnap.data();
    setchatroom(chatroomData);
    setMessages(chatroomData.messages);
  };

  useEffect(async () => {
    const docRef = doc(db, 'chatrooms', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      fetchChatroomMessages();
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!');
    }
  }, []);

  const getDate = (timestamp) => {
    return <Moment date={timestamp} format='HH:mm a, DD MMM' />;
  };

  return (
    <div
      style={{
        height: '600px',
        // overflow: 'hidden',
        marginBottom: '20px',
      }}
    >
      <h3>{chatroom?.name} Conversations</h3>
      <CopyToClipboard text={id} onCopy={() => setCopied(true)}>
        <Button
          variant='outlined'
          sx={{
            my: 2,
          }}
        >
          Copy Invite Code
          <ContentCopyIcon sx={{ ml: 1 }} />
        </Button>
      </CopyToClipboard>
      <ChatContainer>
        <MessageList style={{ padding: '10px 0' }}>
          {/* <MessageSeparator content='Saturday, 30 November 2019' /> */}
          {messages.map((message) => (
            <Message
              style={{ my: 3 }}
              model={{
                message: message.text,
                sentTime: getDate(message.timestamp),
                sender: message.senderName,
                direction: message.uid === user.uid ? 'outgoing' : 'incoming',
                position: 'single',
              }}
              avatarSpacer={message.uid !== user.uid ? true : false}
            >
              {message.uid !== user.uid && (
                <Avatar
                  src={
                    message.avatar
                      ? message.avatar
                      : '/static/mock-images/avatars/avatar_default.jpg'
                  }
                />
              )}
              <Message.Footer
                sender={message.senderName}
                sentTime={getDate(message.timestamp)}
              />
            </Message>
          ))}
        </MessageList>
        <MessageInput
          style={{ backgroundColor: '#F9FAFB' }}
          placeholder='Type message here'
          attachButton={false}
          value={input}
          onChange={(e) => {
            setInput(e);
          }}
          onSend={sendMessage}
        />
      </ChatContainer>
    </div>
  );
};

export default ChatScreen;
