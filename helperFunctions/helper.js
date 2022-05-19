import { validate } from 'email-validator';
import { addDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';



export const getUser = ()=>useAuthState(auth)[0];

export const isUserLoading = ()=>{
    const loading = useAuthState(auth)[1];
    return loading;
}

export const createInputDialog = (msg)=>{
    return prompt(msg);
}

export const isValidEmail = (providedEmail, currentEmail)=>{
    return providedEmail !== currentEmail && validate(providedEmail);
}

export const emailExists = (providedEmail, userChats)=>{
    return !!userChats.find(chat=>(chat.users.find(user=>user===providedEmail)));
}

export const createNewChat = (providedEmail, currentEmail, chatsRef)=>{
    //TODO: add new chat for the provided email to 'chats' collection
    return addDoc(chatsRef,{
        users: [currentEmail, providedEmail]
    });
}


export const getChatEmail = (users)=>(users.filter(email=>email!==getUser().email)[0]);


export const utf8ToBase64 = (string)=>{
    return Buffer.from(string,'utf-8').toString('base64');
}


export const base64ToUtf8 = (string)=>{
    return Buffer.from(string,'base64').toString('utf-8');
}