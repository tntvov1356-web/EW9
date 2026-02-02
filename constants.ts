import { Category, Restaurant } from './types';

export const CATEGORIES: Category[] = [
  { id: '1', name: '茶餐廳', icon: 'local_cafe', bg: 'bg-[#FFD1BA]' },
  { id: '2', name: '米線', icon: 'ramen_dining', bg: 'bg-[#FFF5BA]' },
  { id: '3', name: '日本野', icon: 'set_meal', bg: 'bg-primary' },
  { id: '4', name: '打邊爐', icon: 'soup_kitchen', bg: 'bg-[#ffc0cb]' },
  { id: '5', name: '飲茶', icon: 'tapas', bg: 'bg-[#E6E6FA]' },
  { id: '6', name: '快餐', icon: 'fastfood', bg: 'bg-[#dbeafe]' },
  { id: '7', name: '泰國菜', icon: 'local_fire_department', bg: 'bg-[#FFE4E1]' },
  { id: '8', name: '燒肉', icon: 'outdoor_grill', bg: 'bg-[#dcfce7]' },
  { id: '9', name: '糖水', icon: 'icecream', bg: 'bg-[#FFFACD]' },
];

export const RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: '澳洲牛奶公司',
    rating: 4.5,
    distance: '0.1 km',
    type: '茶餐廳',
    isOpen: true,
    isPopular: true,
    tags: [
      { text: '光速餐', bg: 'bg-yellow-100', color: 'text-yellow-700' },
      { text: '炒蛋', bg: 'bg-orange-100', color: 'text-orange-700' }
    ],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBKysVdRu-UIJ9uII_0_S0T9J73pVJ1yInCdwmiT5MDMfKo6n4TMjyJMlBitdO9B6ikq94iWcFA8uS5ETUf6eh9ZDSD6JPuRmMxIPr00LuuuAUApHF2h1jtDfKpg_ShkMXjhVqAG_dT45ambf-TRyQXB9Ye59i_OOpa2u86uW_jj0pmaycHhBeXXp5LhgiIShrMZSYM6hlur3anrVPLy3gA9AAA-75Smx0QId25zz7y9qqpKu7HvEdTstbvYB-nsZd69gp-RvXreM'
  },
  {
    id: '2',
    name: '譚仔雲南米線',
    rating: 4.2,
    distance: '0.3 km',
    type: '米線',
    isOpen: true,
    isPopular: true,
    tags: [
      { text: '墨丸腩肉', bg: 'bg-red-100', color: 'text-red-700' }
    ],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsRxTo05jjs_LePE75iCFHwYuvVAYmXuj0clVjhlYj5-3tONVH0f5jcCQWioDU78wwCI9pypZo78TWrwKq-1pK6ezuySE7E806YNVNF0kuaYvRBYN-cPc8xaAqPfX4E2BvCD5GAnOi8olQO_HfvRGvEgTh1XqxxgFKnp3Nxjv-UVLmoUenFJ4ja0teULxjSXuxTM1NK8SKouSrsmi_M46Rmtkiyp7TydwzBbnq4EOOGCALPryF5wafOv83kpUPy4Owmyd_3jZoWik'
  },
  {
    id: '3',
    name: '壽司郎',
    rating: 4.8,
    distance: '0.5 km',
    type: '日本野',
    isOpen: false,
    statusText: '排隊中',
    isPopular: true,
    tags: [
      { text: '需排隊', bg: 'bg-gray-100', color: 'text-gray-600' }
    ],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnSBjp-NLRY0TwCQYHXydZEPaEXsDA62_T-dDHST20FF_SdqX5skzD08QaBJycERmIpesFlx6uxIWoSgANX-jWE4m1dkoMhfun3dw4WbtoHkrO_rQs4WS-RRL1Fpeo4DDyZzVtzQRlsrklUz4yS7ATjhnRmkGYhXI9lb2K36cwINcfLwSUPBgn-5WrX5MjipcHBnhaK3m4nL3_sJCoXL_jLULiOgNL8yR60rGVojE0OSCdayjAYHWqhNvzCJwNW54eE9nP8LioZOY'
  },
  {
    id: '4',
    name: '佳佳甜品',
    rating: 4.6,
    distance: '0.8 km',
    type: '糖水',
    isOpen: true,
    isPopular: true,
    tags: [
      { text: '米芝蓮', bg: 'bg-yellow-100', color: 'text-yellow-700' },
      { text: '芝麻糊', bg: 'bg-stone-100', color: 'text-stone-700' }
    ],
    image: 'https://lh3.googleusercontent.com/p/AF1QipN3-y1t_sZ2yXo0y6y-z4y-z5y-z6y-z7y-z8y' 
  },
  {
    id: '5',
    name: '泰麵',
    rating: 4.4,
    distance: '1.2 km',
    type: '泰國菜',
    isOpen: true,
    isPopular: false,
    tags: [
      { text: '船麵', bg: 'bg-orange-100', color: 'text-orange-700' }
    ],
    image: 'https://lh3.googleusercontent.com/p/AF1QipP9-y1t_sZ2yXo0y6y-z4y-z5y-z6y-z7y-z8y'
  }
];

