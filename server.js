const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 8080
app.use('/', express.static(path.resolve(__dirname)))

app.listen(port, _ => {
  console.log(`Server started at port: ${port} on ${path.resolve(__dirname)}`)
})
