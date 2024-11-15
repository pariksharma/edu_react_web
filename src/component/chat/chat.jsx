import React, { useState, useEffect } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, update, push } from 'firebase/database';
import LiveChat from './liveChat';
import MQTTchat from './MQTTchat';
import { decrypt, encrypt, get_token } from '@/utils/helpers';
import { getContentMeta } from '@/services';
import Header from '../header/header';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8ISZRq949XJrbNeZm0gK54d9Q3zAzBtI",
  authDomain: "lab-elsaq-education.firebaseapp.com",
  databaseURL: "https://lab-elsaq-education-default-rtdb.firebaseio.com",
  projectId: "lab-elsaq-education",
  storageBucket: "lab-elsaq-education.appspot.com",
  messagingSenderId: "413835077933",
  appId: "1:413835077933:web:e9ad389b4f0e203dfa0ba4",
  measurementId: "G-1527TMN738"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Get Firebase Realtime Database instance

const Chat = ({chat_node, course_id, video_id}) => {

  const [publicChat, setPublicChat] = useState(null);
  const [isFireBase, setIsFireBase] = useState(null);
  const [chatNode, setChatNode] = useState(null);
  const [settingNode, setSettingNode] = useState(null);
  const [port, setPort] = useState(null);
  const [listenURL, setListenURL] = useState(null);

  useEffect(() => {
    fetchContentMeta()
  }, [video_id])

  const fetchContentMeta = async () => {
    try {
        const userId = localStorage.getItem('user_id') 
        const token = get_token();
        const formData = {
            token : video_id,
            user_id: userId
        }
        const response_contentMeta_service = await getContentMeta(encrypt(JSON.stringify(formData), token));
        const response_contentMeta_data = decrypt(response_contentMeta_service.data, token);
        console.log('response_contentMeta_data', response_contentMeta_data)
        if(response_contentMeta_data.status){
            const data = response_contentMeta_data?.data?.video
            setPublicChat(data?.extra_params?.public_chat)
            setIsFireBase(response_contentMeta_data?.data?.live_chat?.is_firebase)
            setPort(response_contentMeta_data?.data?.live_chat?.port)
            setChatNode(response_contentMeta_data?.data?.live_chat?.chat_node)
            setSettingNode(response_contentMeta_data?.data?.live_chat?.setting_node)
            setListenURL(response_contentMeta_data?.data?.live_chat?.listenUrl)
            // console.log('data?.live_chat?.is_firebase', data?.live_chat?.is_firebase)
        }
        else{
          setPublicChat(0)
        }
    } catch (error) {
        console.log('error found: ', error)
    }
}


  return (
    <>
      <Header />
      <div className="container-fluid">
        <div className="row liveChatTabs">
          <div className="card p-2 col-md-12">
            <Tabs
              defaultActiveKey="Live Chat"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab className="liveChat" eventKey="Live Chat" title="Live Chat">
              {isFireBase != 0 ? 
                <LiveChat
                  chat_node = {chat_node}
                  course_id = {course_id}
                  isPublic = {publicChat}
                />
                :
                <MQTTchat
                  chatNode = {chatNode}
                  settingNode = {settingNode}
                  port = {port}
                  listenURL = {listenURL}
                  chat_node = {chat_node}
                  course_id = {course_id}
                  isPublic = {publicChat}
                />
              }
              </Tab>
              <Tab eventKey="Live Poll" title="Live Poll">
                Tab content for Profile
              </Tab>
              <Tab eventKey="PDF" title="PDF">
                Tab content for Contact
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