export const IMAGES = {
  HOME_DOG: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZzYGEAIe9CKrSu5WrScjrNqEIYO9U0eRHPnIw8zFntvJOstGDwsoxmrgz1d6MGEFbH6Vjiow_CrSyv240oEySzQol0gMeuyw7i1AfM8O-tmQpYrv611nL__upvF3MKwN_TNjkLp9cucn8Xz6x6nuSlIqQV76eExAHheZBhrbUj9qLpvUSq2GCo-vD6bx1uk75G6cAumpCUZT9YHpH95qAXl-aVX-czfPri7Odh6oSi4UZ2aUi-n_B6vPVWucJayzbJyiMMtNJgHs',
  HOME_BG: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMUQKqRebfrzCxyDjpC_fhzQWAPo53KWQcetSW5ZHWbW21sqsxznu-1zZCBr7di345D8r3IT0s4hixGg7HGU7SLfqRwl6JqReIftKelayD5IKJkb6WH9NZi3AIuJsomK2QmcR1PO_p1Wk0JzEQwXqpWbPKGWyImgvF3EJ7aaJFlujnNDLMPux4FCzKB7A31QnfwIMJTCPrAV3RO4KmyRg1CBpQtWINTf_T0jRbZo6SSa2T9XW-YwyRLd7Y1m_wE1-JLIKEz5a1-wA',
  RESULT_BG: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD23Fd8mdhBwIfKuNCDcPN24Ffb9YPhpLSNSHBrp5tHoWgMYj6YnxMEM3tAVOofrTjO04XUZMvjE8wdCEy3HCLwnCumK9XPiFWWj3GPcaBssmCK1QTCOr3wZx5iHlP6UDC8HROGKt9DH1kn4s85LfHRKUkGOxRp9GZBtQLFwEGYcbe7kl9wHIHzcxSUggHcfwsVPZs1IrAA7HVUOMHdBvTPI-rYhqcdR0ttzS2G0L1EowUrIeU1VcgVEED8tYcbtTCv6z0PzeaUDeg',
  RESULT_FOOD: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdYZQzxFpcHiP5StFf0i-isI_St-yLosjA69Hm8wYAoJghKWfpmcKcscxKGDrWpagBy4VFo_d_81SxNdMVwaVQ_FvpqhRBudjRFCtWqmIWMcnfW8874KPlBUvYLaT8-ylwx3ohTGnxvBNpcRA5hlhOAKtmjk6obY76UPnzCN2SxFMHHHJ721CO3vxoATw91eSwxaVvdPt9HzleKA1TW_iumSmQfbR2_TtH55hhb9imnQosBS58a6sbvVeYQJLGR0gdhEC91yka9J0',
  MAP_BG: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrfaFmZQJEAtwYkvUlphjZmzdI96yBkJNTU6VqWwLSUSZ6qnGAlwHFe22wEcBMiXyQVxnA3HBBegPQvPrHB5aUklPZTA1f5TLZ5-nGg8lQqX5jEmBMtoSaBCLcB7FZy5508vEUnWAlcZ-GXqdtZotlq2kO3JKwHp23C7_GABLyQy3VOcGTY39_wZWJSy2wrDw_y4kqZFXWclK3AQ8SDc1WTLbpnVpxHUz_HFN1oLPTQivPNKMaHOf8qUBvt44SUL1HdmM69UrAgms'
};