'use client'
import io from "socket.io-client";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../zustand/useAuthStore';
import { useUsersStore } from '../zustand/useUsersStore';
import { useChatMsgsStore } from "../zustand/useChatMsgsStore";
import { usechatReceiverStore } from "../zustand/useChatReceiver";

const Chat = () => {
    const [inputValue, setInputValue] = useState('');
    const [socket, setSocket] = useState(null);
    const { authName } = useAuthStore();
    const { users, setUsers } = useUsersStore();
    const { chatMsgs, updateChatMsgs } = useChatMsgsStore();
    const { chatReceiver, updateChatReceiver } = usechatReceiverStore();

    const getUserData = async () => {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_AUTH_HOST}/users`, {
            withCredentials: true
        });

        setUsers(res.data);
        console.log('User Data - ' + JSON.stringify(res.data));
    }

    useEffect(() => {
        // Establish WebSocket connection
        const newSocket = io(`${process.env.NEXT_PUBLIC_BE_HOST}`, {
            query: {
                username: authName
            }
        });

        setSocket(newSocket);

        // Listen for incoming msgs
        newSocket.on('chat msg', msg => {
            updateChatMsgs([...chatMsgs, msg]);
        });

        getUserData();

        // Clean up function
        return () => newSocket.close();
    }, []);

    useEffect(() => {
        console.log("Second Use Effect called!!!!");
        const getMsgs = async () => {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BE_HOST}/msgs`, 
                {
                    params: {
                        'sender': authName,
                        'receiver': chatReceiver
                    }
                }, {
                    withCredentials: true
                });
            if(res.data.length !== 0) {
                console.log("Messages received!!!!");
                updateChatMsgs(res.data);
            } else {
                updateChatMsgs([]);
            }
        }

        if(chatReceiver) {
            getMsgs();
        }
    }, [chatReceiver]);


    const sendMessage = (e) => {
        e.preventDefault();
        const msgToBeSent = {
            text: inputValue.trim(),
            sender: authName,
            receiver: chatReceiver,
        };

        if (inputValue.trim() !== '' && socket) {
            updateChatMsgs([...chatMsgs, msgToBeSent]);
            socket.emit('chat msg', msgToBeSent);
            setInputValue('');
        }
    };

    const setChatReceiver = (user) => {
        updateChatReceiver(user.username);
        console.log("Current receiver - " + user.username);
        // get chats of this user and authname
    }

    return (
        <div className='h-screen flex divide-x-4'>
            <div className='w-1/5'>
                {users.map((user, index) => (
                    <div key={index} onClick={() => setChatReceiver(user)} className='h-10 bg-blue-200 rounded-md p-2 m-2 justify-items-center content-center'>
                        {user.username}
                    </div>
                ))}
            </div>
            <div className='w-4/5 flex flex-col'>
                <div className='1/5'>
                    <h1>
                        {authName} is chatting with {chatReceiver}
                    </h1>
                </div>
                <div className='msgs-container h-3/5 overflow-scroll'>
                    {chatMsgs.map((message, index) => (
                        <div key={index} className={message.sender == authName ? "flex justify-end" : "flex"}>
                            <div className="flex w-1/2 m-4 gap-2.5">
                                <div className="flex flex-col w-full leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{authName}</span>
                                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">11:46</span>
                                    </div>
                                    <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{message.text}</p>
                                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Delivered</span>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
                <div className='h-1/5 flex items-center justify-center'>
                    <form onSubmit={sendMessage} className="w-1/2">
                        <label for="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your message</label>
                        <textarea onChange={(e) => setInputValue(e.target.value)} value={inputValue} id="message" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Leave a comment..."></textarea>
                        <button type="submit" className="text-white m-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Chat;