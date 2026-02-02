import React from 'react';

interface HomeScreenProps {
  onDraw: () => void;
  isLoading: boolean;
  onOpenFilter: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ 
  onDraw,
  isLoading,
  onOpenFilter 
}) => {
  return (
    <div className="flex flex-col h-full p-6 relative">
      {/* 1. 右上角篩選按鈕 */}
      <div className="absolute top-6 right-6 z-10">
        <button 
          onClick={onOpenFilter} 
          className="p-3 bg-white rounded-full shadow-md active:scale-90 transition-all border border-gray-100 flex items-center justify-center"
        >
          {/* 如果 Material Icons 沒顯示，這裡可以用 ⚙️ 符號 */}
          <span className="text-gray-700 text-xl">⚙️</span>
        </button>
      </div>

      {/* 2. 中央核心區塊 */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <button 
          onClick={onDraw}
          disabled={isLoading}
          className="group relative focus:outline-none"
        >
          {/* 圓圈按鈕本體 */}
          <div className={`
            w-60 h-60 rounded-full border-[8px] border-green-400 
            flex items-center justify-center shadow-2xl bg-white 
            overflow-hidden transition-all duration-300
            ${isLoading ? 'animate-pulse opacity-70' : 'group-active:scale-95 group-hover:border-green-500'}
          `}>
            <img 
              src="/ew9.png" 
              alt="Dog Logo" 
              className="w-full h-full object-contain p-4"
              onError={(e) => {
                // 如果 /ew9.png 404，顯示這張暫代圖
                e.currentTarget.src = 'https://via.placeholder.com/200?text=Doggy';
              }}
            />
          </div>

          {/* 狀態提示文字 */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 font-black tracking-[0.2em] uppercase text-xs">
              {isLoading ? 'Thinking...' : 'Tap to Start'}
            </p>
          </div>
        </button>
      </div>
      
      {/* 底部裝飾 */}
      <div className="h-10" />
    </div>
  );
};

export default HomeScreen;