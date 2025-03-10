require('dotenv').config()
// Connect db
const { connectDB } = require('./untils/db')
connectDB()

const express = require('express')
const cors = require('cors')
const app = express()
const upload = require('./untils/multer')
const productsRouter = require('./routers/productsRoute')
const authRouter = require('./routers/authRoute')
const userRouter = require('./routers/userRoute')
const ordersRouter = require('./routers/ordersRoute')
const codeRouter = require('./routers/codeRoute')
const tnRouter = require('./routers/tnRoute')
const postRouter = require('./routers/postRoute')
const bankRouter =require('./routers/bankRoute')
const revenueRoutes = require('./routers/revenueRoutes');
// Cors
var corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3006',
    'http://localhost:5000',
  ],
  optionsSuccessStatus: 200 // For legacy browser support
}
app.use(cors(corsOptions))
//body parse
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//Mount the router
app.use('/api/products', upload.array('image'), productsRouter)
app.use('/api/auth', authRouter)
app.use('/api/user', upload.array('userImage'), userRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/code', codeRouter)
app.use('/api/tn', tnRouter)
app.use('/api/post', upload.array('postImage'), postRouter)
app.use('/api',bankRouter)
app.use('/api/revenue', revenueRoutes);

// Not found router
app.use('*', function (req, res, next) {
  console.log('not found')
})
port = process.env.APP_PORT || 5000
app.listen(port, () => {
  console.log(`server running is port ${port}`)
})
