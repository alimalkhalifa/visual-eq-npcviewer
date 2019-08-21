let express = require('express')
let app = express()
let fs = require('fs')
let path = require('path')

let races = []

fs.readdir('graphics/characters', (err, files) => {
  if (err) throw new Error(err)
  races = files.map(value => {
    return path.basename(value).substr(0, path.basename(value).indexOf(path.extname(value)))
  })
})
app.get('/races', (req, res) => {
  res.send(races)
})

app.use('/graphics', express.static('graphics'))
app.use('/', express.static('dist'))

app.listen(1234, () => {
  console.log('Listening on port 1234')
})