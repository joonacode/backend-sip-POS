require('dotenv').config()
const nodemailer = require('nodemailer')
// const baseUrl = `http://localhost:${process.env.PORT}/api/v1`
const redis = require('redis')
module.exports = {
  response: (res, results, status, message, links, error) => {
    const resJson = {}
    if (links) {
      resJson.total = links.total
      resJson.per_page = links.per_page
      resJson.count = links.count
      resJson.current_page = links.current_page
      resJson.total_pages = links.total_pages
      resJson._links = links._links
    }
    resJson.success = !error
    resJson.status_code = status
    if (error) {
      resJson.error = error || null
    }
    if (message) {
      resJson.message = message
    }
    resJson.results = results

    return res.status(status).json(resJson)
  },
  status: {
    found: 'Data found',
    insert: 'Data successfully added',
    update: 'Data successfully updated',
    delete: 'Data successfully deleted'
  },
  links: (limit, start, total, count) => {
    const last = Math.ceil(total / limit)
    const numStart = Number(start) === 0 ? 1 : Number(start)
    const result = {
      per_page: limit,
      count: count,
      total: total,
      current_page: numStart,
      total_pages: last,
      _links: {
        self: numStart,
        next: count < limit || numStart === last ? null : numStart + 1,
        prev: numStart === 0 || numStart === 1 ? null : numStart - 1,
        first: numStart === 1 ? null : 1,
        last: numStart === last ? null : last
      }
    }
    return result
  },
  errors: {
    notFound: {
      code: 'ERR_NOT_FOUND',
      statusCode: 404,
      sqlMessage: 'Data Not Found'
    },
    checkStatusCode: (errorCode) => {
      const errorCodes = Number(errorCode)
      if (errorCodes === 1048 || errorCodes === 1366) {
        return 400
      } else if (errorCodes === 1146 || errorCodes === 1054 || errorCodes === 1051) {
        return 500
      } else {
        return 400
      }
    }
  },
  redisInstance: () => {
    const client = redis.createClient(process.env.PORT_REDIS)
    return client
  },
  transporter: (mailinfo, cb) => {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.PASS_USER
      }
    });
    transporter.sendMail(mailinfo, (error, info) => {
      if (error) {
        console.log(error)
        this.response(res, [], 400, null, null, ['email failed to send'])
      } else {
        return cb()
      }
    })
  },
  formatNumber: (number) => {
    const reverse = number.toString().split('').reverse().join('')
    const ribuan = reverse.match(/\d{1,3}/g);
    const result = ribuan.join('.').split('').reverse().join('');
    return result
  }
}