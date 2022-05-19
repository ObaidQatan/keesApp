import styled from "@emotion/styled";
import { AddComment as ChatIcon, MoreVert, Search as SearchIcon } from "@mui/icons-material";
import { Avatar, Button, IconButton, ThemeProvider} from "@mui/material";
import { collection, getDocs, query, setDoc, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import { createInputDialog, createNewChat, emailExists, getUser, isValidEmail } from "../helperFunctions/helper";
import { primaryTheme } from "../styles/styled-themes";
import { css } from '@emotion/react';
import Chat from "./Chat";

function Sidebar() {

  const user = getUser();
  const [loadingChatsMsg, setLoadingChatsMsg] = useState("loading chats...");
  // const [userChats, setUserChats] = useState([]);
  const [chatsSnapshot, loading] = useCollection(query(collection(db,'chats'), where('users','array-contains',user.email)));

  // const fetchUserChats = async ()=>{
  //   console.log('start function')
  //   const q = query(collection(db,'chats'), where('users','array-contains',user.email));
  //   const snapshot = await getDocs(q);
  //   // setChatsSnapshot(snapshot);
  //   snapshot.forEach(doc=>{
  //     userChatsArray.push(doc.data());
  //   })
  // }

  // fetchUserChats();
  
  // useEffect(()=>{
  //   if(chatsSnapshot?.docs){
  //     setUserChats(chatsSnapshot.docs.map(doc=>doc.data()));
  //   }
  // },[chatsSnapshot]);

  // useEffect(()=>{
  //   if(userChats.length === 0)
  //     setLoadingChatsMsg("No Chats Found!");
  //   else
  //     setLoadingChatsMsg(null);
  // },[userChats]);
  

  
  const startNewChat = ()=>{
    //TODO: create input dialog
   const providedEmail = createInputDialog("Enter the email you would like to start a chat with");
   
   //TODO: validate email
    if(isValidEmail(providedEmail, user.email) && !emailExists(providedEmail, chatsSnapshot?.docs.map(snap=>snap.data()))){
      //TODO: create new chat into chats collection of the current user
      createNewChat(providedEmail, user.email, collection(db, 'chats')).then(()=>{
        // setUserChats(userChats.concat({
        //   users:[user.email, providedEmail]
        // }));
      })
    }else{
      alert('not valid!');
    }
    //TODO: if email is valid && email does not exist within current user chats collection && email is not a chat with itself (currentUser)

  }
  return (
      <Container>

          <Header>

            <UserAvatar src={user.photoURL} onClick={()=>auth.signOut()} />

            <IconsContainer>
              <IconButton  onClick={()=>startNewChat()}>
                <ChatIcon />
              </IconButton>

              <IconButton>
                <MoreVert />
              </IconButton>
            </IconsContainer>

          </Header>

          <Search>
            <SearchIcon />
            <SearchInput placeholder="Search in chats" />
          </Search>

          <p style={{ textAlign:'center'}}>{loading?"Loading Chats...":chatsSnapshot.size===0?"No Chats Found":""}</p>

          {/* {userChats.map(chat=>(
            <p>{chat.users.filter(email=>email!==user.email)[0]}</p>
          ))} */}
          <ChatsList className="scrollbar">
            {chatsSnapshot?.docs.map(chatSnap=>(
              <Chat key={chatSnap.id} id={chatSnap.id} users={chatSnap.data().users} />
            ))}
          </ChatsList>

      </Container>
  )
}

export default Sidebar;

const Container = styled.div`
  flex: 0.45;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  box-shadow: #00000026 5px 0px 10px;
  border-radius: 0 20px 20px 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
`;


const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: white;
  display: flex;
  justify-content: space-between;
  padding: 15px;
  border-bottom: solid 1px whitesmoke;
`;

const UserAvatar = styled(Avatar)`
  width: 50px;
  height: 50px; 
  &:hover{
    cursor: pointer;
    opacity: 0.8;
  }
`;

const IconsContainer = styled.div`
`;

const Search = styled.div`
  display: flex;
  padding: 5px;
  border-radius: 2px;
`;

const SearchInput = styled.input`
  outline: none;
  border: none;
  border-radius: 10px;
  color: grey;
  flex: 1;
  font-family: inherit;
`;

const ChatsList = styled.div`
  overflow-y: overlay;
  width: inherit;
  flex: 1;
  margin-bottom: 10px;
`;