import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import contactRouter from './routes/contactRoute.js'
import adminRouter from './routes/adminRoute.js'
import categoryRouter from './routes/categoryRoute.js'
import refreshRouter from './routes/refreshRoute.js'
import logoutRouter from './routes/logoutRoute.js'
import newsletterRouter from './routes/newsletterRoute.js' 
import blogRoutes from './routes/blogRoute.js'

// App Config

const app = express()
const port = process.env.PORT || 4000
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  process.env.ADMIN_URL || 'http://localhost:5174',
];
connectDB()
connectCloudinary()

// Middlewares
app.use(express.json())
app.use(cors({
  origin: function (origin, callback) {
    console.log("🌐 Request origin:", origin);
    if (!origin) return callback(null, true); 
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log("❌ Blocked:", origin);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(cookieParser())

app.use('/api/blogs', blogRoutes)

app.use('/api/newsletter', newsletterRouter) 
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/contact', contactRouter)
app.use('/api/refresh', refreshRouter)
app.use('/api/admin', adminRouter)
app.use('/api/category', categoryRouter)
app.use('/api/logout', logoutRouter)

app.get('/', (req, res) => {
    res.send("API Working")
})

app.listen(port, () => console.log('Server started on PORT : ' + port))