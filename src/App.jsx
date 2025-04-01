import React from 'react'
import { useState } from 'react'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import {MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator} from '@chatscope/chat-ui-kit-react'
import './App.css'
import Map from './map'

const API_KEY = "sk-05f3f6d66f2f45faa50e54b3c768c271";

function App() {
  const handleSend = async (message) => {
    console.log(message);
    const newMessage = {
      message: message,
      sender: 'user',
      timestamp: new Date().toISOString(),
      direction: "outgoing"
    }
  
    const newMessages = [...messages, newMessage] //All the old messages and the new ones
  
    //* Update our messages state
    setMessages(newMessages);
    
    //* Set a typing indecators
    setTyping(true);
    //* Process message to chatGPT (send it and see the response)
    await processMessageToChatGPT(newMessages);
  }

  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am ChatGPT!",
      sender: "ChatGPT"
    }
  ]);

  async function processMessageToChatGPT(chatMessage){
    let apiMessages =chatMessage.map((messageObject) => {
      let role = "";
      if(messageObject.sender === "ChatGPT"){
        role="assistant";
      }else{
        role="user";
      }
      return{ role: role, content: messageObject.message }
    });

    const systemMessage = {
      role: "system",
      content: "Explain all concepts like I am 10 years old" // Speak like a pirate

    }
    const apiRequestBody = {
      "model": "DeepSeek-R1",
      "messages": [
        systemMessage,
        ...apiMessages
      ]
    }

    //const response = 
    await fetch("https://api.deepseek.com/chat/completions",{
      mode: "cors",
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
      // console.log(data.choices[0].message.content);
      setMessages(
        [...chatMessage, {
          message: data.choices[0].message.content,
          sender: "ChatGPT"
        }]
      );
      setTyping(false);
    });
    // const data = await response.json();
    // console.log(data);
    // if (!response.ok) {
    //   throw new Error(`API Error: ${response.status} ${response.statusText}`);
    // }

    //////!////////!



  }
    //? Map project
  const [zoomLevel, setZoomLevel] = useState(0);

  return (
    <div className='MyApp' style={{border:'1px solid', display:'flex', justifyContent:'center', alignContent:'center',width:'900px', height:'500px', borderRadius:'20px'}}>
      {/* <MainContainer>
        <ChatContainer>
          <MessageList typingIndicator={typing ? <TypingIndicator content="ChatGPt is typing"/> : null}>
            {messages.map((message, i) =>{
              return <Message key={i} model={message}/>
            })}
          </MessageList>
          <MessageInput placeholder='Type prompt here!' onSend={handleSend}/>
        </ChatContainer>
      </MainContainer> */}

        <h1 style={{margin:'auto'}}>Zoom Level {zoomLevel}x</h1>
        <button onClick={() => {setZoomLevel(zoomLevel + 1)}} style={{width:'60px', height:'100px', backgroundColor:'green', marginTop:'200px', marginRight:'20px'}}>+1</button>
        <button onClick={() => {setZoomLevel(zoomLevel - 1)}} style={{width:'60px', height:'100px', backgroundColor:'red', marginTop:'200px'}}>-1</button>
        <Map zoomLevel={zoomLevel}/>
    </div>
  )
}



export default App
