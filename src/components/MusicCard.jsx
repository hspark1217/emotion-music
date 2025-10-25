import React, { useEffect, useState } from 'react';
import { fetchAlbumImage } from '../utils/fetchAlbumImage';

function MusicCard({ title, artist }) {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetchAlbumImage(artist, title).then(setImageUrl);
  }, [artist, title]);

  return (
    <div className="music-card">
      <img src={imageUrl} alt={`${title} 앨범 이미지`} />
      <h3>{title}</h3>
      <p>{artist}</p>
      <button>듣기</button>
    </div>
  );
}

export default MusicCard;

