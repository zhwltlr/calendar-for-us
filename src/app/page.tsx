import Link from "next/link";

const HomePage = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">일정 관리 시스템</h1>
      <Link
        href="/calendar"
        className="text-blue-500 hover:text-blue-700 underline"
      >
        캘린더 보기
      </Link>
    </div>
  );
};

export default HomePage;
