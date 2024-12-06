import { signIn } from 'next-auth/react';
import { LoginData } from './type';

export const loginUser = async (data: LoginData) => {
  const result = await signIn('credentials', {
    redirect: false,
    email: data.email,
    password: data.password,
  });

  if (result?.error) {
    throw new Error(result.error);
  }

  return result;
};