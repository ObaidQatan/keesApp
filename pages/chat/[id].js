import styled from "@emotion/styled"
import styles from './[id].module.css';
import { AttachFile, EmojiEmotions, HideSourceRounded, MoreVert, Send } from "@mui/icons-material"
import { Avatar, IconButton, Input, TextField } from "@mui/material"
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc, SnapshotMetadata, where } from "firebase/firestore"
import Head from "next/head"
import { useCollection } from "react-firebase-hooks/firestore"
import Sidebar from "../../components/Sidebar"
import Message from "../../components/Message"
import { db } from "../../firebase"
import { base64ToUtf8, getRecipientAvailablity, getUser, updateLastSeen } from "../../helperFunctions/helper"
import { useEffect, useRef, useState } from "react"


function Chat({chatID, recipient,messages}) {

    useEffect(()=>{
        if(!recipient){
            return window.location.href = '/';
        }
    }
    ,[recipient])

    const [isHidden, setIsHidden] = useState(false);

    const [msgInputValue, setMsgInputValue] = useState('');
    const [recipientAvailablity, setRecipientAvailablity] = useState('');
    const user = getUser();
    updateLastSeen(user);
    
    recipient = JSON.parse(base64ToUtf8(recipient));
    messages = JSON.parse(messages);
    getRecipientAvailablity(recipient, setRecipientAvailablity, 30000);
    

    const [messagesSnapshot] = useCollection(query(collection(db,`chats/${chatID}/messages`), orderBy('message.date','asc')));
    const bottomRef = useRef();
    const [isSending,setIsSending] = useState(false);
    const [sendingMsg,setSendingMsg] = useState('');

   
    const listenToWindowResize = ()=>{
        addEventListener('resize',(e)=>{
          if(window.innerWidth <= 700) 
            setIsHidden(true);
          else
            setIsHidden(false)
        })
      }

      const checkIfMobileWindow = ()=>{
        useEffect(()=>{
            if(window.innerWidth <= 700) 
                setIsHidden(true);
            else
                setIsHidden(false)
        },[])
      }

    const scrollToBottom = ()=>{
        bottomRef.current?.scrollIntoView();
        setTimeout(() => {
            bottomRef.current?.scrollIntoView();
        }, 100);
    }
    const handleInputChange = (e)=>{
        onkeydown = (e)=>{
            if(e.key==='Enter' && e.ctrlKey){
                return handleSendMessage();
            }
        }
        setMsgInputValue(e.target.value);
    }

    const handleHideSideBar = ()=>{
        setIsHidden(!isHidden);
    }


    const handleSendMessage = ()=>{
        if(!msgInputValue.trim().length)
            return;

            setSendingMsg(`${msgInputValue} (sending...)`);
            setIsSending(true);
            // renderPendingMessage();
            scrollToBottom();
            //{id:1,content:'Hello',senderEmail:'ogaten27@gmail.com', date: '2020-01-01T00:00:00.000Z'}
            const message = {
                id: Math.random(12).toString().slice(2),
                content: msgInputValue,
                senderEmail: user.email,
                date: serverTimestamp()
            }

            let unsubscribe = onSnapshot(doc(db,`chats/${chatID}/messages/${message.id}`),(snapshot)=>{
                if(snapshot.exists()){
                    //Note: message sent
                    setIsSending(false);
                    setMsgInputValue('');
                    scrollToBottom();
                    unsubscribe();

                }else{
                    //Note: message not sent
                    if(navigator.onLine){
                        setDoc(doc(db,`chats/${chatID}/messages/${message.id}`)
                        ,{message});
                    }else{
                        setMsgInputValue('');
                        setSendingMsg(`${msgInputValue} (failed to send!)`);
                        scrollToBottom();
                    }
                }
            },(error)=>{
                setMsgInputValue('');
                setSendingMsg(`${msgInputValue} (failed to send!)`);
                scrollToBottom();
            });

    }


    const renderMessages = ()=>{
        if(messagesSnapshot){
            return (
                messagesSnapshot.docs?.map(msgSnap=>(
                    <Message key={msgSnap.data().message.id} id={msgSnap.data().message.id} content={msgSnap.data().message.content} senderEmail={msgSnap.data().message.senderEmail} date={msgSnap.data().message.date?.toDate()?.toISOString()} />
                ))
            )

        }else{
            return (
                messages.map(message=>(
                    <Message key={message.id} id={message.id} senderEmail={message.senderEmail} content={message.content} date={message.date}/>
                ))
            )
        }
    }

    const renderPendingMessage = ()=>(
        <Message sending={true} id={0} content={sendingMsg} senderEmail={user.email} date={new Date().toISOString()} />
    )

    listenToWindowResize();
    checkIfMobileWindow();

        
    return (
    <Container>
        <Head>
            <title>Kees | {recipient.email}</title>
        </Head>

        <Sidebar isHidden={isHidden}/>

        <ChatSection>

            <Header>
                <ChatAvatar recipient={{email: recipient.email, photo: recipient.photo}} />

                <RecipientName>

                    {recipient.name?recipient.name:recipient.email}
                    <br/>
                    
                    <RecipientStatus status={recipientAvailablity} />
                        
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

                    <HideSideBarButton onClick={handleHideSideBar} >
                        <HideSourceRounded/>
                    </HideSideBarButton>


                    {renderMessages()}
                    {scrollToBottom()}

                    {isSending &&
                    renderPendingMessage()
                    }

                    <BottomOfMessagesSection ref={bottomRef} />
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

    const chatID = context.params.id;
    const messagesSnapshot = await getDocs(query(collection(db,`chats/${chatID}/messages`), orderBy('message.date','asc')));
    const messages = messagesSnapshot?.docs?.map(msg=>({
        date: msg.data().message.date.toDate().toISOString(),
        id: msg.data().message.id,
        content: msg.data().message.content,
        senderEmail: msg.data().message.senderEmail
    }));


  return {
    props: {
        chatID,
        messages: messages? JSON.stringify(messages): '[]',
        recipient: target
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

const RecipientStatus = ({status})=>{
    if(status){
        if(status==='Unknown' || status.toString().toLowerCase().indexOf('last seen') > -1){
            return <StatusNotAvailable>{status}</StatusNotAvailable>
        }else if(status==='Available'){
            return <StatusAvailable>{status}</StatusAvailable>
        }
    }else{
        return <p>...</p>
    }
}

const Container = styled.div`
    display: flex;
    height: 100vh;
    width: 100vw;
`;

const ChatSection = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    background-color: whitesmoke;
`

const HideSideBarButton = styled(IconButton)`
  width: 30px;
  height: 30px;
  z-index: 100;
  position: absolute;
  right: 0;
  top: 40%;
  background-color: white;
  cursor: pointer;
`;

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

const StatusAvailable = styled.p`
    font-size: 12px;
    color: #1cbba6;
`;

const StatusNotAvailable = styled.p`
    font-size: 12px;
    color: #888b8a;
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

const BottomOfMessagesSection = styled.div``;