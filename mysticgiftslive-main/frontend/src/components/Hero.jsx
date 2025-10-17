import { useEffect, useState, memo } from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom';

// AuroraText Component (unchanged)
export const AuroraText = memo(({
  children,
  className = "",
  colors = ["#FF0080", "#7928CA", "#0070F3", "#38bdf8"],
  speed = 1
}) => {
  const gradientStyle = {
    backgroundImage: `linear-gradient(135deg, ${colors.join(", ")}, ${colors[0]})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animationDuration: `${10 / speed}s`
  };
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="sr-only">{children}</span>
      <span 
        className="relative animate-aurora bg-[length:200%_auto] bg-clip-text text-transparent" 
        style={gradientStyle} 
        aria-hidden="true"
      >
        {children}
      </span>
    </span>
  );
});
AuroraText.displayName = "AuroraText";

// Nature video carousel sources
const natureVideos = [
  assets.video1,
  assets.video2,
  assets.video3
];

// Bento/Masonry grid images
const productImages = [
  assets.hero1,
  assets.hero2,
  assets.hero3
];

const HeroBackground = ({ current }) => {
  return (
    <div className="absolute inset-0 z-0">
      {natureVideos.map((src, idx) => (
        <video
          key={idx}
          className={`hero-video ${current === idx ? "active" : ""}`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={src} type="video/mp4" />
        </video>
      ))}
      <div className="absolute inset-0 bg-black/20"></div>
    </div>
  );
};

const Hero = () => {
  const [current, setCurrent] = useState(0);

  // Auto-slide every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % natureVideos.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="relative overflow-hidden w-full min-h-screen pt-24">
        {/* Video Backgrounds */}
        <HeroBackground current={current} />
        {/* Content Layer */}
        <div className="pb-6 sm:pb-8 lg:pb-10 h-full flex items-center relative z-10"> 
           <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
              {/* Text Content */}
              <div className="sm:max-w-lg z-10">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl drop-shadow-2xl">
                  Take home{" "}
                  <AuroraText 
                    speed={0.8} 
                    colors={["#C084FC", "#F472B6", "#60A5FA", "#A78BFA"]}
                    className="font-bold drop-shadow-lg"
                  >
                    luck, prosperity, and health
                  </AuroraText>
                  {" "}— shop MysticGifts.
                </h1>
                <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-100 drop-shadow-xl font-medium">
                  Discover handcrafted treasures that bring harmony to your home and soul. From copper water bottles to wind chimes and wall hangings, MysticGifts offers timeless{" "}
                  <AuroraText 
                    speed={1.2} 
                    colors={["#FDE047", "#FB923C", "#34D399", "#F87171"]}
                    className="font-bold drop-shadow-lg"
                  >
                    Indian artifacts
                  </AuroraText>
                  {" "}that invite wellness, beauty, and good fortune.
                </p>
                <Link
                  to="/collection"
                  className="mt-8 inline-block rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 text-center font-medium text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  Shop Now
                </Link>
              </div>
              {/* Product Showcase Carousel */}
              <div className="w-full max-w-lg mx-auto lg:mx-0 z-10 flex flex-col items-center">
                <div className="relative w-full aspect-[4/3] bg-white/70 rounded-2xl border border-gray-200 shadow-2xl flex items-center justify-center overflow-hidden">
                  {/* Fade carousel for product images */}
                  {productImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt=""
                      className={`absolute inset-0 w-full h-full object-cover rounded-2xl shadow-xl border border-gray-100 transition-opacity duration-1000 ${idx === current ? "opacity-100" : "opacity-0"}`}
                      style={{ zIndex: idx === current ? 2 : 1 }}
                    />
                  ))}
                </div>
              </div>
              {/* End grid */}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Hero