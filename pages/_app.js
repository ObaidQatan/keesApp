import { auth, db } from '../firebase'
import '../styles/globals.css'
import { useAuthState } from 'react-firebase-hooks/auth';
import Loading from './loading';
import Login from './login';
import { useEffect } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

function MyApp({ Component, pageProps }) {

  const [user,loading] = useAuthState(auth);

  useEffect(()=>{
    if(user){
      setDoc(doc(db, 'users', user.uid), {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        lastSeen: serverTimestamp()
      },{merge:true});
    }
  },[user]);

  if(loading) return <Loading /> ;

  if(!user) return <Login/> ;
  
  return <Component {...pageProps} />
}

export default MyApp
