import { createClient } from '@supabase/supabase-js';

// 獲取環境變量
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// --- 架構師建議：防禦性檢查 ---
// 如果部署到 Vercel 忘記填 Key，這段檢查能在 Console 清晰提示，而不是噴出難以排查的錯誤
if (!supabaseUrl || !supabaseKey) {
  console.error(
    '❌ 漏咗 Supabase 環境變量呀汪！\n' +
    '請檢查 .env 文件或 Vercel 的 Environment Variables 設定。\n' +
    '需要包含: VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY'
  );
}

// 導出實例
export const supabase = createClient(
  supabaseUrl || '', 
  supabaseKey || ''
);