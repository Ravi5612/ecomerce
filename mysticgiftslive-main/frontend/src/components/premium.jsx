import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Premium = () => {
    const navigate = useNavigate();
    const sectionBackgroundImage = assets.premcard1;
    const card1BackgroundImage = assets.premcard2;

    return (
        <div className='my-10'>
            <section className="py-14 md:py-24 bg-[linear-gradient(90deg,#a78bfa,#f472b6,#fde047)] dark:bg-[#0b1727] text-black relative overflow-hidden z-10 border border-white/30 rounded-3xl shadow-2xl backdrop-blur-md">
                <div className="container px-4 mx-auto">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Left Card */}
                        <div className="w-full lg:w-1/2">
                            <div
                                className="group flex flex-col items-start justify-start bg-no-repeat bg-cover bg-center min-h-[400px] rounded-2xl pl-8 pt-8 transition-transform duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
                                style={{ backgroundImage: `url(${sectionBackgroundImage})` }}
                            >
                                <h1 className="text-4xl md:text-[80px] font-bold leading-tight text-pink-600">
                                    check out
                                </h1>
                                <p className="text-3xl md:text-3xl leading-none font-medium mt-2 mb-6">
                                    Up to 50% off
                                </p>
                                <div className="w-full flex justify-start mt-6">
                                    <button
                                        onClick={() => {
                                                navigate("/collection?sale=true");
                                                setTimeout(() => {
                                                    window.scrollTo({ top: 0, behavior: "auto" });
                                                }, 100); // 100ms delay
                                            }}
                                        className="py-3.5 px-9 leading-none bg-white text-pink-600 rounded-lg font-bold group-hover:bg-pink-600 group-hover:text-white transition-colors duration-300"
                                    >
                                        Shop Now
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Card */}
                        <div className="w-full lg:w-1/2">
                            <div
                                className="group flex flex-col justify-end bg-no-repeat bg-cover bg-center min-h-[400px] rounded-2xl p-6 md:p-12 transition-transform duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
                                style={{ backgroundImage: `url(${card1BackgroundImage})` }}
                            >
                                <div className="w-full lg:w-1/2 text-center">
                                    <div className="text-yellow-500 bg-white rounded-lg p-6">
                                        <h2 className="text-3xl font-bold">
                                            Premium <br />
                                            Collection
                                        </h2>
                                    </div>
                                        <div className="w-full flex justify-start mt-6">
                                    <button
                                        onClick={() => {
                                                navigate("/collection?premium=true");
                                                setTimeout(() => {
                                                    window.scrollTo({ top: 0, behavior: "auto" });
                                                }, 100); // 100ms delay
                                            }}
                                        className="py-3.5 px-9 leading-none bg-white text-pink-600 rounded-lg font-bold group-hover:bg-pink-600 group-hover:text-white transition-colors duration-300"
                                        >
                                        Shop Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Premium;