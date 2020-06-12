import React, {useEffect, useState} from 'react';
import 'react-chat-elements/dist/main.css';
import './Chat.css';
// @ts-ignore
import { MessageList, Input, Button, ChatList } from 'react-chat-elements';
import config from '../config.json';
import {withRouter} from "react-router";
import {connect} from "react-redux";
import ChatModel from "./types/Chat";
import Message from "./types/Message";
import {Alert} from "react-bootstrap";

const Chat = (props : any) => {
    const [message, setMessage] = useState<string>('');
    const [messageList, setMessageList] = useState();
    const [chatList, setChatList] = useState()
    const [chatEnabled, setChatEnabed] = useState<boolean>(false)
    const [error, setError] = React.useState<JSX.Element>(<></>);

    let inputRef = React.createRef();

    const loadChats = async () => {
        try {
            const options: RequestInit = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                cache: 'default'
            }
            let result =  await fetch(config.SERVICES.COMMUNICATION_SERVICE + '/' + props.auth.User.id, options);
            if (result.status !== 200) {
                throw new Error("No chats found.")
            }

            let json : ChatModel[] = await result.json();
            let list : any[] = []

            for (let i =0; i < json.length; i++){
                let model = json[i];
                let chatUser = props.auth.User.id === model.buyer.id ? model.seller : model.buyer;

                let chatView = {
                    id: model.id,
                    alt: chatUser.name,
                    title: chatUser.name,
                    subtitle: 'No messages yet',
                    date: new Date('1900-01-01'),
                    unread: model.unread
                }
                if (model.message !== null){
                    chatView.subtitle = model.message.text;
                    chatView.date = new Date(model.message.timeStamp)
                }
                list.push(chatView)
            }
            list.sort(function (a,b) {
                if (a.date < b.date){
                    return 1;
                } else return -1;
            })

            setChatList(list)
        } catch (e) {
            await addError(e);
        }

    }

    useEffect(() => {
        loadChats();

        // eslint-disable-next-line
    }, [props.auth.User.id]);

    //error warning
    const addError = async (er: any) => {
        setError(<Alert variant={"warning"} onClick={
            () => {
                setError(<div/>);
            }}>{er.message}</Alert>);
    };

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

    const onChatClick = async (object: any) => {
        try {
            const options: RequestInit = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                cache: 'default'
            }
            let result = await fetch(config.SERVICES.COMMUNICATION_SERVICE + '/messages/' + object.id, options);
            if (result.status !== 200) {
                throw new Error("Chat could not be loaded")
            }

            let json : Message[] = await result.json();
            let list : any[] = []

            for (let i =0; i < json.length; i++){
                let model = json[i];
                let messagePosition = props.auth.User.id === model.senderId ? 'right' : 'left';

                let chatView = {
                    id: model.id,
                    position: messagePosition,
                    text: model.text,
                    date: new Date(model.timeStamp)
                }
                list.push(chatView)
            }
            await ReadChat(object.id, props.auth.User.id);

            setMessageList(list)
            setChatEnabed(true);
        } catch (e) {
            await addError(e);
        }
    }

    const ReadChat = async (id: string, userId: string) => {
        const options: RequestInit = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            cache: 'default'
        }
        let result = await fetch(config.SERVICES.COMMUNICATION_SERVICE + '/' + id + '/' + userId, options);
        if (result.status !== 200) {
            throw new Error("Could not read chat")
        }
        await loadChats();
    }

    return <div className={"chat-container"}>
        {error}
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
const mapStateToProps = (state : any) => {
    return {
        auth : state.auth
    };
}

export default withRouter(connect(mapStateToProps)(Chat));