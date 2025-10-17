import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { useEffect, useState } from "react";

const SimpleSwiper = ({
  items = [],
  renderItem,
  slidesPerView = 4,
  responsiveConfig = { mobile: 1, tablet: 2, desktop: 4 }
}) => {
  // Responsive slidesPerView detection
  const getSlidesPerView = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 641) return responsiveConfig.mobile || 1;
      if (window.innerWidth < 1025) return responsiveConfig.tablet || 2;
      return responsiveConfig.desktop || 4;
    }
    return slidesPerView;
  };

  const [currentSlidesPerView, setCurrentSlidesPerView] = useState(getSlidesPerView());

  useEffect(() => {
    const handleResize = () => setCurrentSlidesPerView(getSlidesPerView());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Always call useKeenSlider, but only use the instance if needed
  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    slides: {
      perView: slidesPerView,
      spacing: 16,
    },
    breakpoints: {
      "(max-width: 640px)": {
        slides: { perView: responsiveConfig.mobile, spacing: 8 }
      },
      "(min-width: 641px) and (max-width: 1024px)": {
        slides: { perView: responsiveConfig.tablet, spacing: 12 }
      },
      "(min-width: 1025px)": {
        slides: { perView: responsiveConfig.desktop, spacing: 16 }
      },
    },
  });

  if (!items || items.length === 0) return null;

  // Only show swiper if items > slidesPerView for current screen
  const shouldShowSwiper = items.length > currentSlidesPerView;

  if (!shouldShowSwiper) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4`}>
        {items.map((item, idx) => (
          <div key={item._id || item.id || idx}>
            {renderItem(item)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Prev Button */}
      <button
        onClick={() => slider.current?.prev()}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 hover:bg-gray-100 transition"
        aria-label="Previous"
        type="button"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      {/* Slider */}
      <div ref={sliderRef} className="keen-slider">
        {items.map((item, idx) => (
          <div className="keen-slider__slide p-1" key={item._id || item.id || idx}>
            {renderItem(item)}
          </div>
        ))}
      </div>
      {/* Next Button */}
      <button
        onClick={() => slider.current?.next()}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 hover:bg-gray-100 transition"
        aria-label="Next"
        type="button"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default SimpleSwiper;