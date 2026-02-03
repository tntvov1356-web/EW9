import React, { useState } from 'react';

interface FilterScreenProps {
  categories: any[];
  selectedCategoryIds: string[];
  onToggleCategory: (id: string) => void;
  onBack: () => void;
  onAddCustomCategory: (name: string) => void;
  onDeleteCategory: (id: string) => void;
  onSelectAll: () => void;
  onResetDefault: () => void;
}

const FilterScreen: React.FC<FilterScreenProps> = ({ 
  categories, 
  selectedCategoryIds, 
  onToggleCategory, 
  onBack,
  onAddCustomCategory,
  onDeleteCategory,
  onSelectAll
}) => {
  const [newCatName, setNewCatName] = useState('');

  const handleAdd = () => {
    if (newCatName.trim()) {
      onAddCustomCategory(newCatName.trim());
      setNewCatName('');
    }
  };

  return (
    // 使用 h-screen 確保容器高度固定為螢幕高度，防止整頁被撐開
    <div className="flex flex-col h-screen bg-white font-sans overflow-hidden">
      
      {/* 1. 頂部固定區：新增菜式 */}
      <div className="p-6 pt-10 border-b border-gray-50 flex-shrink-0">
        <h2 className="text-3xl font-black italic mb-4 text-gray-800">想食新嘢？汪！</h2>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="輸入新菜式 (例如: 譚仔)"
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

      {/* 2. 類別列表 (關鍵滾動區) */}
      {/* flex-1 佔滿剩餘空間, overflow-y-auto 開啟垂直滾動 */}
      <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
        <div className="grid grid-cols-2 gap-4 pb-10"> {/* pb-10 確保最後一行不會貼太近 */}
          {categories.map((cat) => {
            const isSelected = selectedCategoryIds.includes(cat.id);
            return (
              <div key={cat.id} className="relative group">
                <button
                  onClick={() => onToggleCategory(cat.id)}
                  className={`w-full p-5 rounded-[2rem] flex flex-col items-center gap-3 transition-all border-4 ${
                    isSelected 
                      ? 'border-green-400 bg-green-50 shadow-sm' 
                      : 'border-gray-50 bg-white opacity-60'
                  }`}
                >
                  <span className="material-icons-outlined text-4xl" style={{ color: isSelected ? '#4ade80' : '#ccc' }}>
                    {cat.icon || 'restaurant'}
                  </span>
                  <span className={`font-black text-sm break-all ${isSelected ? 'text-green-600' : 'text-gray-400'}`}>
                    {cat.name}
                  </span>
                </button>

                {/* 刪除按鈕 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCategory(cat.id);
                  }}
                  className="absolute -top-1 -right-1 bg-red-400 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg active:scale-75 transition-all z-10 border-2 border-white"
                >
                  <span className="material-icons-outlined text-xs">close</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. 底部固定動作區 */}
      <div className="p-6 pb-8 flex flex-col gap-3 bg-white border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] flex-shrink-0">
        <div className="flex gap-3">
          <button 
            onClick={onSelectAll}
            className="flex-1 bg-gray-900 text-white py-4 rounded-[1.5rem] font-black text-base active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-icons-outlined text-lg">shuffle</span>
            是狗但
          </button>
          <button 
            onClick={onBack}
            className="flex-[2] bg-green-400 text-white py-4 rounded-[1.5rem] font-black text-lg shadow-lg active:scale-95 transition-all"
          >
            揀好啦!
          </button>
        </div>
        <p className="text-center text-gray-400 text-[10px] font-bold uppercase tracking-widest">
          Selected: {selectedCategoryIds.length} / {categories.length}
        </p>
      </div>
    </div>
  );
  
};
// 在返回的 JSX 中修改：
<div className="p-6 pt-10 border-b border-gray-50 flex-shrink-0">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-3xl font-black italic text-gray-800">想食新嘢？汪！</h2>
    <button 
      onClick={onResetDefault}
      className="text-[10px] font-bold text-gray-400 border border-gray-200 px-2 py-1 rounded-lg active:bg-gray-100"
    >
      🔄 恢復預設
    </button>
  </div>
  {/* ... 輸入框代碼 */}
</div>

export default FilterScreen;