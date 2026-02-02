import React, { useState, useEffect } from 'react';
import { ScreenName, DishResult } from './types';
import HomeScreen from './components/HomeScreen';
import ResultScreen from './components/ResultScreen';
import FilterScreen from './components/FilterScreen';
// 1. 導入你建立好的 supabase 實例
import { supabase } from './supabaseClient'; 

const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenName>('home');
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [drawResult, setDrawResult] = useState<DishResult | null>(null);

  // --- 2. 初始化：從 Supabase 讀取資料 ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('created_at', { ascending: false }); // 按時間排序

        if (error) throw error;

        if (data) {
          setCategories(data);
          setSelectedCategoryIds(data.map((c: any) => c.id));
        }
      } catch (error) {
        console.error("❌ Supabase 讀取出錯:", error);
      }
    };
    fetchCategories();
  }, []);

  // --- 3. 新增菜式功能 (使用 Supabase) ---
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
      console.error(e);
      alert("儲唔到呀汪！");
    }
  };

  // --- 4. 刪除菜式功能 (使用 Supabase) ---
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
      console.error(e);
      alert("刪唔到呀汪！");
    }
  };

  // --- 5. 抽籤功能 (前端實現) ---
  // 提示：原本抽籤在後端，現在改在前端隨機抽選，並可配合 AI 生成評價
  const handleDraw = async () => {
    if (selectedCategoryIds.length === 0) {
      alert("你一個菜式都無揀，叫我點抽呀汪！");
      return;
    }

    setIsLoading(true);
    try {
      // 從已選中的 ID 中隨機抽一個
      const randomIndex = Math.floor(Math.random() * selectedCategoryIds.length);
      const chosenId = selectedCategoryIds[randomIndex];
      const chosenCategory = categories.find(c => c.id === chosenId);

      if (chosenCategory) {
        // 這裡模擬 AI 評價，或者你可以調用 Edge Function 生成
        const resultData: DishResult = {
          categoryName: chosenCategory.name,
          aiReason: `汪！既然你揀唔到，狗狗幫你決定食「${chosenCategory.name}」啦！快啲去搵食，唔好餓親！`
        };

        setDrawResult(resultData);
        setScreen('result');
      }
    } catch (error) {
      console.error("抽籤錯誤:", error);
      alert("抽籤出咗問題汪！");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative overflow-hidden">
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