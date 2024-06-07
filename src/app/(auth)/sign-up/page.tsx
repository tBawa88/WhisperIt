"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceCallback } from 'usehooks-ts';
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios from 'axios';
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { useRouter } from 'next/navigation' // not 'next/router'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Loader2 } from "lucide-react"




const page = () => {
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const debounced = useDebounceCallback(setUsername, 700);
    const { toast } = useToast();
    const router = useRouter();

    // react-hook-form validator object using zodResolver
    const register = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    })

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username.length) {
                setIsCheckingUsername(true);
                setUsernameMessage('');
                try {
                    const response = await axios.get(`/api/check-username-unique?username=${username}`);
                    setUsernameMessage(response.data.message);
                } catch (error) {
                    setUsernameMessage("Error checking username")

                } finally {
                    setIsCheckingUsername(false);
                }
            }
        }
        checkUsernameUnique();
    }, [username])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {

        console.log('FORM SUBMITTED')
        setIsSubmitting(true);
        try {
            //send post request to sign-up api
            const response = await axios.post<ApiResponse>('/api/sign-up', data);
            console.log("Response returned from the API -> ", response.data);
            if (response.data.success) {
                toast({
                    title: 'Success',
                    description: response.data.message
                });
                router.replace(`/verify/${username}`)
            } else {
                toast({
                    title: 'Error',
                    description: response.data.message,
                    variant: "destructive"
                });
            }

            // 
        } catch (error) {
            console.error("Error in sign-up of user ->", error)
            toast({
                title: "Signup Failed",
                description: "User signup failed, please try again",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join WhisperIt
                    </h1>
                    <p className="mb-4">
                        <span className="font-bold">Sign up</span> to start your anonymous adventure!
                    </p>
                </div>
                <Form {...register}>
                    <form
                        onSubmit={register.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            name="username"
                            control={register.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="john doe"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                debounced(e.target.value);
                                            }}
                                        />
                                    </FormControl>
                                    {isCheckingUsername && <Loader2 className="animate-spin" />}
                                    <p className={`text-sm ${usernameMessage === "Username is unique, okay to proceed" ? 'text-green-500' : 'text-red-500'}`}>
                                        {username.length ? usernameMessage : null}

                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="email"
                            control={register.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="john@abc.com"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="password"
                            control={register.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting}>
                            {//conditional text of button 
                                isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin " />
                                        Please wait
                                    </>
                                ) : ('Signup')
                            }
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4 ">
                    <p>
                        Already a member ?
                        <Link href='/sign-in' className="text-blue-600 hover:text-blue-900">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
export default page;