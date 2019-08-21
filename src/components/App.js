import React from 'react'
import NpcViewer from './NpcViewer'
import InfoBox from './InfoBox'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      race: 'ORC',
      texture: 0,
      helm: 0,
      face: 0
    }
    this.changeRace = this.changeRace.bind(this)
    this.changeTexture = this.changeTexture.bind(this)
    this.changeHelm = this.changeHelm.bind(this)
    this.changeFace = this.changeFace.bind(this)
  }
  render() {
    return (
      <div id="container" style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        width: '100%'
      }}>
        <NpcViewer race={this.state.race} helm={this.state.helm} texture={this.state.texture} face={this.state.face} />
        <InfoBox changeRace={this.changeRace} changeTexture={this.changeTexture} changeHelm={this.changeHelm} changeFace={this.changeFace} race={this.state.race} helm={this.state.helm} texture={this.state.texture} face={this.state.face} />
      </div>
    )
  }
  changeRace(event) {
    this.setState({ race: event.target.value })
  }
  changeTexture(event) {
    this.setState({ texture: parseInt(event.target.value) })
  }
  changeHelm(event) {
    this.setState({ helm: parseInt(event.target.value) })
  }
  changeFace(event) {
    this.setState({ face: parseInt(event.target.value) })
  }
}

export default App