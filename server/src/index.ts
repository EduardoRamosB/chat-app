import dotenv from 'dotenv'
import app from './app'
import connectDB from './config/db'

dotenv.config()

const PORT = 3000

const startServer = async () => {
  try {
    if (process.env.NODE_ENV === 'development') {
      await connectDB()
    }

    app.listen(PORT, () => {
      console.log(`Server running on PORT ${PORT}`)
    })
  } catch (error) {
    console.error('Error starting the server:', error)
  }
}

startServer().catch((error) => {
  console.error('Error starting the server:', error)
})
