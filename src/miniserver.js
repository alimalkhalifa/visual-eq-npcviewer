const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')

let races = []

fs.readdir('graphics/characters', (err, files) => {
  if (err) throw new Error(err)
  races = files.map(value => {
    return path.basename(value).substr(0, path.basename(value).indexOf(path.extname(value)))
  })
})
app.get('/races/:racename', (req, res) => {
  fs.readdir(path.join('graphics', 'characters', 'textures'), (err, files) => {
    fs.readFile(path.join('graphics', 'characters', `${req.params.racename}.glb`), (err, data) => {
      if (err) throw new Error(err)
      const buf = Buffer.from(data)
      const jsonBufSize = buf.readUInt32LE(12)
      const jsonString = buf.toString('utf8', 20, jsonBufSize + 20)
      const gltf = JSON.parse(jsonString)
      const images = gltf.images
      const imgs = images.map(img => {
        return path.basename(img.uri)
      })
      let maxHelm = 0
      gltf.nodes.forEach(node => {
        if (node.name.substr(3, 2) === "HE") {
          if (parseInt(node.name.substr(5, 2)) > maxHelm) {
            maxHelm = parseInt(node.name.substr(5, 2))
          }
        }
      })
      let imageSpecs = {}
      imgs.forEach(img => {
        let raceFile = img.indexOf(req.params.racename.toLowerCase()) !== -1
        console.log(img)
        console.log(raceFile)
        let alpha = img.indexOf('alpha') !== -1
        console.log(img.substr(alpha ? img.length - 11 : img.length - 5, 1))
        let partFiles = files.filter(value => value.substr(0, raceFile ? 5 : 3) == img.substr(0, raceFile ? 5 : 3) && value.substr(alpha ? value.length - 11 : value.length - 5, 1) === img.substr(alpha ? img.length - 11 : img.length - 5, 1) && (alpha ? value.indexOf('alpha') !== -1 : value.indexOf('alpha') === -1))
        console.log(partFiles)
        let maxTexture = 0
        let maxFace = 0
        partFiles.forEach(file => {
          if (parseInt(file.substr(5, 2)) > maxTexture) {
            maxTexture = parseInt(file.substr(5, 2))
          }
          if (img.substr(3, 2) === "he" && parseInt(file.substr(7, 1)) > maxFace) {
            maxFace = parseInt(file.substr(7, 1))
          }
        })
        imageSpecs[img] = {
          ...(img.substr(3,2) === "he" ? {maxFace} : {}),
          maxTexture
        }
      })
      let keys = Object.keys(imageSpecs)
      console.log(keys)
      let he = keys.filter(value => value.indexOf('he0001', 3) !== -1)[0]
      let lg = keys.filter(value => value.indexOf('lg0001', 3) !== -1)[0]
      let modelSpec = {
        maxFace: he ? imageSpecs[he].maxFace : 0,
        maxHelm,
        maxTexture: lg ? imageSpecs[lg].maxTexture : he ? he + 1 < keys.length ? he + 1 : he - 1 : imageSpecs[0].maxTexture,
        imageSpecs
      }
      console.log(imageSpecs)
      res.send(modelSpec)
    })
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