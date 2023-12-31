import s3 from '../libs/s3'

interface S3Params {
  Bucket: string | undefined
  Key: string
  Expires: number
  ContentType: string
  ACL: string
}

const getPresignUrlPromise = (s3Params: S3Params) => new Promise<string>((resolve, reject) => {
  const generatePresignedUrl = () => {
    s3.getSignedUrlPromise('putObject', s3Params)
      .then((url) => resolve(url))
      .catch((error) => reject(error))
  }

  generatePresignedUrl()
})

const getPresignedUrl = async (filename: string) => {
  const s3Params: S3Params = {
    Bucket: process.env.S3_BUCKET,
    Key: filename,
    Expires: 120 * 60, // 2 hours
    ContentType: 'image/*',
    ACL: 'public-read',
  }

  const url = await getPresignUrlPromise(s3Params)

  return url
}

export default getPresignedUrl
