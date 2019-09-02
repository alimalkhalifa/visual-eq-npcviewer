const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')

let races = []

fs.readdir('graphics/characters', (err, files) => {
  if (err) throw new Error(err)
  races = files.filter(value => value.indexOf('.glb') !== -1).map(value => {
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
      let maxBody = 0
      let bodyImage
      gltf.nodes.forEach(node => {
        if (node.name.substr(3, 2) === "HE") {
          if (parseInt(node.name.substr(5, 2)) > maxHelm) {
            maxHelm = parseInt(node.name.substr(5, 2))
          }
        } else if (node.name.substr(3, 1) === "0") {
          bodyImage = imgs[gltf.materials[gltf.meshes[node.mesh].primitives[0].material].pbrMetallicRoughness.baseColorTexture.index]
          if (parseInt(node.name.substr(3, 2)) > maxBody) {
            maxBody = parseInt(node.name.substr(3, 2))
          }
        }
      })
      let imageSpecs = {}
      imgs.forEach(img => {
        let raceFile = img.indexOf(req.params.racename.toLowerCase()) !== -1
        let alpha = img.indexOf('alpha') !== -1
        let partFiles = files.filter(value => value.substr(0, raceFile ? 5 : 3) == img.substr(0, raceFile ? 5 : 3) && value.substr(alpha ? value.length - 11 : value.length - 5, 1) === img.substr(alpha ? img.length - 11 : img.length - 5, 1) && (alpha ? value.indexOf('alpha') !== -1 : value.indexOf('alpha') === -1))
        let maxTexture = 0
        let maxFace = 0
        partFiles.forEach(file => {
          let startNumbers = partFiles[0].search(/[0-9]/)
          let texture = parseInt(file.substr(startNumbers < 0 ? 0 : startNumbers, 2))
          if (!isNaN(texture) && texture > maxTexture) {
            maxTexture = texture
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
      let basePart = keys.filter(value => value.indexOf(req.params.racename.toLowerCase()) !== -1 && value.indexOf('he', 3) === -1)[0]
      let baseHead = keys.filter(value => value.indexOf(req.params.racename.toLowerCase()) !== -1 && value.indexOf('he', 3) !== -1)[0]
      let modelSpec = {
        maxFace: baseHead ? imageSpecs[baseHead].maxFace : 0,
        maxHelm,
        maxTexture: keys.length > 0 ? basePart ? imageSpecs[basePart].maxTexture : imageSpecs[0].maxTexture : 0,
        maxBodyTexture: bodyImage ? imageSpecs[bodyImage].maxTexture + 6 : 0,
        maxBody,
        imageSpecs
      }
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