import axios from "axios";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const month = searchParams.get('solMonth');
  const year = searchParams.get('solYear');
  const numOfRows = searchParams.get('numOfRows');

  const serviceKey = process.env.NEXT_PUBLIC_HOLIDAY_API_KEY
    ? decodeURIComponent(process.env.NEXT_PUBLIC_HOLIDAY_API_KEY)
    : "";

  if (!serviceKey) {
    return new Response(JSON.stringify({ error: "API key is not defined" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const response = await axios.get(
      `http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo`,
      {
        params: {
          solMonth: month,
          ServiceKey: serviceKey,
          solYear: year,
          numOfRows,
        },
      }
    );

    return new Response(JSON.stringify(response.data), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch holiday data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}