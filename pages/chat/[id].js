import styled from "@emotion/styled"
import { AttachFile, EmojiEmotions, MoreVert, Send } from "@mui/icons-material"
import { Avatar, IconButton, Input } from "@mui/material"
import { collection, query, where } from "firebase/firestore"
import Head from "next/head"
import { useCollection } from "react-firebase-hooks/firestore"
import Sidebar from "../../components/Sidebar"
import Message from "../../components/Message"
import { db } from "../../firebase"
import { base64ToUtf8 } from "../../helperFunctions/helper"


function Chat({recipient,messages}) {

    if(!recipient)
        return window.location.href = '/';
        
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
                   {messages.map((message,index)=>(
                        <Message key={index} content={message.content} />
                    ))}
                </MessagesSection>

                <InputSection>

                    <IconButton>
                        <EmojiEmotions />
                    </IconButton>

                    <InputField />
                        
                    <SendButton />
                        

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
    const messages = [
        {id:1,content:'Hello',senderID:'senderId'},
        {id:2,content:'hii',senderID:'recipientId'},
        {id:3,content:'howr u!',senderID:'senderId'},
    ];
  return {
    props: {
      messages,
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

const SendButton = ()=>(
    <IconButton style={{
        marginLeft:'auto',
    }}>
        <Send />
    </IconButton>
)

const Container = styled.div`
    display: flex;
`;

const ChatSection = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100vh;
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
`;

const MessagesSection = styled.div`
    flex: 1;
    overflow-y: scroll;
`;

const InputSection = styled.div`
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: white;
`;

const InputField = styled(Input)`
    background-color: #00000010;
    border-radius: 10px 10px 0 0;
    flex: 1;
    padding: 5px;
    font-family: Nunito;
`;
