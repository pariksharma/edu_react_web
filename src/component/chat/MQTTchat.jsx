import React, { useEffect, useRef, useState } from 'react'
import mqtt from 'mqtt';
import { format } from "date-fns";

const MQTTchat = ({listenURL, port, settingNode, chatNode, course_id, isPublic}) => {

    const [client, setClient] = useState(null);
    const [connectStatus, setConnectStatus] = useState(null);
    const [input, setInput] = useState('')
    const [chatData, setChatData] = useState([])
    const [userId, setUserId] = useState('')
    const chatContainerRef = useRef(null);

  ////////////////// MQTT Connection ////////////////
    const mqttConnect = (host) => {
        console.log('host', host)
        setConnectStatus("Connecting");
        setClient(mqtt.connect(host));
      };
      
    //   console.log('client', client)
      ////////////////// MQTT Connection Credential ////////////////

  const brokerUrl = `wss://chat-ws.videocrypt.in:8084/mqtt`;

  useEffect(() => {
    mqttConnect(brokerUrl);
  }, []);

  ////////////////// getting data from MQTT ////////////////

  useEffect(() => {
    if (client) {
      client.on("connect", () => {
        setConnectStatus("Connected");
        client.subscribe(chatNode, { qos: 1 }, (err) => {
          if (err) {
            console.error("Subscription error:", err);
          } else {
            console.log(`Subscribed to chatNode "${chatNode}"`);
          }
        });
  
        client.subscribe(settingNode, { qos: 1 }, (err) => {
          if (err) {
            console.error("Subscription error:", err);
          } else {
            console.log(`Subscribed to settingNode "${settingNode}"`);
          }
        });
  
        getChatData();
      });
  
      client.on("error", (err) => {
        console.error("Connection error: ", err);
        client.end();
      });
  
      client.on("reconnect", () => {
        setConnectStatus("Reconnecting");
      });
    }
  }, [client, chatNode, settingNode]);


  useEffect(() => {
    // Scroll to the bottom when chatData changes
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatData]);
  
  const getChatData = () => {
    console.log('getChatData')
    client.on("message", (chatNode, message) => {
        // console.log(`Received message on topic "${topic}": ${message}`);
        setChatData((prevChatData) => [
            ...prevChatData,
            JSON.parse(message.toString()), // Parse the message if it's JSON
        ]);
    });
  };

  const convertToTimestamp = (dateString) => {
    const date = new Date(dateString);
    return date.getTime(); // Convert milliseconds to seconds
  };

  const formatTime = (date) => {
    const cr_date = new Date(date * 1000);
    if (cr_date) {
      return format(cr_date, "h:mm a");
    }
  };

// console.log('chatData', chatData)

  const handleMessge = (e) => {
    e.preventDefault();
    const app_id = localStorage.getItem("appId");
    const user_id = localStorage.getItem("user_id");
    const userName = localStorage.getItem("userName");
    setUserId(localStorage.getItem("user_id"))
    const curr_date = new Date();
    if (input) {
      let msgObject = JSON.stringify({
        id : user_id,
        message : input,
        name : userName,
        date : convertToTimestamp(curr_date),
        platform : 4,
        type : 'text',
        course_id : course_id
      });
      client.publish(chatNode, msgObject, { qos: 1 }, (err) => {
        if (err) {
          console.error("Error publishing message:", err);
        } else {
        //   console.log(` Message published to topic "${chatNode}": ${input}`);
        //   getChatData()
        setInput('')
        }
      });
    }
  };




  return ( <>
    <div className="chat-conversation" >
        {/* {console.log('caht', chatData)} */}
        <div class="simplebar-content-wrapper">
          <div
            class="simplebar-content live-content"
            style={{ overflowY: "hidden" }}
            ref={chatContainerRef}
          >
            <ul
              class="list-unstyled chat-conversation-list"
              id="chat-conversation-list"
            >
              {chatData?.length > 0 &&
                chatData.map((chat, index) => (
                  <div
                    key={index}
                    className={`chat-list ${userId === chat.id ? "right" : "left"}`}
                  >
                     <div class="conversation-list">
                      <div class="user-chat-content">
                        <div class="ctext-wrap">
                          <div
                            class={`ctext-wrap-content ${
                              userId === chat.id ? "" : "left-in"
                            }`}
                          >
                            <p class="mb-0 ctext-content-live">
                              <h5 class="conversation-name mb-2">
                                {chat.name}
                              </h5>

                              {chat?.type == "text" && chat?.message}
                              {chat?.type == "image" && (
                                <img src={chat?.message} className="w-100" alt="" />
                                )}
                                {chat?.type == "pdf" && (
                                <div
                                    onClick={() => handlePdf(chat?.message)}
                                    style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginTop: "10px",
                                    cursor: "pointer",
                                    }}
                                >
                                    <FaRegFilePdf size={24} color="red" />{" "}
                                    <span style={{ marginLeft: "10px" }}>
                                    {chat?.message.substring(
                                        chat?.message.lastIndexOf("/") + 1
                                    ) || "No PDF selected"}
                                    </span>
                                </div>
                                )}
                              {chat?.type == "audio" && <AudioPlayer
                                  audioUrl={chat?.message}
                                  userName="Ankur Tiwari"
                                  duration={chat?.date && formatTime(chat?.date)}
                                />
                                }
                            </p>
                          </div>
                        </div>
                        <div class="left-time">
                          <small
                            class="dropdown-btn text-muted mb-0 ms-2"
                            tabindex="0"
                          >
                            {chat?.date && formatTime(chat?.date)} |{" "}
                            {/* <i class="bi bi-three-dots-vertical"></i> */}
                          </small>
                        </div>
                      
                      </div>
                    </div>
                  </div>
                ))}
            </ul>
          </div>
        </div>
      </div>
      <form className="chat_input pt-1 pb-0 p-0" onSubmit={handleMessge}>
        <div class="input-group">
          <input
            className="border-0 input_field form-control"
            type="text"
            value={input} // Disable text if image is selected
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type Something..."
          />
        </div>
        <button
          className="btn p-0 text-white"
          style={{ width: "15%" }}
          type="submit"
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 52 52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="52" height="52" rx="10" fill="#526170" />
            <rect
              width="52"
              height="52"
              rx="10"
              fill="url(#paint0_linear_6730_5285)"
            />
            <path
              d="M17.8473 19.0156L29.4356 15.169C34.636 13.4429 37.4614 16.27 35.7416 21.4485L31.8788 32.988C29.2854 40.749 25.0268 40.749 22.4335 32.988C21.7117 30.8318 20.0053 29.1375 17.8473 28.4212C10.0535 25.8387 10.0535 21.6116 17.8473 19.0156Z"
              fill="white"
              stroke="white"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M20.1387 31.4476L23.4367 28.1543"
              stroke="#F67100"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <defs>
              <linearGradient
                id="paint0_linear_6730_5285"
                x1="4.97391"
                y1="-10.9032"
                x2="-22.5706"
                y2="18.7151"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.034523" stop-color="#F4780E" />
                <stop offset="0.944296" stop-color="#EF991C" />
              </linearGradient>
            </defs>
          </svg>
        </button>
      </form>

    </>
  )
}

export default MQTTchat