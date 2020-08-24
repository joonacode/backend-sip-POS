require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const routes = require('./src/routes')
const PORT = process.env.PORT || 5050

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())
app.use(cors())
app.use(morgan('dev'))
app.use('/api/v1/', routes)
app.use('/uploads', express.static('./uploads'))
app.use((req, res) => {
  res.status(404).json({
    success: false,
    status_code: 404,
    message: 'Page not found'
  })
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
