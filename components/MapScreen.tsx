import React, { useMemo, useState, useEffect, useRef } from 'react';
import { RESTAURANTS, IMAGES } from '../constants';
import { DishResult, Restaurant } from '../types';
import { findNearbyRestaurants } from '../services/ai';

interface MapScreenProps {
  result: DishResult | null;
  onBack: () => void;
}

const MapScreen: React.FC<MapScreenProps> = ({ result, onBack }) => {
  const [isSearching, setIsSearching] = useState(true);
  const [loadingText, setLoadingText] = useState('定位緊你嘅位置...');
  const [foundRestaurants, setFoundRestaurants] = useState<Restaurant[]>([]);
  const [locationError, setLocationError] = useState(false);
  
  // Bottom Sheet State
  const [isExpanded, setIsExpanded] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const startHeight = useRef(0);
  const isDragging = useRef(false);

  // Height Config
  const MIN_HEIGHT_PERCENT = 40;
  const MAX_HEIGHT_PERCENT = 88;
  
  // Default values
  const searchKeyword = result?.search_keyword || '美食';
  const categoryName = result?.category || '所有';
  const dishName = result?.dish_name || '好野食';

  const triggerHaptic = () => {
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }
  };

  // Open external Google Maps
  const handleOpenGoogleMaps = (overrideKeyword?: string) => {
    triggerHaptic();
    const query = encodeURIComponent(`${overrideKeyword || searchKeyword} 附近`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };
  
  const handleBack = () => {
    triggerHaptic();
    onBack();
  };

  // Drag Handlers (Pointer Events for Touch + Mouse support)
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    touchStartY.current = e.clientY;
    
    // Capture pointer to track movement outside element
    (e.target as Element).setPointerCapture(e.pointerId);
    
    if (sheetRef.current) {
        startHeight.current = sheetRef.current.offsetHeight;
        // Disable transition for direct 1:1 movement
        sheetRef.current.style.transition = 'none';
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !sheetRef.current) return;
    
    const currentY = e.clientY;
    const delta = touchStartY.current - currentY; // Dragging up = positive delta
    
    let newHeight = startHeight.current + delta;
    
    // Constraints with resistance
    const maxPx = window.innerHeight * (MAX_HEIGHT_PERCENT / 100);
    const minPx = window.innerHeight * (MIN_HEIGHT_PERCENT / 100);
    
    if (newHeight > maxPx) newHeight = maxPx + (newHeight - maxPx) * 0.2;
    if (newHeight < minPx) newHeight = minPx - (minPx - newHeight) * 0.2;
    
    sheetRef.current.style.height = `${newHeight}px`;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    (e.target as Element).releasePointerCapture(e.pointerId);

    if (!sheetRef.current) return;
    
    // Restore transition for snap animation
    sheetRef.current.style.transition = 'height 0.5s cubic-bezier(0.32, 0.72, 0, 1)';
    
    const currentH = sheetRef.current.offsetHeight;
    const maxPx = window.innerHeight * (MAX_HEIGHT_PERCENT / 100);
    const minPx = window.innerHeight * (MIN_HEIGHT_PERCENT / 100);
    const threshold = (maxPx - minPx) * 0.25; // Snap threshold
    
    // Logic: If dragged significantly towards opposite state, switch.
    // Otherwise revert to current state.
    
    if (isExpanded) {
        // Currently expanded, check if we should collapse
        if (currentH < maxPx - threshold) {
            setIsExpanded(false);
        } else {
            // Revert to expanded
            sheetRef.current.style.height = `${MAX_HEIGHT_PERCENT}%`;
        }
    } else {
        // Currently collapsed, check if we should expand
        if (currentH > minPx + threshold) {
             setIsExpanded(true);
        } else {
             // Revert to collapsed
             sheetRef.current.style.height = `${MIN_HEIGHT_PERCENT}%`;
        }
    }
  };

  // Sync state with style height whenever isExpanded changes
  useEffect(() => {
     if (sheetRef.current && !isDragging.current) {
         sheetRef.current.style.height = isExpanded ? `${MAX_HEIGHT_PERCENT}%` : `${MIN_HEIGHT_PERCENT}%`;
     }
  }, [isExpanded]);

  // On mount, try to get location
  useEffect(() => {
    let isMounted = true;

    const fetchRestaurants = async (lat: number, lng: number) => {
       if (!isMounted) return;
       setLoadingText(`搜尋緊附近嘅${dishName}...`);
       
       try {
         const places = await findNearbyRestaurants(searchKeyword, lat, lng);
         if (isMounted) {
           if (places.length > 0) {
             setFoundRestaurants(places);
           } else {
             setLocationError(true); 
           }
         }
       } catch (e) {
         console.error(e);
         if (isMounted) setLocationError(true);
       } finally {
         if (isMounted) setIsSearching(false);
       }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchRestaurants(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn("Geolocation denied or failed", error);
          if (isMounted) {
            setLocationError(true);
            setIsSearching(false);
          }
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      if (isMounted) {
        setLocationError(true);
        setIsSearching(false);
      }
    }

    return () => { isMounted = false; };
  }, [searchKeyword, dishName]);

  // Combine Real Data with Fallback/Mock Data
  const displayRestaurants = useMemo(() => {
    if (foundRestaurants.length > 0) return foundRestaurants;
    const strictMatches = RESTAURANTS.filter(r => r.type.includes(categoryName) || categoryName.includes(r.type));
    if (strictMatches.length > 0) return strictMatches;
    
    const mockRestaurants: Restaurant[] = [
      {
        id: 'mock-1',
        name: `${dishName}專門店`,
        rating: 4.3,
        distance: '0.4 km',
        type: categoryName,
        isOpen: true,
        isPopular: true,
        tags: [{ text: '推介', bg: 'bg-green-100', color: 'text-green-700' }],
        image: IMAGES.RESULT_FOOD
      },
      {
        id: 'mock-2',
        name: `陳記${categoryName}`,
        rating: 4.0,
        distance: '1.1 km',
        type: categoryName,
        isOpen: true,
        isPopular: false,
        tags: [{ text: '平民食堂', bg: 'bg-gray-100', color: 'text-gray-700' }],
        image: IMAGES.RESULT_FOOD
      }
    ];
    return mockRestaurants;
  }, [foundRestaurants, categoryName, dishName]);

  return (
    <div className="relative h-full w-full flex flex-col bg-background-light dark:bg-background-dark overflow-hidden">
      {/* Map Background Layer */}
      <div className="absolute top-0 left-0 w-full h-[65%] bg-gray-200 z-0 overflow-hidden group">
        <div 
          className="w-full h-full bg-cover bg-center map-texture transition-transform duration-[3s] ease-in-out scale-100 group-hover:scale-105" 
          style={{ backgroundImage: `url('${IMAGES.MAP_BG}')` }}
        />
        
        {/* Header (Floating) */}
        <div className="absolute top-0 left-0 w-full p-4 pt-12 flex items-center justify-between z-10 pointer-events-none">
          <button 
            onClick={handleBack}
            className="pointer-events-auto bg-white dark:bg-gray-800 text-black dark:text-white rounded-full h-12 w-12 flex items-center justify-center shadow-soft hover:bg-gray-50 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          
          {/* Status Bar */}
          <div className="pointer-events-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-5 py-3 rounded-full shadow-soft flex items-center gap-2 mx-auto animate-in fade-in slide-in-from-top-4 duration-500">
             {isSearching ? (
                 <>
                   <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                   <span className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate max-w-[200px]">
                     {loadingText}
                   </span>
                 </>
             ) : (
                 <span className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate max-w-[200px]">
                    {locationError ? `無法定位 (顯示推薦)` : `附近有 ${searchKeyword}！`}
                 </span>
             )}
          </div>
          <div className="w-12"></div> 
        </div>

        {/* Dynamic Pins */}
        {!isSearching && (
          <>
            {/* User Pin */}
            {!locationError && (
                <div className="absolute top-[55%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20">
                <div className="w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg pulse-ring relative">
                    <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-75"></div>
                </div>
                </div>
            )}

            {/* Result Pins */}
            {displayRestaurants.slice(0, 2).map((place, index) => (
                <div 
                    key={place.id}
                    onClick={() => triggerHaptic()}
                    className={`absolute flex flex-col items-center cursor-pointer hover:scale-110 transition-transform z-10 animate-in zoom-in duration-300 ${index === 0 ? 'top-[30%] left-[30%]' : 'top-[40%] left-[75%]'}`}
                    style={{ animationDelay: `${100 + index * 200}ms` }}
                >
                    <div className="bg-white dark:bg-gray-800 text-[#111814] dark:text-white px-3 py-1.5 rounded-full mb-1 text-xs font-bold shadow-md whitespace-nowrap flex items-center gap-1">
                        <span className="max-w-[100px] truncate">{place.name}</span>
                        <span className="text-yellow-500 text-[10px]">★ {place.rating.toFixed(1)}</span>
                    </div>
                    <div className="bg-white p-0.5 rounded-full shadow-lg">
                        <div className="bg-primary rounded-full h-8 w-8 flex items-center justify-center border-2 border-white">
                        <span className="material-symbols-outlined text-[#111814] text-sm">restaurant</span>
                        </div>
                    </div>
                    <div className="h-2 w-2 bg-primary rotate-45 -mt-1 border-r border-b border-white"></div>
                </div>
            ))}
          </>
        )}
      </div>

      {/* Bottom Sheet List - Expandable with Drag - Desktop friendly width */}
      <div 
        ref={sheetRef}
        className="absolute bottom-0 left-0 right-0 mx-auto max-w-md w-full bg-white dark:bg-background-dark rounded-t-[2.5rem] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] z-30 flex flex-col will-change-transform"
        style={{ height: `${MIN_HEIGHT_PERCENT}%`, transition: 'height 0.5s cubic-bezier(0.32, 0.72, 0, 1)' }}
      >
        {/* Handle / Touch Area - Area increased for better touch target */}
        <div 
          className="w-full flex flex-col items-center pt-4 pb-2 flex-shrink-0 cursor-grab active:cursor-grabbing hover:bg-gray-50 dark:hover:bg-white/5 transition-colors rounded-t-[2.5rem] select-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="h-1.5 w-12 rounded-full bg-gray-300/80 dark:bg-gray-600 mb-2"></div>
        </div>
        
        {/* List Header */}
        <div 
            className="px-6 pb-2 flex-shrink-0 flex items-center justify-between select-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onClick={() => setIsExpanded(!isExpanded)}
        >
          <div>
              <h3 className="text-[#111814] dark:text-white tracking-tight text-xl font-extrabold leading-tight">
                {isSearching ? '搜尋中...' : `搵到 ${displayRestaurants.length} 間相關`}
              </h3>
              <p className="text-xs text-gray-400 font-bold mt-0.5">根據「{searchKeyword}」搜尋</p>
          </div>
          
          <button 
             onClick={(e) => { e.stopPropagation(); handleOpenGoogleMaps(); }}
             className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all px-4 py-2 rounded-full flex items-center gap-1 shadow-lg shadow-blue-200 dark:shadow-none"
          >
             <span>Google Maps</span> 
             <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </button>
        </div>
        
        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-20 pt-2 no-scrollbar scroll-smooth overscroll-contain">
          {isSearching ? (
             // Loading Skeleton
             <div className="animate-pulse space-y-3">
               {[1, 2, 3].map(i => (
                 <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-[2rem]"></div>
               ))}
             </div>
          ) : (
              displayRestaurants.map((place) => (
                <div key={place.id} className={`mb-3 w-full rounded-[2rem] p-3 flex items-center border shadow-sm relative overflow-hidden group transition-transform active:scale-[0.98]
                  ${place.isPopular 
                    ? 'bg-background-light dark:bg-gray-800/50 border-primary/20' 
                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700/50'
                  }`}>
                  
                  <div 
                    className={`h-20 w-20 shrink-0 rounded-[1.5rem] bg-gray-200 bg-cover bg-center ${!place.isOpen ? 'grayscale opacity-80' : ''}`}
                    style={{ backgroundImage: `url('${place.image || IMAGES.RESULT_FOOD}')` }}
                  />
                  
                  <div className={`ml-3 flex-1 min-w-0 ${place.isPopular ? 'pr-2' : 'pr-2'}`}>
                    <div className="flex items-baseline justify-between mb-0.5">
                      <h4 className={`font-bold text-lg dark:text-white truncate ${!place.isOpen ? 'text-gray-500 dark:text-gray-400' : ''}`}>
                        {place.name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center bg-white dark:bg-gray-700 px-1.5 py-0.5 rounded-md shadow-sm">
                        <span className="material-symbols-outlined text-yellow-400 text-[14px] fill-current">star</span>
                        <span className="text-xs font-bold ml-1">{place.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{place.distance} • {place.type}</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {place.tags.map((tag, i) => (
                        <span key={i} className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${tag.bg} ${tag.color}`}>
                          {tag.text}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => handleOpenGoogleMaps(place.name)}
                    className="h-10 w-10 shrink-0 bg-gray-100 dark:bg-gray-700 hover:bg-primary hover:text-[#111814] transition-colors rounded-full flex items-center justify-center text-gray-800 dark:text-gray-200"
                  >
                     <span className="material-symbols-outlined text-[20px]">directions</span>
                  </button>
                </div>
              ))
          )}
          {/* Bottom padding to ensure last item is visible above safe area/navigation */}
          <div className="h-12 w-full flex items-center justify-center text-gray-300 text-xs font-bold uppercase tracking-widest">
            {displayRestaurants.length > 0 && "- End -"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapScreen;