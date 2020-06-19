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
import * as signalR from "@microsoft/signalr";
import {LogLevel} from "@microsoft/signalr";
import {clearChat, setChat} from "../actions/ChatActions";;

const Chat = (props : any) => {
    const [message, setMessage] = useState<string>('');
    const [messageList, setMessageList] = useState();
    const [chatList, setChatList] = useState()
    const [chatEnabled, setChatEnabed] = useState<boolean>(false)
    const [error, setError] = React.useState<JSX.Element>(<></>);
    const [chatId, setChatId] = React.useState<string>('');

    const loadChats = async () => {
        try {
            const options: RequestInit = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + props.auth.User.token
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
                    alt: chatUser.email,
                    title: chatUser.email,
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

    let inputRef = React.createRef();

    useEffect(() => {
        loadChats();

        // eslint-disable-next-line
    }, [props.auth.User.id]);

    useEffect(() => {
        const setupSignalR = async () => {
            props.clearChat();
            const connection = new signalR.HubConnectionBuilder()
                .withUrl(config.SERVICES.CHAT_SERVICE, {
                    accessTokenFactory: () => props.auth.User.token,
                })
                .configureLogging(LogLevel.Information)
                .withAutomaticReconnect()
                .build();
            try {
                await connection.start();
                connection.on("ReceiveMessage", async (input : any) => {
                    await loadChats();

                    if (input.chatId === props.chat.ChatId){
                        let newMessage = {
                            position: 'left',
                            type: 'text',
                            text: input.message.text,
                            date: input.message.timeStamp
                        }
                        setMessageList((messageList: any) => [...messageList, newMessage]);
                    }
                })
            }catch (e) {
                await addError(e);
            }
        }

        setupSignalR();
        // eslint-disable-next-line
    }, [props.auth.User.token])

    const addError = async (er: any) => {
        setError(<Alert variant={"warning"} onClick={
            () => {
                setError(<div/>);
            }}>{er.message}</Alert>);
    };

    const onMessageChange = (event: any) => {
        setMessage(event.target.value);
    }

    const onEnterPress = async (event: any) => {
        if (event.key === 'Enter') {
            await onMessageSend();
        }
    }

    const onMessageSend = async () => {
        if (message.length === 0) {
            return;
        }
        let newMessage = {
            position: 'right',
            type: 'text',
            text: message,
            date: new Date()
        }

        let sendMessage = {
            SenderId : props.auth.User.id,
            Text : message
        }

        let options: RequestInit = {
            method: "POST",
            body: JSON.stringify(sendMessage),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + props.auth.User.token
            },
            mode: "cors",
            cache: "default"
        };

        try {
            let response: Response = await fetch(config.SERVICES.COMMUNICATION_SERVICE +"/SendMessage/" + chatId, options);
            if (response.status === 200) {
                setMessageList((messageList: any) => [...messageList, newMessage]);
            } else {
                throw new Error("Could not send message.")
            }
            // @ts-ignore
            inputRef.clear();
        }catch (e) {
            await addError(e);
        }
    }

    const getMessages = async (id: string) => {
        try {
            const options: RequestInit = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + props.auth.User.token
                },
                mode: 'cors',
                cache: 'default'
            }
            let result = await fetch(config.SERVICES.COMMUNICATION_SERVICE + '/messages/' + id, options);
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
            await ReadChat(id, props.auth.User.id);
            setMessageList(list)
            setChatEnabed(true);
        } catch (e) {
            await addError(e);
        }
    }

    const onChatClick = async (object: any) => {
        setChatId(object.id);
        props.setChat(object.id);
        await getMessages(object.id);
    }

    const ReadChat = async (id: string, userId: string) => {
        const options: RequestInit = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + props.auth.User.token
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
                onKeyPress={onEnterPress}
                autofocus={true}
                ref={(el: any)  => {
                    if (el !== null){
                        inputRef = el;
                    }
                }}
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
        auth : state.auth,
        chat : state.chat,
    };
};

const mapDispatchToProps = (dispatch : any) => {
    return {
        setChat: (id : string) => {
            dispatch(setChat(id));
        },
        clearChat: () => {
            dispatch(clearChat());
        }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Chat));