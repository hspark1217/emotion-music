const defaultImage = 'https://via.placeholder.com/200x200?text=No+Image';

export async function fetchAlbumImage(artist, track) {
  const apiKey = process.env.REACT_APP_LASTFM_API_KEY;
  console.log('🔍 요청 중:', artist, track); // 요청 정보 확인

  const response = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${apiKey}&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}&format=json`
  );
  const data = await response.json();
  console.log('📦 응답 데이터:', data); // 응답 내용 확인

  if (data.error) {
    console.warn('⚠️ API 오류:', data.message);
    return defaultImage;
  }
  const images = data?.track?.album?.image;
  const mediumImage = images?.find((img) => img.size === 'medium')?.['#text'];
  return mediumImage || defaultImage;
}

