require('dotenv').config()
const baseUrl = `http://localhost:${process.env.PORT}/api/v1`
module.exports = {
  response: (res, results, status, message, links, error) => {
    const resJson = {}
    if (links) {
      resJson.total = links.total
      resJson.per_page = links.per_page
      resJson.count = links.count
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
    const numStart = Number(start)
    const result = {
      per_page: limit,
      count: count,
      total: total,
      total_pages: last,
      _links: {
        self: `${baseUrl}/product?limit=${limit}&start=${start}`,
        next: count < limit ? null : `${baseUrl}/product?limit=${limit}&start=${numStart + 1}`,
        prev: start === 0 || start === 1 ? null : `${baseUrl}/product?limit=${limit}&start=${start - 1}`,
        first: `${baseUrl}/product?limit=${limit}&start=1`,
        last: `${baseUrl}/product?limit=${limit}&start=${last}`
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
  }

}
