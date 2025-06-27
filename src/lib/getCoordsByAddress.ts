export const getCoordsByAddress = async (address: string) => {
  const res = await fetch(
    `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
    {
      headers: {
        Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("주소 변환 실패");
  }

  const data = await res.json();
  const result = data.documents?.[0]?.address;

  if (!result) return null;

  return {
    lat: parseFloat(result.y),
    lng: parseFloat(result.x),
  };
};
