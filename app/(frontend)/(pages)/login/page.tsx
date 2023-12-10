'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormSchema, loginFormSchema } from '../../schemas';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Login = () => {
    const router = useRouter();
    const { register, handleSubmit } = useForm<LoginFormSchema>({
        resolver: zodResolver(loginFormSchema),
    });

    const loginUser = async (data: LoginFormSchema) => {
        const res = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
        });

        console.log(res);

        if (res?.ok && !res.error) {
            router.push('/overview');
        }
    };

    return (
        <main
            className="flex w-full h-screen bg-no-repeat bg-center bg-cover"
        >
            <div className="mx-auto my-auto ">
                <h1>login</h1>
                <form onSubmit={handleSubmit(loginUser)} className="flex flex-col gap-y-1">
                    <input type="email" {...register('email', { required: true })} autoComplete="username"></input>
                    <input
                        type="password"
                        {...register('password', { required: true })}
                        autoComplete="current-password"
                    ></input>
                    <button type="submit" className="bg-lime-600">
                        Login
                    </button>
                </form>
            </div>
        </main>
    );
};

export default Login;