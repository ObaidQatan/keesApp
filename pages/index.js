import styled from '@emotion/styled'
import { HideSourceRounded } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Head from 'next/head'
import { useState } from 'react';
import Sidebar from '../components/Sidebar'

export default function Home() {

  
  const [isHidden, setIsHidden] = useState(false);

  addEventListener('resize',(e)=>{
    if(window.innerWidth <= 700) 
      setIsHidden(true);
    else
      setIsHidden(false)
  })

  const listenToWindowResize = ()=>{
    addEventListener('resize',(e)=>{
      if(window.innerWidth <= 700) 
        setIsHidden(true);
      else
        setIsHidden(false)
    })
  }
  
  const handleHideSideBar = ()=>{
    setIsHidden(!isHidden);
  }

  listenToWindowResize();
  
  return (
    <Container>
      <Head>
        <title>KeesApp</title>
        <meta name="description" content="Chatting app for fun" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar isHidden={isHidden}/>
      
      <Welcome>
        <h1>KeesApp</h1>

        <HideSideBarButton onClick={handleHideSideBar} >
          <HideSourceRounded/>
        </HideSideBarButton>

        <Footer>
          <p>Created by Noopejs| 2022</p>
        </Footer>

      </Welcome>

    </Container>
  )
}

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
`;

const Welcome = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgb(54, 215, 183);
  flex: 1;
  background-color: whitesmoke;
  position: relative;
`;

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


const Footer = styled.footer`
  position: absolute;
  bottom: 0;
  font-size: 12px;
  letter-spacing: 1.5px;
  word-spacing: 2px;
`;