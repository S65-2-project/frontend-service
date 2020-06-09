import React, {useEffect, useState} from 'react';
import 'react-chat-elements/dist/main.css';
import './Chat.css';
// @ts-ignore
import { MessageList, Input, Button, ChatList } from 'react-chat-elements';

const Chat = () => {
    const [message, setMessage] = useState<string>('');
    const [messageList, setMessageList] = useState();
    const [chatList, setChatList] = useState()
    const [chatEnabled, setChatEnabed] = useState<boolean>(false)

    useEffect(() => {
        const loadChats = () => {
            //TODO: get chats from network
            console.log('aaaaaaaa')
            setChatList([{
                id: 'randomid',
                alt: 'floris',
                title: 'floris1996@hotmail.com',
                subtitle: 'Nah dude u gay',
                date: new Date(),
                unread: 0,
            }],)
        }
        loadChats();
    }, []);

    let inputRef = React.createRef();

    const onMessageChange = (event: any) => {
        setMessage(event.target.value);
    }

    const onEnterPress = (event: any) => {
        if (event.key === 'Enter'){
            onMessageSend();
        }
    }

    const onMessageSend = () => {
        //TODO: send message to network
        if (message.length === 0) {
            return;
        }
        let newMessage = {
            position: 'right',
            type: 'text',
            text: message,
            date: new Date()
        }
        setMessageList((messageList: any) => [...messageList, newMessage]);
        setMessage('');
        // @ts-ignore
        inputRef.clear();
    }

    const onChatClick = (object : any) => {
        //TODO: get chat message from network
        setMessageList([
            {
                position: 'right',
                type: 'text',
                text: 'U mom gay',
                date: new Date(),
            },
            {
                position: 'left',
                type: 'text',
                text: 'Nah dude u gay',
                date: new Date(),
            },
        ])
        setChatEnabed(true);
    }

    return <div className={"chat-container"}>
        <ChatList
            className='chat-list'
            dataSource={chatList}
            onClick={onChatClick}/>
        <div className={'message-container'}>
            <MessageList
                className='message-list'
                lockable={true}
                toBottomHeight={'100%'}
                dataSource={messageList}
                downButton={true}/>
            <Input
                placeholder="Type here..."
                defaultValue={message}
                onChange={onMessageChange}
                multiline={false}
                ref={(el: any) => (inputRef = el)}
                onKeyPress={onEnterPress}
                autofocus={true}
                rightButtons={
                    <Button
                        color='white'
                        backgroundColor='#007bff'
                        text='Send'
                        disabled={!chatEnabled}
                        onClick={onMessageSend}
                    />
                }/>
        </div>
    </div>
};

export default Chat