// BE/src/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// 환경변수에 UPSTAGE_API_KEY 와 UPSTAGE_BASE_URL 을 설정하세요.
// 예시 .env:
//   UPSTAGE_API_KEY=up_3u9xjn90TOIPtqCcwYt1OfwGyZkzP
//   UPSTAGE_BASE_URL=https://api.upstage.ai/v1

if (!process.env.UPSTAGE_API_KEY || !process.env.UPSTAGE_BASE_URL) {
  console.error('UPSTAGE_API_KEY or UPSTAGE_BASE_URL is not set');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.UPSTAGE_API_KEY,
  baseURL: process.env.UPSTAGE_BASE_URL
});

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Solar LLM 호출 (stream: false 로 바로 컨텐츠 가져오기)
    const completion = await openai.chat.completions.create({
      model: 'solar-pro2-preview',
      messages: [
        { role: 'user', content: message }
      ],
      
      stream: false
    });

    const reply = completion.choices[0]?.message?.content;
    if (!reply) {
      throw new Error('No content in Solar LLM response');
    }

    res.json({ response: reply });
  } catch (error) {
    console.error('Error details:', error);

    // Upstage API 에러 처리
    if (error instanceof OpenAI.APIError) {
      res.status(error.status || 500).json({
        error: 'Solar LLM API error',
        details: error
      });
    } else {
      res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(
    `Using Solar LLM at ${process.env.UPSTAGE_BASE_URL} with key ${process.env.UPSTAGE_API_KEY.slice(0,8)}…`
  );
});
