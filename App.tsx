import React, { useState, useEffect } from 'react';
import { ScreenName, DishResult } from './types';
import HomeScreen from './components/HomeScreen';
import ResultScreen from './components/ResultScreen';
import FilterScreen from './components/FilterScreen';

const App: React.FC = () => {
  // --- 1. State 定義 ---
  const [screen, setScreen] = useState<ScreenName>('home');
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // ✅ 修正：統一命名為 drawResult，解決截圖 image_3c7245.png 的 ReferenceError
  const [drawResult, setDrawResult] = useState<DishResult | null>(null);

  // --- 2. 初始化：拎類別資料 ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/categories');
        const result = await response.json();
        if (result.success) {
          setCategories(result.data);
          // 預設全選
          setSelectedCategoryIds(result.data.map((c: any) => c.id));
        }
      } catch (error) {
        console.error("❌ 無法連接後端，請檢查 Terminal 是否已啟動 npm run dev");
      }
    };
    fetchCategories();
  }, []);

  // --- 3. 新增菜式功能 ---
  const addCustomCategory = async (name: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const result = await response.json();
      if (result.success) {
        setCategories(prev => [result.data, ...prev]);
        setSelectedCategoryIds(prev => [result.data.id, ...prev]);
      }
    } catch (e) {
      alert("儲唔到呀汪！");
    }
  };

  // --- 4. 刪除菜式功能 ---
  const deleteCategory = async (id: string) => {
    if (!window.confirm("真係要剷咗佢？")) return;
    try {
      const response = await fetch(`http://localhost:3001/api/categories/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        setCategories(prev => prev.filter(c => c.id !== id));
        setSelectedCategoryIds(prev => prev.filter(sid => sid !== id));
      }
    } catch (e) {
      alert("刪唔到呀汪！");
    }
  };

  // --- 5. 抽籤功能 (核心修正) ---
  const handleDraw = async () => {
    if (selectedCategoryIds.length === 0) {
      alert("你一個菜式都無揀，叫我點抽呀汪！");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/draw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryIds: selectedCategoryIds }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        // ✅ 修正：這裡的變數名必須跟 useState 一致
        setDrawResult(result.data); 
        setScreen('result');
      } else {
        alert(result.message || '抽籤失敗汪！');
      }
    } catch (error) {
      console.error("抽籤錯誤:", error);
      alert("連唔到後端呀，係咪未開 Server？");
    } finally {
      setIsLoading(false);
    }
  };

  // --- 6. 渲染 UI ---
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative overflow-hidden">
        
        {/* 首頁 */}
        {screen === 'home' && (
          <HomeScreen 
            onDraw={handleDraw} 
            isLoading={isLoading} 
            onOpenFilter={() => setScreen('filter')} 
          />
        )}

        {/* 篩選/管理頁面 */}
        {screen === 'filter' && (
          <FilterScreen 
            categories={categories} 
            selectedCategoryIds={selectedCategoryIds} 
            onToggleCategory={(id) => setSelectedCategoryIds(prev => 
              prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
            )}
            onBack={() => setScreen('home')}
            onAddCustomCategory={addCustomCategory}
            onDeleteCategory={deleteCategory}
            onSelectAll={() => {
              setSelectedCategoryIds(categories.map(c => c.id));
              setScreen('home');
            }}
          />
        )}

        {/* 結果頁面 */}
        {screen === 'result' && drawResult && (
          <ResultScreen 
            result={drawResult} 
            onBack={() => setScreen('home')} 
          />
        )}
        
      </div>
    </div>
  );
};

export default App;