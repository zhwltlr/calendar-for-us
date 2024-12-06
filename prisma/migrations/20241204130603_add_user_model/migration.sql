/*
  Warnings:

  - Added the required column `userId` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- 이메일 유니크 인덱스를 생성합니다
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Schedule 테이블에 userId 컬럼을 NULL 허용으로 추가합니다
ALTER TABLE "Schedule" ADD COLUMN "userId" TEXT;

-- 외래 키 제약조건을 추가합니다
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;