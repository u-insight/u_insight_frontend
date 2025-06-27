"use client";
import { useState } from "react";
import { getCoordsByAddress } from "@/lib/getCoordsByAddress";

const AddressSearch = ({ onAddMarker }: { onAddMarker: (lat: number, lng: number) => void }) => {
  const [address, setAddress] = useState("");

  const handleSearch = async () => {
    const coords = await getCoordsByAddress(address);
    if (coords) {
      console.log("위도:", coords.lat, "경도:", coords.lng);
      onAddMarker(coords.lat, coords.lng);
    } else {
      alert("위치 정보를 찾을 수 없습니다.");
    }
  };

  return (
    <div className="flex gap-2 mb-4">
      <input
        type="text"
        placeholder="주소 입력"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="border p-2 w-full"
      />
      <button onClick={handleSearch} className="bg-blue-500 text-white px-4 rounded">
        검색
      </button>
    </div>
  );
};

export default AddressSearch;
