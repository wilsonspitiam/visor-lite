'use strict'

const express = require('express')
const path = require('path')
// const bigquery = require('./src/js/bigquery')

const app = express()

app.use(express.static(path.resolve(path.join(__dirname, '/dist'))))

app.get('/', (req, res) => {
  console.log('Entro al server')
  // bigquery.main()
  res.sendfile('index.html')
})

const PORT = process.env.PORT || 9000
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
  console.log('Press Ctrl+C to quit.')
})

