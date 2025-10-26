import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { fetchAlbumImage } from './utils/fetchAlbumImage'; // 🔹 이미지 가져오기 함수 추가

function App() {
  const [input, setInput] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState('');

  const getRecommendations = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/recommend`,
        { emotion: input }
      );

      const rawTracks = response.data.tracks;

      // 🔹 각 곡에 대해 앨범 이미지 가져오기
      const enrichedTracks = await Promise.all(
        rawTracks.map(async (track) => {
          const imageUrl = await fetchAlbumImage(track.artist.name, track.name);
          return { ...track, albumImage: imageUrl };
        })
      );

      setRecommendations(enrichedTracks);
      setError('');
    } catch (err) {
      console.error('추천 요청 실패:', err);
      setError('추천을 가져오는 데 실패했습니다.');
    }
  };

  return (
    <div className="App">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="감정을 입력하세요 (예: 운동, 우울, 비)"
      />
      <button onClick={getRecommendations}>추천 받기</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="recommendation-list">
        {recommendations.map((track, index) => (
          <div key={index} className="track-card">
            <img src={track.albumImage} alt="앨범 이미지" />
            <h3>{track.name}</h3>
            <p>{track.artist.name}</p>
            <a href={track.url} target="_blank" rel="noopener noreferrer">
              듣기
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

