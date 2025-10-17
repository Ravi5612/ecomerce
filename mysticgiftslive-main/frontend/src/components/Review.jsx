import Title from "./Title";
import { assets } from "../assets/assets";

const review1 = assets.review1;
const review2 = assets.review2;
const review3 = assets.review3;

const reviewsData = [
    {
        author: {
            fullName: "Olivia Bennett",
            picture: review1,
            Address: "Queensland"
        },
        rating: 5,
        description:
            "Absolutely love the energy these pieces bring to my home. A blend of peace, prosperity, and elegance.",
    },
    {
        author: {
            fullName: "Ethan Riley",
            picture: review2,
            Address: "Melbourne"
        },
        rating: 5,
        description:
            "The copper bottles and wall hangings are not just décor—they radiate warmth and heritage. Truly impressed!",
    },
    {
        author: {
            fullName: "Grace Morgan",
            picture: review3,
            Address: "Brisbane"
        },
        rating: 5,
        description:
            "Each artifact feels like a window into India's soul—rich in tradition and crafted with stunning attention to detail.",
    },
];

const Rating = ({ rating }) => (
    <div className="mb-2 text-yellow-500 text-xl">
        {[...Array(5)].map((_, i) => (
            <span key={i}>
                {i < Math.floor(rating) ? "★" : "☆"}
            </span>
        ))}
    </div>
);

const ReviewItem = ({ review }) => (
    <div className="bg-white/90 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 rounded-2xl shadow-xl transition-shadow duration-300 h-full p-6 hover:shadow-2xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-blue-50 dark:hover:from-slate-700 dark:hover:to-slate-600 cursor-pointer group flex flex-col items-center">
        <img
            src={review.author.picture}
            alt={review.author.fullName}
            className="w-20 h-20 rounded-full mx-auto mb-4 transition-transform duration-300 group-hover:scale-105 border-4 border-purple-100 dark:border-slate-700"
        />
        <h4 className="text-lg font-semibold mb-1 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors duration-300 text-gray-900 dark:text-white">
            {review.author.fullName}
        </h4>
        <span className="text-xs text-gray-500 dark:text-gray-300 mb-2">{review.author.Address}</span>
        <Rating rating={review.rating} />
        <p className="opacity-80 mb-0 group-hover:opacity-100 transition-opacity duration-300 text-center text-gray-700 dark:text-gray-200">{review.description}</p>
    </div>
);

const Reviews = () => {
    return (
        <div className="my-10">
            <div className="text-center py-8 text-3xl">
                <Title text1={'CUSTOMER'} text2={'REVIEWS'} />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Hear from our happy customers! Each review reflects the joy, peace, and positive energy our products bring to their lives.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center pt-6">
                {reviewsData.map((review, i) => (
                    <ReviewItem review={review} key={i} />
                ))}
            </div>
        </div>
    );
};

export default Reviews;