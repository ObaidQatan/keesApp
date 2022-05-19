import styled from "@emotion/styled";
import { Avatar } from "@mui/material";
import { collection, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import { getUser, getChatEmail, utf8ToBase64 } from "../helperFunctions/helper";

function Chat({id, users}) {

  const [chatUserSnapshot] = useCollection(query(collection(db,'users'), where('email','==',getChatEmail(users))));
  const chatUser = chatUserSnapshot?.docs?.[0]?.data();
  const chatEmail = getChatEmail(users);

  const router = useRouter();
  const openChat = ()=>{
    router.push(`/chat/${id}?target=${utf8ToBase64(JSON.stringify(chatUser?chatUser:{email:chatEmail}))}`);
  }

  return (
    <Container onClick={openChat}>
      <ChatAvatar data={{chatUser,chatEmail}} />
        <UserName>
            {chatEmail}
        </UserName>
    </Container>
  )
}

export default Chat

const ChatAvatar = ({data})=>(
  data.chatUser ? (
    <UserAvatar src={data.chatUser.photo} />
    ):(
    <UserAvatar>
      {data.chatEmail.charAt(0).toUpperCase()}
    </UserAvatar>
)
)

const Container = styled.div`
display: flex;
width: inherit;
padding: 10px;
align-items: center;
cursor: pointer;
word-break: break-word;

&:hover{
    background-color: #00000020;
}
`;

const UserAvatar = styled(Avatar)`

`;

const UserName = styled.p`
padding-inline: 5px;
`;