const express = require('express');
const axios = require('axios');
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./db');
const Log = require('./models/Log');

const app = express();
const PORT = process.env.PORT || 5000;
const LASTFM_API_KEY = process.env.LASTFM_API_KEY;

// ===========================
// 미들웨어
// ===========================
app.use(cors());
app.use(express.json());

// ===========================
// DB 연결
// ===========================
connectDB();

// ===========================
// 감정-태그 매핑
// ===========================
const moodMap = {
  우울: 'sad',
  신남: 'party',
  비: 'rain',
  맑음: 'chillout',
  운동: 'workout',
  데이트: 'romantic'
};

const fallbackTags = {
  sad: ['melancholy', 'emotional', 'slow'],
  party: ['dance', 'club', 'electronic'],
  rain: ['ambient', 'acoustic', 'chillout'],
  workout: ['energy', 'gym', 'electronic'],
  romantic: ['love', 'ballad', 'soft']
};

// ===========================
// 추천 로직
// ===========================
const fetchTracks = async (emotion) => {
  const keyword = moodMap[emotion] || emotion;
  if (!LASTFM_API_KEY) throw new Error('LASTFM_API_KEY 미설정');

  const getTracks = async (tag) => {
    const res = await axios.get('https://ws.audioscrobbler.com/2.0/', {
      params: {
        method: 'tag.gettoptracks', // ✅ 소문자 메서드명 (API 요구사항)
        tag,
        api_key: LASTFM_API_KEY,
        format: 'json',
        limit: 10,
      },
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

  // ✅ 로그 저장 (필드 이름 명시적으로 매핑)
  await Log.create({
    input: emotion,
    keyword,
    results: tracks.slice(0, 10),
  });

  return tracks;
};

// ===========================
// 요청 핸들러
// ===========================
app.post('/recommend', async (req, res) => {
  try {
    const { emotion } = req.body;
    if (!emotion) return res.status(400).json({ error: 'emotion이 필요합니다.' });

    const tracks = await fetchTracks(emotion);
    if (!tracks.length) return res.status(404).json({ error: '추천 결과 없음' });

    res.json({ tracks });
  } catch (err) {
    console.error('추천 오류:', err.message);
    res.status(500).json({ error: '추천 실패' });
  }
});

// ✅ 헬스체크 엔드포인트
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// ===========================
// 서버 시작
// ===========================
app.listen(PORT, () => console.log(`추천 서버 실행 중: ${PORT}`));

