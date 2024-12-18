import prisma from "@/shared/db/clinet";
import { authOptions } from "@/utils/auth/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
      const session = await getServerSession(authOptions);
      if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const body = await req.json();
      const { type, dates, scheduleType, currentMonth } = body;
  
      const baseDate = new Date(currentMonth);
      const year = baseDate.getFullYear();
      const month = baseDate.getMonth();
  
      const schedules = dates.map((date: number) => {
        const scheduleDate = new Date(year, month, date);
        scheduleDate.setHours(0, 0, 0, 0);
      
        return {
          title: type,
          startDate: scheduleDate,
          endDate: new Date(scheduleDate),
          description: scheduleType,
          userId: session.user.id,
        };
      });
  
      // 스케줄 생성하고 직접 결과 반환
      await prisma.schedule.createMany({
        data: schedules,
      });
  
      // 생성된 스케줄들을 조회하여 반환
      const newSchedules = await prisma.schedule.findMany({
        where: {
          userId: session.user.id,
          createdAt: {
            gte: new Date(new Date().setSeconds(new Date().getSeconds() - 1))
          }
        }
      });
  
      return NextResponse.json(newSchedules);
    } catch (error) {
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }