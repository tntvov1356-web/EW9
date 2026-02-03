import React, { useState } from 'react';

interface FilterScreenProps {
  categories: any[];
  selectedCategoryIds: string[];
  onToggleCategory: (id: string) => void;
  onBack: () => void;
  onAddCustomCategory: (name: string) => void;
  onDeleteCategory: (id: string) => void;
  onSelectAll: () => void;
  onResetDefault: () => void; // 👈 確保這裡有定義
}

const FilterScreen: React.FC<FilterScreenProps> = ({ 
  categories, 
  selectedCategoryIds, 
  onToggleCategory, 
  onBack,
  onAddCustomCategory,
  onDeleteCategory,
  onSelectAll,
  onResetDefault // 👈 確保這裡有解構出來使用
}) => {
  const [newCatName, setNewCatName] = useState('');

  const handleAdd = () => {
    if (newCatName.trim()) {
      onAddCustomCategory(newCatName.trim());
      setNewCatName('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white font-sans overflow-hidden">
      
      {/* 1. 頂部固定區：新增與恢復按鈕 */}
      <div className="p-6 pt-10 border-b border-gray-50 flex-shrink-0">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-3xl font-black italic text-gray-800 leading-none">想食新嘢？汪！</h2>
          <button 
            onClick={onResetDefault}
            className="text-[10px] font-bold text-orange-400 border border-red-100 px-2 py-1 rounded-lg active:bg-red-50 transition-colors"
          >
            恢復預設
          </button>
        </div>
        
        <div className="flex gap-2">
          <input 
            type="text" 
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="輸入新菜式 (例如: 食辣野)"
            className="flex-1 bg-gray-100 border-none rounded-2xl px-4 py-3 font-bold focus:ring-2 focus:ring-green-400 outline-none text-gray-700"
          />
          <button 
            onClick={handleAdd}
            className="bg-green-400 text-white p-3 rounded-2xl shadow-lg active:scale-90 transition-all flex items-center justify-center"
          >
            <span className="material-icons-outlined">add</span>
          </button>
        </div>
      </div>

      {/* 2. 類別列表 (滾動區) */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="grid grid-cols-2 gap-4 pb-10">
          {categories.map((cat) => {
            const isSelected = selectedCategoryIds.includes(cat.id);
            return (
              <div key={cat.id} className="relative">
                <button
                  onClick={() => onToggleCategory(cat.id)}
                  className={`w-full p-5 rounded-[2rem] flex flex-col items-center gap-3 transition-all border-4 ${
                    isSelected 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-gray-50 bg-white opacity-40'
                  }`}
                >
                  <span className="text-3xl">
                    {/* 這裡暫時用 Emoji 替代 Material Icons 確保能顯示 */}
                    {cat.name === '燒肉' ? '🍴' : 
                     cat.name === '漢堡' ? '🍴' : 
                     cat.name === '壽司' ? '🍴' : '🍴'}
                  </span>
                  <span className={`font-black text-sm ${isSelected ? 'text-green-600' : 'text-gray-400'}`}>
                    {cat.name}
                  </span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCategory(cat.id);
                  }}
                  className="absolute -top-1 -right-1 bg-red-400 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg active:scale-75 z-10 border-2 border-white"
                >
                  <span className="text-[10px]">✕</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. 底部按鈕 */}
      <div className="p-6 pb-8 flex flex-col gap-3 bg-white border-t border-gray-100 shadow-lg flex-shrink-0">
        <div className="flex gap-3">
          <button 
            onClick={onSelectAll}
            className="flex-1 bg-gray-900 text-white py-4 rounded-[1.5rem] font-black text-base active:scale-95 transition-all"
          >
            是狗但 (全選)
          </button>
          <button 
            onClick={onBack}
            className="flex-[2] bg-green-400 text-white py-4 rounded-[1.5rem] font-black text-lg shadow-lg active:scale-95 transition-all"
          >
            揀好啦!
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterScreen;