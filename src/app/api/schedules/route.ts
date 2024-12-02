import prisma from "@/shared/db/clinet";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const schedule = await prisma.schedule.create({
      data: {
        title: body.title,
        description: body.description,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
      },
    });
    return NextResponse.json(schedule);
  } catch (error) {
    console.error("Failed to create schedule:", error);
    return NextResponse.json(
      { error: "Failed to create schedule" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const schedules = await prisma.schedule.findMany();
    return NextResponse.json(schedules);
  } catch (error) {
    console.error("Failed to fetch schedules:", error);
    return NextResponse.json(
      { error: "Failed to fetch schedules" },
      { status: 500 }
    );
  }
}
