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

const Chat = (props : any) => {
    const [message, setMessage] = useState<string>('');
    const [messageList, setMessageList] = useState();
    const [chatList, setChatList] = useState()
    const [chatEnabled, setChatEnabed] = useState<boolean>(false)

    useEffect(() => {
        const loadChats = async () => {
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
                return;
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
        }
        loadChats();

    }, [props.auth.User.id]);

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

    const onChatClick = async (object: any) => {
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
            return;
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

        setMessageList(list)
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
const mapStateToProps = (state : any) => {
    return {
        auth : state.auth
    };
}

export default withRouter(connect(mapStateToProps)(Chat));