import { validate } from 'email-validator';
import { addDoc, collection, doc, getDoc, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';



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

export const getMsgTime = timestamp =>{
    let hours = new Date(timestamp).getHours();
    let minutes = new Date(timestamp).getMinutes();

    let ampm = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12; // can be 0
    hours = hours ? hours : 12;
    hours = hours < 10 ? '0'+hours : hours;

    minutes = minutes < 10 ? '0'+minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
}

export const updateLastSeen = (user)=>{
    updateDoc(doc(db,`users/${user.uid}`),{
        lastSeen: serverTimestamp()
    });
    setTimeout(() => {
        updateLastSeen(user);
    }, 30*1000);
}

export const getRecipientAvailablity = (recipient, setAvailablity, timeout)=>{
    let unsubscribe = onSnapshot(query(collection(db,`users`),where('email','==',recipient.email)),
    (snapshot)=>{
        unsubscribe();
        if(snapshot.empty){
            //Note: recipient does not exist
            setAvailablity('Unknown');
            setTimeout(() => {
               return getRecipientAvailablity(recipient, setAvailablity, timeout); 
            }, timeout);
        }else{
            //Note: recipient exists
            let milliSeconds = snapshot?.docs?.[0]?.data()?.lastSeen?.toDate()?.getTime();
            if(milliSeconds){
                let currentMilliSeconds = new Date().getTime();
                setAvailablity((currentMilliSeconds-milliSeconds) <= timeout ? 'Available':`Last seen ${snapshot?.docs?.[0]?.data()?.lastSeen?.toDate()?.toLocaleString()}`);
                setTimeout(() => {
                   return getRecipientAvailablity(recipient, setAvailablity, timeout); 
                }, timeout);
            }
        }
    });
}