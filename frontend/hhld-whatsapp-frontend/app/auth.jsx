'use client'
import axios from 'axios';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { useAuthStore } from './zustand/useAuthStore';

const Auth = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const {authName, setAuthName} = useAuthStore();
    const router = useRouter();

    const signUpFunc = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_AUTH_HOST}/auth/signup`, {
                username: userName,
                password: password
            }, {
                withCredentials: true
            })
            if(res.data.message === "Username already exists!") {
                alert('Username already exists');
            } else {
                setAuthName(userName);
                router.replace('/chat');
            }
        } catch (error) {
            console.log("Error in signup function : ", error.message);
        }
    }

    const logInFunc = async (event) => {
        event.preventDefault();
 
        try {
            const res = await axios.post('http://localhost:5000/auth/login', {
                username: userName,
                password: password
            }, {
                withCredentials: true
            })
            setAuthName(userName);
            router.replace('/chat');
        } catch (error) {
            console.log("Error in login function : ", error.message);
        }
    }
 

    return (
        <div>
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Login in to your account</h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" action="#" method="POST">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">Username</label>
                            <div className="mt-2">
                                <input value={userName} onChange={(e) => setUserName(e.target.value)} id="username" name="username" type="username" autoComplete="username" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                            </div>
                            <div className="mt-2">
                                <input value={password} onChange={(e) => setPassword(e.target.value)} id="password" name="password" type="password" autoComplete="current-password" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>

                        <div className="flex flex-row">
                            <button onClick={signUpFunc} type="submit" className="flex m-3 w-1/2 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign up</button>
                            <button onClick={logInFunc} type="submit" className="flex m-3 w-1/2 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Log in</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Auth
