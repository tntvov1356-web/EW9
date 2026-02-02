import { GoogleGenAI, Type } from "@google/genai";
import { CATEGORIES, RESTAURANTS, IMAGES } from '../constants';
import { DishResult, Restaurant } from '../types';

const SYSTEM_INSTRUCTION = `
你是一個專門為 App「食乜狗 (Eatwhat9)」設計的後端數據引擎。你的任務是根據用戶的篩選條件，從你的數據庫中精確、隨機地抽出一項菜式。

# Food Database (Knowledge)
你掌握以下類別的菜式 (必須嚴格對應用戶選擇):
- [茶餐廳]: 乾炒牛河, 雲吞麵, 燒鵝飯, 西多士, 菠蘿油, 楊枝甘露, 豆腐火腩飯, 椒鹽鮮魷, 焗豬扒飯, 粟米肉粒飯, 常餐, 奶茶, 蛋治
- [米線]: 過橋米線, 麻辣米線, 酸辣米線, 雲南米線, 番茄湯米線, 腩肉炸醬米線, 三哥米線
- [日本野]: 拉麵, 壽司, 天婦羅, 鰻魚飯, 刺身定食, 滑蛋豬扒飯, 鐵板燒, 大阪燒, 丼飯, 烏冬
- [打邊爐]: 重慶麻辣火鍋, 椰子雞煲, 壽喜燒, 港式沙嗲鍋, 雞煲, 放題火鍋
- [飲茶]: 蝦餃, 燒賣, 叉燒包, 腸粉, 鳳爪, 排骨飯, 糯米雞, 春卷, 點心
- [快餐]: 麥當勞, 炸雞, 漢堡包, 薯條, 披薩, 两餸飯, 吉野家, KFC, Subway
- [泰國菜]: 泰式冬蔭功, 海南雞飯, 越式火車頭, 叻沙, 泰式炒金邊粉, 咖哩蟹, 串燒, 芒果糯米飯
- [燒肉]: 韓式燒肉, 日式燒肉, 串燒放題, 燒肉定食
- [糖水]: 芝麻糊, 楊枝甘露, 豆腐花, 芒果西米露, 湯圓, 綠豆沙, 紅豆沙, 燉蛋, 芋圓, 涼粉, 喳咋

# Workflow
1. 接收用戶輸入的 selected_categories (一個清單)。
2. 檢查 selected_categories:
   - 如果清單包含 "隨機" 或 "是9但"，則忽視其他選項，從所有類別中隨機抽取。
   - 如果清單包含了所有類別，則從所有類別中隨機抽取。
   - **關鍵規則**: 如果清單只包含特定類別 (例如 ["糖水"])，**必須嚴格限制**只從該類別中抽取。
     - 絕對禁止跨類別推薦 (例如用戶選 "糖水"，絕對不可以出 "魚蛋粉" 或 "壽司")。
     - 必須確保 dish_name 屬於該類別。
3. 隨機選出一個菜式。

# Output
必須嚴格按照 JSON 格式回傳，不得有任何額外對話。
`;

export async function getRandomDish(categoryIds: string[]): Promise<DishResult> {
  // Convert IDs to names
  const selectedNames = categoryIds.map(id => {
    const cat = CATEGORIES.find(c => c.id === id);
    return cat ? cat.name : id;
  });

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: JSON.stringify({ selected_categories: selectedNames }),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dish_id: { type: Type.STRING },
            dish_name: { type: Type.STRING },
            category: { type: Type.STRING },
            image_tag: { type: Type.STRING },
            search_keyword: { type: Type.STRING },
          },
          required: ['dish_id', 'dish_name', 'category', 'image_tag', 'search_keyword'],
        },
        // Disable thinking budget to prioritize lowest latency for this simple task
        thinkingConfig: { thinkingBudget: 0 }, 
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as DishResult;
    }
  } catch (error) {
    console.error("AI Generation Error:", error);
    // Fallback if API fails
    return {
      dish_id: 'fallback',
      dish_name: '常餐',
      category: '茶餐廳',
      image_tag: 'local_cafe',
      search_keyword: '茶餐廳',
    };
  }
  
  throw new Error("No response from AI");
}

export async function findNearbyRestaurants(dishName: string, lat: number, lng: number): Promise<Restaurant[]> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using gemini-2.5-flash for Maps Grounding support
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find 5 highly rated restaurants that serve ${dishName} nearby.`,
      config: {
        tools: [{googleMaps: {}}],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      },
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const foundPlaces: Restaurant[] = [];

    // Extract places from grounding chunks
    chunks.forEach((chunk, index) => {
      if (chunk.maps?.title && chunk.maps?.sourceId?.resourceId) {
         // Create a restaurant object from the map data
         // Note: Grounding chunks provide basic info. We mock some visual details for UI consistency.
         foundPlaces.push({
           id: chunk.maps.sourceId.resourceId,
           name: chunk.maps.title,
           rating: 4.0 + Math.random() * 1.0, // Mock rating as it's not always in chunks
           distance: '附近', // We don't get exact distance in chunks
           type: dishName,
           isOpen: true,
           isPopular: index < 2,
           tags: [
             { text: 'Google Maps', bg: 'bg-blue-100', color: 'text-blue-700' }
           ],
           image: IMAGES.RESULT_FOOD // Use placeholder as we don't get image URLs directly
         });
      }
    });

    return foundPlaces;

  } catch (error) {
    console.error("Maps Grounding Error:", error);
    return [];
  }
}