import React from 'react'

class InfoBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      races: [
        'ORC',
        'HIM'
      ]
    }
  }
  render() {
    return (
      <div id="info-box" style={{
        minWidth: 200,
        width: '30%',
        height: '100%',
        overflow: 'auto',
        padding: 30
      }}>
        <h5 className="monospace mb-3">Visual EQ NpcViewer</h5>
        <form>
          <select value={this.props.race} className="custom-select cusom-select-lg mb-3" onChange={this.props.changeRace}>
            <option value="select" disabled>Select race</option>
            {
              this.state.races.map(value => {
                return <option key={value} value={value}>{value}</option>
              })
            }
          </select>
          <div className="form-group">
            <label>Texture</label>
            <input type="number" className="form-control" value={this.props.texture} onChange={this.props.changeTexture} />
          </div>
          <div className="form-group">
            <label>Face</label>
            <input type="number" className="form-control" value={this.props.face} onChange={this.props.changeFace} />
          </div>
          <div className="form-group">
            <label>Helm</label>
            <input type="number" className="form-control" value={this.props.helm} onChange={this.props.changeHelm} />
          </div>
        </form>
      </div>
    )
  }
  componentDidMount() {
    fetch('/races').then(res => {
      return res.json()
    }).then(body => {
      this.setState({ races: body })
    }).catch(err => {
      throw new Error(err)
    })
  }
}

export default InfoBox