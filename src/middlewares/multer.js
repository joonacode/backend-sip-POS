var multer = require('multer')
const path = require('path')
const helpers = require('../helpers/helpers')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    const fileName = `${Math.random().toString(32).substring(2)}${path.extname(file.originalname)}`
    cb(null, fileName)
  }
})

const filter = (req, file, cb) => {
  if (file.mimetype !== "image/png" && file.mimetype !== "image/jpg" && file.mimetype !== "image/jpeg") {
    cb(null, false);
    return req.uploadErrorMessage = 'Only image allowed'
  } else {
    cb(null, true);
  }
}

const obj = multer({
  fileFilter: filter,
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024
  }
})

const upload = multer(obj).single('image')

const uploadFile = (req, res, next) => {
  upload(req, res, function (error) {
    if (error) {
      console.log(error)
      if (error.code == 'LIMIT_FILE_SIZE') return helpers.response(res, [], 400, null, null, ['Max file size 2mb'])
      return helpers.response(res, [], 400, null, null, error)
    } else {
      next()
    }
  })
}

module.exports = uploadFile