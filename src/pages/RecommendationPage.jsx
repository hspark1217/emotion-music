import React from 'react';
import MusicCard from '../components/MusicCard';

const recommendedSongs = [
  { title: 'Playground Love', artist: 'Air' },
  { title: 'Something About Us', artist: 'Daft Punk' },
  { title: 'Glory Box', artist: 'Portishead' },
  { title: 'Highschool Lover', artist: 'Air' },
  { title: 'Veridis Quo', artist: 'Daft Punk' },
];

function RecommendationPage() {
  return (
    <div>
      <h2>감성 음악 추천</h2>
      <div className="card-container">
        {recommendedSongs.map((song, index) => (
          <MusicCard key={index} title={song.title} artist={song.artist} />
        ))}
      </div>
    </div>
  );
}

export default RecommendationPage;

