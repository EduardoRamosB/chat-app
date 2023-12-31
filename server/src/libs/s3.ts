import AWS from 'aws-sdk'

const s3 = new AWS.S3({
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
  region: process.env.S3_REGION,
})

export default s3
