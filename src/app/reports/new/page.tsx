"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useIssuesStore } from "@/store/useIssuesStore";
import { getCoordsByAddress } from "@/lib/getCoordsByAddress";

export default function InputPage() {
  const router = useRouter();
  const addIssue = useIssuesStore((state) => state.addIssue);

  const [form, setForm] = useState({
    address: "",
    title: "",
    description: "",
    severity: "low" as "low" | "medium" | "high",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async () => {
    const { address, title, description, severity } = form;
    if (!address || !title || !description) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const coords = await getCoordsByAddress(address);
    if (!coords) {
      alert("주소를 찾을 수 없습니다.");
      return;
    }

    addIssue({
      id: Date.now(),
      title,
      description,
      lat: coords.lat,
      lng: coords.lng,
      severity,
    });

    alert("이슈가 등록되었습니다!");

    setForm({
      address: "",
      title: "",
      description: "",
      severity: "low",
    });
  };

  const handleShowMap = () => {
    router.push("/reports");
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-center">이슈 등록</h1>

      <input
        name="address"
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
        placeholder="주소를 입력하세요"
        value={form.address}
        onChange={handleChange}
      />

      <input
        name="title"
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
        placeholder="제목"
        value={form.title}
        onChange={handleChange}
      />

      <textarea
        name="description"
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
        placeholder="설명"
        value={form.description}
        onChange={handleChange}
        rows={3}
      />

      <select
        name="severity"
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
        value={form.severity}
        onChange={handleChange}
      >
        <option value="low">낮음</option>
        <option value="medium">보통</option>
        <option value="high">높음</option>
      </select>

      <div className="flex space-x-2">
        <button
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
          onClick={handleAdd}
        >
          이슈 추가
        </button>
        <button
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
          onClick={handleShowMap}
        >
          지도 보기
        </button>
      </div>
    </div>
  );
}
