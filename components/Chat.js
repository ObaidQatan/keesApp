import styled from "@emotion/styled";
import { Avatar } from "@mui/material";
import { collection, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import { getUser, getChatEmail } from "../helperFunctions/helper";

function Chat({id, users}) {

  const [chatUserSnapshot] = useCollection(query(collection(db,'users'), where('email','==',getChatEmail(users))));
  const chatUser = chatUserSnapshot?.docs?.[0]?.data();
  const chatEmail = getChatEmail(users);

  return (
    <Container>
      { chatUser ? (
        <UserAvatar src={chatUser.photo}></UserAvatar>
        ):(
        <UserAvatar>
          {chatEmail[0].toUpperCase()}
        </UserAvatar>
    )}
        <UserName>
            {chatEmail}
        </UserName>
    </Container>
  )
}

export default Chat

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