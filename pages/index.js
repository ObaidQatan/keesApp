import styled from '@emotion/styled'
import Head from 'next/head'
import Sidebar from '../components/Sidebar'

export default function Home() {
  return (
    <Container>
      <Head>
        <title>KeesApp</title>
        <meta name="description" content="Chatting app for fun" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />
      
      <Welcome>
        <h1>KeesApp</h1>

        <Footer>
          <p>Created by Noopejs| 2022</p>
        </Footer>

      </Welcome>

    </Container>
  )
}

const Container = styled.div`
  display: flex;
`;

const Welcome = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgb(54, 215, 183);
  flex: 1;
  background-color: whitesmoke;
`;

const Footer = styled.footer`
  position: absolute;
  bottom: 0;
  font-size: 12px;
  letter-spacing: 1.5px;
  word-spacing: 2px;
`;