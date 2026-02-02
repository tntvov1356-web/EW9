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
      {/* 1. 右上角篩選圖案 - 使用 absolute 定位固定在右上 */}
      <div className="absolute top-6 right-6">
        <button 
          onClick={onOpenFilter} 
          className="p-3 bg-white rounded-full shadow-md active:scale-90 transition-all border border-gray-100 flex items-center justify-center"
        >
          <span className="material-icons-outlined text-gray-700 text-2xl">tune</span>
        </button>
      </div>

      {/* 2. 中間核心區塊：只有圓圈狗圖案 */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <button 
          onClick={onDraw}
          disabled={isLoading}
          className="group relative focus:outline-none"
        >
          {/* 圓圈外環與狗圖：現在點擊這個圓圈就會觸發抽獎 */}
          <div className={`
            w-56 h-56 rounded-full border-[6px] border-green-400 
            flex items-center justify-center shadow-2xl bg-white 
            overflow-hidden transition-all duration-300
            ${isLoading ? 'animate-pulse opacity-70' : 'group-active:scale-95 group-hover:border-green-500'}
          `}>
            <img 
              src="/ew9.png" 
              alt="Logo" 
              className="w-full h-full object-contain p-4" 
            />
          </div>

          {/* 狀態提示文字 */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 font-bold tracking-widest uppercase text-sm">
              {isLoading ? 'Thinking...' : 'Tap to Start'}
            </p>
          </div>
        </button>
      </div>
      
      {/* 底部預留空間平衡視覺 */}
      <div className="h-10" />
    </div>
  );
};

export default HomeScreen;