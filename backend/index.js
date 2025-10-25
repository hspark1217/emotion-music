const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const Log = require('./models/Log');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB 연결 실패:', err.message);
    process.exit(1);
  });

const moodMap = {
  '우울': 'sad',
  '신남': 'party',
  '비': 'rain',
  '맑음': 'chillout',
  '운동': 'workout',
  '데이트': 'romantic'
};

const fallbackTags = {
  'sad': ['melancholy', 'emotional', 'slow'],
  'party': ['dance', 'club', 'electronic'],
  'rain': ['ambient', 'acoustic', 'chillout'],
  'workout': ['energy', 'gym', 'electronic'],
  'romantic': ['love', 'ballad', 'soft']
};

// ✅ 공통 추천 로직 함수
async function fetchTracks(input) {
  const keyword = moodMap[input] || input;
  const apiKey = process.env.LASTFM_API_KEY;

  await Log.create({ input, keyword });

  const getTracks = async (tag) => {
    const res = await axios.get('http://ws.audioscrobbler.com/2.0/', {
      params: {
        method: 'tag.getTopTracks',
        tag,
        api_key: apiKey,
        format: 'json',
        limit: 10
      }
    });
    return res.data.tracks?.track || [];
  };

  let tracks = await getTracks(keyword);

  if (!tracks.length && fallbackTags[keyword]) {
    for (const altTag of fallbackTags[keyword]) {
      tracks = await getTracks(altTag);
      if (tracks.length) break;
    }
  }

  return tracks;
}

// ✅ GET 방식
app.get('/recommend', async (req, res) => {
  try {
    const tracks = await fetchTracks(req.query.q);
    if (!tracks.length) return res.status(404).json({ error: '추천 결과 없음' });
    res.json({ tracks });
  } catch (err) {
    console.error('추천 오류:', err.message);
    res.status(500).json({ error: '추천 실패' });
  }
});

// ✅ POST 방식
app.post('/api/recommend', async (req, res) => {
  try {
    const tracks = await fetchTracks(req.body.emotion);
    if (!tracks.length) return res.status(404).json({ error: '추천 결과 없음' });
    res.json({ tracks });
  } catch (err) {
    console.error('추천 오류:', err.message);
    res.status(500).json({ error: '추천 실패' });
  }
});

app.listen(PORT, () => console.log(`추천 서버 실행 중: ${PORT}`));

