'use client'
import { useState, useEffect } from 'react';
import io from "socket.io-client";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Establish WebSocket connection
        const newSocket = io('http://localhost:8080', {
            query: {
                username: "kaustubh"
            }
        });
        setSocket(newSocket);

        // Listen for incoming msgs
        newSocket.on('chat msg', msg => {
            console.log('received msg on client ' + msg, messages);
            setMessages(prevMsgs => [...prevMsgs, { user: 'Other', sender: msg.sender, receiver: msg.receiver, text: msg.textMsg }]);
        });

        // Clean up function
        return () => newSocket.close();
    }, []);


    const sendMessage = (e) => {
        e.preventDefault();
        const msgToBeSent = {
            textMsg: inputValue.trim(),
            sender: "kaustubh",
            receiver: "anshu",
            user: "You"
        };

        if (inputValue.trim() !== '' && socket) {
            setMessages(prevMsgs => [...prevMsgs, msgToBeSent]);
            // console.log('set messages - ', JSON.stringify(messages));
            socket.emit('chat msg', msgToBeSent);
            setInputValue('');
        }
    };

    return (
        <div>
            {messages.map((message, index) => (
                <div key={index} className={message.user == 'You' ? "flex justify-end" : "flex"}>
                    <div className="flex w-1/2 m-4 gap-2.5">
                        <div className="flex flex-col w-full leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">Bonnie Green</span>
                                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">11:46</span>
                            </div>
                            <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{message.text}</p>
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Delivered</span>
                        </div>
                    </div>

                </div>
            ))}
            <form onSubmit={sendMessage} className="mx-auto">
                <label for="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your message</label>
                <textarea onChange={(e) => setInputValue(e.target.value)} value={inputValue} id="message" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Leave a comment..."></textarea>
                <button type="submit" className="text-white m-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Send</button>
            </form>
        </div>
    );
}

export default Chat;