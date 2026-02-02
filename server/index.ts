import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import cors from 'cors';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. 初始化 Supabase
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// 2. 初始化 AI (加強錯誤處理，確保唔會整死 Server)
let genAI: any;
try {
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());
    console.log("✅ Google AI SDK 載入成功");
  }
} catch (e) {
  console.error("❌ AI 模組載入失敗，將使用備用推薦語");
}

// --- 接口 1：獲取所有類別 ---
app.get('/api/categories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- 接口 2：純菜式抽籤邏輯 (移除餐廳資訊) ---
app.post('/api/draw', async (req, res) => {
  const { categoryIds } = req.body;
  
  try {
    if (!categoryIds || categoryIds.length === 0) {
      return res.json({ success: false, message: '你都未揀想食咩類別汪！' });
    }

    // 隨機揀一個 ID
    const luckyId = categoryIds[Math.floor(Math.random() * categoryIds.length)];

    // 去 Supabase 攞資料
    const { data: category, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', luckyId)
      .single();

    if (error || !category) throw new Error('搵唔到呢個菜式資料汪！');

    // 準備備用推薦語
    const fallbacks = [
      `咁多嘢唔揀，偏偏揀「${category.name}」，你口味都幾獨特汪！`,
      `今日就食「${category.name}」啦，唔好再諗喇汪！`,
      `汪！抽到「${category.name}」，快啲去搵食啦。`
    ];
    let aiReason = fallbacks[Math.floor(Math.random() * fallbacks.length)];

    // 嘗試 AI 推薦 (失敗會自動跳過)
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(`你係一隻毒舌流浪狗，用一句極簡廣東話點評「${category.name}」呢款菜式。加「汪！」`);
        const response = await result.response;
        aiReason = response.text().trim();
      } catch (e) {
        console.log("⚠️ AI 暫時罷工，使用備用推薦語");
      }
    }

    // 回傳給前端
    res.json({
      success: true,
      data: {
        categoryName: category.name,
        aiReason: aiReason
      }
    });

  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- 接口 3：新增自定義菜式 ---
app.post('/api/categories', async (req, res) => {
  const { name } = req.body;
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name, icon: 'stars', bg_color: '#4ade80' }])
      .select();
    
    if (error) throw error;
    res.json({ success: true, data: data[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- 啟動 Server (擺喺最後，確保之前無 Error 阻擋) ---
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Eatwhat9 後端啟動: http://localhost:${PORT}`);
});