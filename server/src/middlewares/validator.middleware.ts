/* eslint-disable */
// @ts-nocheck

const validateSchema = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body)
    return next()
  } catch (error) {
    console.log('error.errors:', error.errors)
    return res.status(400).json(error.errors.map((e) => e.message))
  }
}

export default validateSchema
