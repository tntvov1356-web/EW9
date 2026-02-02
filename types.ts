export type ScreenName = 'home' | 'filter' | 'result' | 'map';

export interface Category {
  id: string;
  name: string;
  icon: string;
  bg: string;
}

export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  distance: string;
  type: string;
  isOpen: boolean;
  isPopular: boolean;
  statusText?: string;
  tags: { text: string; bg: string; color: string }[];
  image: string;
}

export interface DishResult {
  dish_id: string;
  dish_name: string;
  category: string;
  image_tag: string;
  search_keyword: string;
}