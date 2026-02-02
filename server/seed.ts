import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const CATEGORIES = [
  { name: '茶餐廳', icon: 'local_cafe', bg_color: '#FFD1BA' },
  { name: '米線', icon: 'ramen_dining', bg_color: '#FFF5BA' },
  { name: '日本野', icon: 'set_meal', bg_color: '#30e88c' },
  { name: '打邊爐', icon: 'soup_kitchen', bg_color: '#ffc0cb' },
  { name: '飲茶', icon: 'tapas', bg_color: '#E6E6FA' },
  { name: '快餐', icon: 'fastfood', bg_color: '#dbeafe' },
  { name: '泰國菜', icon: 'local_fire_department', bg_color: '#FFE4E1' },
  { name: '燒肉', icon: 'outdoor_grill', bg_color: '#dcfce7' },
  { name: '糖水', icon: 'icecream', bg_color: '#FFFACD' }
];

const RESTAURANTS = [
  { name: '澳洲牛奶公司', rating: 4.5, distance: '0.1 km', type: '茶餐廳', is_open: true, is_popular: true, image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBKysVdRu-UIJ9uII_0_S0T9J73pVJ1yInCdwmiT5MDMfKo6n4TMjyJMlBitdO9B6ikq94iWcFA8uS5ETUf6eh9ZDSD6JPuRmMxIPr00LuuuAUApHF2h1jtDfKpg_ShkMXjhVqAG_dT45ambf-TRyQXB9Ye59i_OOpa2u86uW_jj0pmaycHhBeXXp5LhgiIShrMZSYM6hlur3anrVPLy3gA9AAA-75Smx0QId25zz7y9qqpKu7HvEdTstbvYB-nsZd69gp-RvXreM' },
  { name: '譚仔雲南米線', rating: 4.2, distance: '0.3 km', type: '米線', is_open: true, is_popular: true, image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsRxTo05jjs_LePE75iCFHwYuvVAYmXuj0clVjhlYj5-3tONVH0f5jcCQWioDU78wwCI9pypZo78TWrwKq-1pK6ezuySE7E806YNVNF0kuaYvRBYN-cPc8xaAqPfX4E2BvCD5GAnOi8olQO_HfvRGvEgTh1XqxxgFKnp3Nxjv-UVLmoUenFJ4ja0teULxjSXuxTM1NK8SKouSrsmi_M46Rmtkiyp7TydwzBbnq4EOOGCALPryF5wafOv83kpUPy4Owmyd_3jZoWik' },
  { name: '壽司郎', rating: 4.8, distance: '0.5 km', type: '日本野', is_open: false, is_popular: true, image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnSBjp-NLRY0TwCQYHXydZEPaEXsDA62_T-dDHST20FF_SdqX5skzD08QaBJycERmIpesFlx6uxIWoSgANX-jWE4m1dkoMhfun3dw4WbtoHkrO_rQs4WS-RRL1Fpeo4DDyZzVtzQRlsrklUz4yS7ATjhnRmkGYhXI9lb2K36cwINcfLwSUPBgn-5WrX5MjipcHBnhaK3m4nL3_sJCoXL_jLULiOgNL8yR60rGVojE0OSCdayjAYHWqhNvzCJwNW54eE9nP8LioZOY' }
];

async function seed() {
  console.log('--- 🚀 開始數據強制更新 ---');

  // 1. 先清空舊數據 (注意順序：先刪除餐廳，再刪除類別)
  console.log('正在清空舊數據...');
  await supabase.from('restaurants').delete().neq('name', '');
  await supabase.from('categories').delete().neq('name', '');

  // 2. 導入類別
  console.log('正在導入類別...');
  const { data: catData, error: catError } = await supabase
    .from('categories')
    .insert(CATEGORIES)
    .select();

  if (catError) {
    console.error('❌ 類別失敗:', catError.message);
    return;
  }
  console.log('✅ 類別已更新');

  // 3. 匹配 ID 並導入餐廳
  const restaurantsToInsert = RESTAURANTS.map(res => {
    const matchedCategory = catData.find(c => c.name === res.type);
    return {
      name: res.name,
      rating: res.rating,
      distance: res.distance,
      is_open: res.is_open,
      is_popular: res.is_popular,
      image_url: res.image_url,
      category_id: matchedCategory?.id
    };
  });

  const { error: resError } = await supabase
    .from('restaurants')
    .insert(restaurantsToInsert);

  if (resError) {
    console.error('❌ 餐廳失敗:', resError.message);
  } else {
    console.log('🎉 數據已全部成功導入！請去 Supabase 看看。');
  }
}

seed();