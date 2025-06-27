"use client";
import KakaoMap, { Issue } from "@/components/KakaoMap";
import { getCoordsByAddress } from "@/lib/getCoordsByAddress";
import { useState } from "react";

export default function Home() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [input, setInput] = useState({
    address: "",
    title: "",
    description: "",
    severity: "low",
  });
  const [center, setCenter] = useState<{ lat: number; lng: number } | undefined>(undefined);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddIssue = async () => {
    const coords = await getCoordsByAddress(input.address);
    if (!coords) return alert("주소를 찾을 수 없습니다");

    const newIssue: Issue = {
      id: issues.length + 1,
      lat: coords.lat,
      lng: coords.lng,
      title: input.title,
      description: input.description,
      severity: input.severity as "low" | "medium" | "high",
    };

    setIssues((prev) => [...prev, newIssue]);
    setCenter({ lat: coords.lat, lng: coords.lng }); // 새 이슈 위치로 지도 이동

    setInput({ address: "", title: "", description: "", severity: "low" });
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">민원 이슈 지도</h1>

      <div className="flex flex-col gap-2 mb-6">
        <input name="address" value={input.address} onChange={handleChange} placeholder="주소"  />
        <input name="title" value={input.title} onChange={handleChange} placeholder="제목"  />
        <input name="description" value={input.description} onChange={handleChange} placeholder="설명"  />
        <select name="severity" value={input.severity} onChange={handleChange} >
          <option value="low">낮음</option>
          <option value="medium">중간</option>
          <option value="high">높음</option>
        </select>
        <button onClick={handleAddIssue} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          이슈 추가
        </button>
      </div>

      <KakaoMap issues={issues} center={center} />
    </main>
  );
}
