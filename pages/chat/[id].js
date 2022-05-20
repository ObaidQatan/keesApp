import styled from "@emotion/styled"
import styles from './[id].module.css';
import { AttachFile, EmojiEmotions, MoreVert, Send } from "@mui/icons-material"
import { Avatar, IconButton, Input, TextField } from "@mui/material"
import { collection, doc, getDoc, query, where } from "firebase/firestore"
import Head from "next/head"
import { useCollection } from "react-firebase-hooks/firestore"
import Sidebar from "../../components/Sidebar"
import Message from "../../components/Message"
import { db } from "../../firebase"
import { base64ToUtf8 } from "../../helperFunctions/helper"
import { useState } from "react"


function Chat({chatID, recipient,messages}) {

    if(!recipient)
        return window.location.href = '/';

    const [msgInputValue, setMsgInputValue] = useState('');

    const handleInputChange = (e)=>{
        console.log(e.target.value);
        setMsgInputValue(e.target.value);
    }

    const handleSendMessage = ()=>{
        if(!msgInputValue.trim().length)
            return;

            //TODO: construct message
    }
        
    return (
    <Container>
        <Head>
            <title>Kees | {recipient.email}</title>
        </Head>

        <Sidebar />

        <ChatSection>

            <Header>
                <ChatAvatar recipient={{email: recipient.email, photo: recipient.photo}} />

                <RecipientName>
                    {recipient.name?recipient.name:recipient.email}
                </RecipientName>

                <ChatOptions>

                    <IconButton>
                        <AttachFile />
                    </IconButton>

                    <IconButton>
                        <MoreVert />
                    </IconButton>

                </ChatOptions>

            </Header>

            <Body>
                <MessagesSection>
                   {messages.map(message=>(
                        <Message key={message.id} id={message.id} senderEmail={message.senderEmail} content={message.content} date={message.date}/>
                    ))}
                </MessagesSection>

                <InputSection>

                    <IconButton>
                        <EmojiEmotions />
                    </IconButton>

                    <InputField onChange={handleInputChange} value={msgInputValue} multiline variant="filled" label="Type..." 
                    InputProps={{classes: {input: styles['chat-input-field']}}} />
                        
                    <SendButton onClick={()=>handleSendMessage()} />
                        

                </InputSection>
            </Body>

        </ChatSection>
    </Container>
  )
}

export default Chat

export async function getServerSideProps(context) {
    const {target} = context.query;
    if(!target)
        return {
            props: {}
        }

    const recipient = JSON.parse(base64ToUtf8(target));
    const chatID = context.params.id;
    const chatSnapshot = await getDoc(doc(db,`chats/${chatID}`));
    const messages = chatSnapshot?.get('messages');
        //timestamp check

    // const messages = [
    //     {id:1,content:'Hello',senderEmail:'ogaten27@gmail.com', date: '2020-01-01T00:00:00.000Z'},
    //     {id:2,content:'hii',senderEmail:'oqaten27@gmail.com', date: '2020-01-01T00:00:00.000Z'},
    //     {id:3,content:'howr u!',senderEmail:'ogaten27@gmail.com', date: '2020-01-01T00:00:00.000Z'},
    //     {id:1,content:'Hello',senderEmail:'ogaten27@gmail.com', date: '2020-01-01T00:00:00.000Z'},
    //     {id:2,content:'hii',senderEmail:'oqaten27@gmail.com', date: '2020-01-01T00:00:00.000Z'},
    //     {id:3,content:'howr u!',senderEmail:'ogaten27@gmail.com', date: '2020-01-01T00:00:00.000Z'},
    //     {id:1,content:'Hello',senderEmail:'ogaten27@gmail.com', date: '2020-01-01T00:00:00.000Z'},
    //     {id:2,content:'hii',senderEmail:'oqaten27@gmail.com', date: '2020-01-01T00:00:00.000Z'},
    //     {id:3,content:'howr u!',senderEmail:'ogaten27@gmail.com', date: '2020-01-01T00:00:00.000Z'},
    //     {id:1,content:'Hello',senderEmail:'ogaten27@gmail.com', date: '2020-01-01T00:00:00.000Z'},
    //     {id:2,content:'hii',senderEmail:'oqaten27@gmail.com', date: '2020-01-01T00:00:00.000Z'},
    //     {id:3,content:'howr u!',senderEmail:'ogaten27@gmail.com', date: '2020-01-01T00:00:00.000Z'},
    //     {id:1,content:'Hello',senderEmail:'ogaten27@gmail.com', date: '2020-01-01T00:00:00.000Z'},
    //     {id:2,content:'hii',senderEmail:'oqaten27@gmail.com', date: '2020-01-01T00:00:00.000Z'},
    //     {id:3,content:'howr u!',senderEmail:'ogaten27@gmail.com', date: '2020-01-01T00:00:00.000Z'},
    //     {id:1,content:'Hello',senderEmail:'ogaten27@gmail.com', date: '2020-01-01T00:00:00.000Z'},
    //     {id:2,content:'hii',senderEmail:'oqaten27@gmail.com', date: '2020-01-01T00:00:00.000Z'},
    //     {id:3,content:'howr u!',senderEmail:'ogaten27@gmail.com', date: '2020-01-01T00:00:00.000Z'},
    // ];
  return {
    props: {
        chatID,
        messages: messages?messages:[],
        recipient
    },
  }
}

const ChatAvatar = ({recipient})=>(
    recipient.photo ? (
      <UserAvatar src={recipient.photo} />
      ):(
      <UserAvatar>
        {recipient.email.charAt(0).toUpperCase()}
      </UserAvatar>
  )
)

const SendButton = ({onClick})=>(
    <IconButton onClick={onClick} style={{
        marginLeft:'auto',
    }}>
        <Send />
    </IconButton>
)

const Container = styled.div`
    display: flex;
    height: 100vh;
`;

const ChatSection = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    background-color: whitesmoke;
`

const Header = styled.div`
    position: sticky;
    display: flex;
    justify-content: space-between;
    padding: 15px;
    background: white;
    box-shadow: #00000020 0 0 10px;
    z-index: 10;
    border-radius: 0 0 20px 20px;
`

const UserAvatar = styled(Avatar)`
    width: 50px;
    height: 50px;
`;

const RecipientName = styled.h3`
    font-size: 15px;
    font-weight: bold;
    margin-right: auto;
    margin-left: 10px;
`;

const ChatOptions = styled.div`
    display: flex;
    align-items: center;
`;

const Body = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: hidden;
`;

const MessagesSection = styled.div`
    overflow-y: scroll;
    flex: 1;
    ::-webkit-scrollbar {
        width: 3px;
        background: transparent;
    }
    ::-webkit-scrollbar-thumb {
        background: #00000060;
        border-radius: 10px;
    }
`;

const InputSection = styled.div`
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: white;
`;

const InputField = styled(TextField)`
    flex: 1;
    font-family: Nunito-Medium;
    font-size: 15px;
`;
