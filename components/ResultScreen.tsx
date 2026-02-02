import React from 'react';
import { DishResult } from '../types';

interface ResultScreenProps {
  result: DishResult;
  onBack: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ result, onBack }) => {
  // Debug：檢查目前接收到的資料結構
  console.log("ResultScreen 顯示數據:", result);

  return (
    <div className="flex flex-col h-full bg-white relative font-sans overflow-hidden">
      
      {/* 1. 頂部裝飾標籤 */}
      <div className="px-8 pt-12 absolute top-0 w-full flex justify-start items-center z-0">
        <span className="bg-green-100 text-green-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em]">
          Final Decision
        </span>
      </div>

      {/* 2. 中央內容區 */}
      <div className="flex-1 flex flex-col justify-center px-8">
        
        <div className="mb-2 flex items-center gap-2">
          <div className="h-[2px] w-4 bg-gray-300"></div>
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest">你今日要食</p>
        </div>
        
        <h1 className="text-6xl font-black text-gray-900 leading-[1.1] mb-10 tracking-tighter break-words">
          {result.categoryName || '未知菜式'}
        </h1>

        {/* 評語對話框 */}
        <div className="bg-gray-900 rounded-[2.5rem] p-8 relative shadow-2xl border-b-[10px] border-green-500">
          
          {/* 修正：懸浮狗頭頭像 - 調整定位避免過度遮擋 */}
          <div className="absolute -top-14 -right-2 w-24 h-24 bg-green-400 rounded-full border-[6px] border-white overflow-hidden shadow-xl transform rotate-12 z-10">
            <img 
              src="/ew9.png" 
              alt="Dog" 
              className="w-full h-full object-contain p-2" 
              onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')}
            />
          </div>
          
          {/* 修正：增加 pr-16 (Padding Right) 確保文字不會伸延到狗頭下方 */}
          <p className="text-white font-bold text-2xl leading-relaxed italic pr-16 relative z-0">
            "{result.aiReason || '揀咗咁耐，原來你想食呢啲？汪！'}"
          </p>
          
          <div className="mt-8 flex items-center gap-3">
            <div className="h-[2px] w-12 bg-green-400" />
            <span className="text-green-400 text-[12px] font-black uppercase tracking-widest">戇狗狗</span>
          </div>
        </div>
      </div>

      {/* 3. 底部按鈕區 */}
      <div className="p-8 pb-12 flex flex-col gap-4">
        <button 
          onClick={() => {
            const query = encodeURIComponent((result.categoryName || '') + ' 附近美食');
            window.open(`https://www.google.com/search?q=${query}`, '_blank');
          }}
          className="w-full bg-black text-white py-6 rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg hover:bg-gray-800"
        >
          <span>唔L諗啦！就食佢！</span>
          {/* 建議：如果沒有安裝 Material Icons，可用 Emoji 替代：🔍 */}
          <span className="text-green-400">🔍</span>
        </button>

        <button 
          onClick={onBack} 
          className="w-full bg-gray-100 text-gray-400 py-5 rounded-[2.5rem] font-black text-lg active:scale-95 transition-all hover:bg-gray-200 hover:text-gray-500"
        >
          唔L食呢啲！再抽過！
        </button>
      </div>

      {/* 背景裝飾 */}
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-green-50 rounded-full -z-10 opacity-50"></div>
    </div>
  );
};

export default ResultScreen;