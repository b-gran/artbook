import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import './App.css'
import Static from './Static'
import Squares from './RotatedSquares'
import BasicPerlin from './BasicPerlin'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <div className="experiment-list">
            <Link to='/basic-static'>
              <div className="experiment-link">Static</div>
            </Link>

            <Link to='/squares'>
              <div className="experiment-link">Squares</div>
            </Link>

            <Link to='/straight-perlin'>
              <div className="experiment-link">Perlin noise</div>
            </Link>
          </div>

          <Route path='/basic-static' render={() => (
            <div className='experiment'>
              <h2 className='experiment-title'>Static</h2>
              <p>
                Generating some mostly regular static.
              </p>

              <Static />
            </div>
          )}/>

          <Route path='/squares' render={() => (
            <div className='experiment'>
              <h2 className='experiment-title'>Rotated squares</h2>

              <Squares />
            </div>
          )}/>

          <Route path='/straight-perlin' render={() => (
            <div className='experiment'>
              <h2 className='experiment-title'>Perlin noise</h2>

              <p>
                Just some plain ol Perlin noise
              </p>

              <BasicPerlin />
            </div>
          )}/>
        </div>
      </Router>
    )
  }
}

export default App
