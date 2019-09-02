import React from 'react'
import NpcViewer from './NpcViewer'
import InfoBox from './InfoBox'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      race: 'ORC',
      modelSpecs: {},
      texture: 0,
      helm: 0,
      face: 0,
      body: 0,
      distance: 10
    }
    this.getModelSpecs('ORC')
    this.changeRace = this.changeRace.bind(this)
    this.changeTexture = this.changeTexture.bind(this)
    this.changeHelm = this.changeHelm.bind(this)
    this.changeFace = this.changeFace.bind(this)
    this.changeBody = this.changeBody.bind(this)
    this.changeDistance = this.changeDistance.bind(this)
  }
  render() {
    return (
      <div id="container" style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        width: '100%'
      }}>
        <NpcViewer race={this.state.race} helm={this.state.helm} texture={this.state.texture} face={this.state.face} modelSpecs={this.state.modelSpecs} distance={this.state.distance} />
        <InfoBox changeRace={this.changeRace}
          changeTexture={this.changeTexture}
          changeHelm={this.changeHelm}
          changeFace={this.changeFace}
          changeBody={this.changeBody}
          changeDistance={this.changeDistance}
          race={this.state.race} helm={this.state.helm}
          texture={this.state.texture} face={this.state.face}
          body={this.state.body} distance={this.state.distance}
          modelSpecs={this.state.modelSpecs}
        />
      </div>
    )
  }
  changeRace(event) {
    this.setState({ 
      race: event.target.value,
      texture: 0,
      face: 0,
      helm: 0
    })
    this.getModelSpecs(event.target.value)
  }
  changeTexture(event) {
    let texture = parseInt(event.target.value)
    if (this.state.body) {
      if (texture <  10) texture = 10
      if (texture > this.state.modelSpecs.maxBodyTexture) texture = this.state.modelSpecs.maxBodyTexture
    } else {
      if (texture < 0) texture = 0
      if (texture > this.state.modelSpecs.maxTexture) texture = this.state.modelSpecs.maxTexture
    }
    this.setState({ texture })
  }
  changeHelm(event) {
    let helm = parseInt(event.target.value)
    if (helm < 0) helm = 0
    if (helm > this.state.modelSpecs.maxHelm) helm = this.state.modelSpecs.maxHelm
    this.setState({ helm })
  }
  changeFace(event) {
    let face = parseInt(event.target.value)
    if (face < 0) face = 0
    if (face > this.state.modelSpecs.maxFace) face = this.state.modelSpecs.maxFace
    this.setState({ face })
  }
  changeBody(event) {
    let body = parseInt(event.target.value)
    if (body < 0) body = 0
    if (body > this.state.modelSpecs.maxBody) body = this.state.modelSpecs.maxBody
    let texture = body === 0 ? 0 : 10
    this.setState({ body, texture })
  }
  changeDistance(event) {
    let distance = parseInt(event.target.value)
    if (distance < 0) disitance = 0
    this.setState({ distance })
  }
  getModelSpecs(race) {
    fetch(`races/${race}`).then(res => {
      return res.json()
    }).then(modelSpecs => {
      this.setState({ modelSpecs })
    })
  }
}

export default App