import styled from "@emotion/styled";
import { getMsgTime, getUser } from "../helperFunctions/helper";

function Message({id, senderEmail, content, date}) {
  const user = getUser();

  if(senderEmail===user.email)
  return (
    <SenderMessage content={content} senderEmail={senderEmail} date={date} />
  )
  else
  return (
    <RecipientMessage content={content} senderEmail={senderEmail} date={date} />
  )
}

export default Message

const SenderMessage = ({senderEmail, content, date})=>(
  <SenderMessageBody>
    <SenderName>
      {senderEmail}
    </SenderName>

    <MessageContent>
    {content}
    </MessageContent>

    <Time>
      {getMsgTime(date)}
    </Time>

  </SenderMessageBody>
)

const RecipientMessage = ({senderEmail, content, date})=>(
  <RecipientMessageBody>
    <RecipientName>
      {senderEmail}
    </RecipientName>

    <MessageContent>
    {content}
    </MessageContent>
    
    <Time>
      {getMsgTime(date)}
    </Time>
  
  </RecipientMessageBody>
)


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px;
  word-break: break-word;
  margin: 10px;
  user-select: text;
  max-width: 300px;
`;

const SenderMessageBody = styled(Container)`
  background-color: #95a7b7;
  color: white;
  border-radius: 10px 10px 0 10px;
  margin-left: auto;
`;

const RecipientMessageBody = styled(Container)`
  background-color: #68bcf7;
  color: white;
  border-radius: 0 10px 10px 10px;
  margin-right: auto;
`;

const UserName = styled.h3`
  font-size: 10px;
  border-bottom: 1px solid #00000020;
  width: 100%;
  opacity: 0.5;
  letter-spacing: 0.5px;
  word-spacing: 0.5px;
  margin: 0;
`;

const SenderName = styled(UserName)`
  text-align: right;
`;

const RecipientName = styled(UserName)`
  text-align: left;
`;

const Time = styled.h4`
  font-size: 10px;
  padding: 5px;
  opacity: 0.5;
  border-radius: 5px;
  margin: 0;
  
  :hover{
    background-color: #00000020;
    cursor: pointer;
  }
`;

const MessageContent = styled.p`
  padding: 5px;
  padding-left: 0;
  margin: 0;
`;