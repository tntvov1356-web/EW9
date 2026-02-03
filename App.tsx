import React, { useState, useEffect } from 'react';
import { ScreenName, DishResult } from './types';
import HomeScreen from './components/HomeScreen';
import ResultScreen from './components/ResultScreen';
import FilterScreen from './components/FilterScreen';
import { supabase } from './supabaseClient'; 

// 定義 9 個預設菜式
const DEFAULT_CATEGORIES = [
  { name: '燒肉', icon: 'fire' },
  { name: '糖水', icon: 'ice_cream' },
  { name: '漢堡', icon: 'lunch_dining' },
  { name: '壽司', icon: 'set_meal' },
  { name: '譚仔', icon: 'ramen_dining' },
  { name: '茶餐廳', icon: 'coffee' },
  { name: '泰國菜', icon: 'bakery_dining' },
  { name: '火鍋', icon: 'styler' },
  { name: '沙律', icon: 'eco' }
];

const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenName>('home');
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [drawResult, setDrawResult] = useState<DishResult | null>(null);

  // --- 1. 抽取成獨立函式，方便重新整理資料 ---
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setCategories(data);
        // 預設全選所有讀取到的菜式
        setSelectedCategoryIds(data.map((c: any) => c.id));
      }
    } catch (error) {
      console.error("❌ Supabase 讀取出錯:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // --- 2. 新增菜式 ---
  const addCustomCategory = async (name: string) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name }])
        .select();

      if (error) throw error;
      if (data) {
        setCategories(prev => [data[0], ...prev]);
        setSelectedCategoryIds(prev => [data[0].id, ...prev]);
      }
    } catch (e) {
      alert("儲唔到呀汪！");
    }
  };

  // --- 3. 刪除菜式 ---
  const deleteCategory = async (id: string) => {
    if (!window.confirm("真係要剷咗佢？")) return;
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCategories(prev => prev.filter(c => c.id !== id));
      setSelectedCategoryIds(prev => prev.filter(sid => sid !== id));
    } catch (e) {
      alert("刪唔到呀汪！");
    }
  };

  // --- 4. 🚀 核心新增：恢復預設菜式功能 ---
  const resetToDefault = async () => {
    if (!window.confirm("係咪要恢復返 9 個預設菜式？汪！")) return;
    
    setIsLoading(true);
    try {
      // 第一步：清空目前資料庫所有類別
      // 注意：.neq('id', '0') 是為了繞過 Supabase 安全限制，確保刪除所有內容
      const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .neq('name', 'THIS_WILL_NEVER_MATCH'); 

      if (deleteError) throw deleteError;

      // 第二步：批量插入預設數據
      const { error: insertError } = await supabase
        .from('categories')
        .insert(DEFAULT_CATEGORIES);

      if (insertError) throw insertError;

      // 第三步：重新從資料庫抓取最新列表，同步 UI
      await fetchCategories();
      alert("已經恢復預設菜式啦！汪汪！");
    } catch (e) {
      console.error(e);
      alert("恢復失敗，請檢查網路！");
    } finally {
      setIsLoading(false);
    }
  };

  // --- 5. 抽籤功能 ---
  const handleDraw = async () => {
    if (selectedCategoryIds.length === 0) {
      alert("你一個菜式都無揀，叫我點抽呀汪！");
      return;
    }

    setIsLoading(true);
    // 增加一點延遲動畫感
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * selectedCategoryIds.length);
      const chosenId = selectedCategoryIds[randomIndex];
      const chosenCategory = categories.find(c => c.id === chosenId);

      if (chosenCategory) {
        setDrawResult({
          categoryName: chosenCategory.name,
          aiReason: `汪！既然你揀唔到，狗狗幫你決定食「${chosenCategory.name}」啦！快啲去搵食，唔好餓親！`
        });
        setScreen('result');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      {/* 這裡加入 max-h 設定，配合手機高度 */}
      <div className="w-full max-w-md bg-white h-[100dvh] shadow-2xl relative overflow-hidden flex flex-col">
        {screen === 'home' && (
          <HomeScreen 
            onDraw={handleDraw} 
            isLoading={isLoading} 
            onOpenFilter={() => setScreen('filter')} 
          />
        )}

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
            onResetDefault={resetToDefault} // 傳入恢復功能
            onSelectAll={() => {
              setSelectedCategoryIds(categories.map(c => c.id));
              setScreen('home');
            }}
          />
        )}

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