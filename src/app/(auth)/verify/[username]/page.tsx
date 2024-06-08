'use client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const VerifyAccount = () => {
    const [isVerifying, setIsveryfying] = useState(false);
    const router = useRouter();
    const params = useParams<{ username: string }>();
    const { toast } = useToast();

    // react-hook-form validator object using zodResolver
    const register = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: ''
        }
    })

    //onSubmit goes in register.handleSubmit
    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {

            const response = await axios.post('/api/verify-code', {
                code: data.code,
                username: params.username
            })
            if (response.data.success) {
                toast({
                    title: "Success",
                    description: response.data.message,
                    variant: 'default'
                })
                router.replace('/sign-in');
            } else {
                toast({
                    title: "Failed Verification",
                    description: response.data.message,
                    variant: 'destructive'
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            console.error("Error in sign-up of user ->", axiosError.response?.data.message)
            toast({
                title: "Signup Failed",
                description: axiosError.response?.data.message,
                variant: "destructive"
            })
        }
    }


    return (
        <>
            <div className="flex justify-center items-center min-h-screen bg-gray-800">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                    <div className="text-center">
                        <h1 className="text-3xl font-extrabold tracking-tight lg:text-3xl mb-6">
                            Account Verification
                        </h1>
                        <p className="mb-4  text-md">
                            (Check your email for verification code)
                        </p>
                    </div>
                    <Form {...register}>
                        <form onSubmit={register.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                name="code"
                                control={register.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Enter OTP</FormLabel>
                                        <FormControl>
                                            <Input
                                                className='border-solid border-stone-400 focus:border-none'
                                                {...field}

                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default VerifyAccount;

