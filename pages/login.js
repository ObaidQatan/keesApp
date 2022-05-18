import styled from "@emotion/styled";
import { Button, ThemeProvider } from "@mui/material";
import Head from "next/head";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { primaryTheme } from "../styles/styled-themes";

function Login() {

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider);
  }
  return (
    <Container >
      <Head>
        <title>KeesApp| Login</title>
      </Head>

      <LoginBody>
        <h1>KeesApp</h1>
        <ThemeProvider theme={primaryTheme}>
        <Button onClick={signInWithGoogle} variant="outlined">Sign in with Google</Button>
        </ThemeProvider>
      </LoginBody>

      <Footer>
        <p>Created by Noopejs| 2022</p>
      </Footer>
    </Container>
  )
}

export default Login

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: white;
  color: rgb(54, 215, 183);
`;

const LoginBody = styled.div`text-align: center;`;

const Footer = styled.footer`
  position: absolute;
  bottom: 0;
`;