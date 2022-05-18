import styled from "@emotion/styled";
import { Circle } from 'better-react-spinkit'
import Head from "next/head";

function Loading() {
  return (
    <Container>
      <Head>
        <title>Loading</title>
      </Head>
      <Circle size={40} color="rgb(54, 215, 183)" />
    </Container>
  )
}

export default Loading

const Container = styled.div`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;