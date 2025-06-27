import Image from "next/image";

export default function Home() {
  return (
    <>
      <h1 className="text-green-primary text-3xl font-bold underline">
        Hello, U-Insight!
      </h1>
      <p className="mt-4 text-lg">
        의성군 스마트 민원 시스템에 오신 것을 환영합니다.
      </p>
      <div className="mt-8">
        <Image
          src="/images/insight-logo.png"
          alt="U-Insight Logo"
          width={200}
          height={200}
        />
      </div>
    </>
  );
}