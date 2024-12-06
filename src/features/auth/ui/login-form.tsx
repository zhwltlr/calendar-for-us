'use client'

import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface LoginFormData {
  id: string;
  password: string;
}

export const LoginForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    id: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        id: formData.id,
        password: formData.password,
      });

      if (result?.error) {
        setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
      } else {
        router.push('/calendar');
      }
    } catch (error) {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md px-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">로그인</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="id" className="text-sm font-medium">
              아이디
            </label>
            <Input
              id="id"
              type="text"
              placeholder="아이디를 입력하세요"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              비밀번호
            </label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}