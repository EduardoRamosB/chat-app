import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const connectDB = async () => {
  const user = process.env.DB_USER
  const password = process.env.DB_PASSWORD
  const name = process.env.DB_TEST_NAME

  try {
    await mongoose.connect(`mongodb://${user}:${password}@localhost/${name}?authSource=admin`)
    console.log(`Connected to ${name} DB`)
  } catch (error) {
    console.log('Error connecting to MongoDB:', error)
  }
}

export default connectDB
