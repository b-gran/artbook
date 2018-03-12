import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from 'react-router-dom'
import './App.css'
import Static from './Static'
import Squares from './RotatedSquares'
import BasicPerlin from './BasicPerlin'
import VHS1 from './VHS1'

class App extends Component {
  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <Switch>
          <Route path='/a' render={() => (
            <div className="App">
              <div className="experiment-list">
                <Link to='/a/basic-static'>
                  <div className="experiment-link">Static</div>
                </Link>

                <Link to='/a/squares'>
                  <div className="experiment-link">Squares</div>
                </Link>

                <Link to='/a/straight-perlin'>
                  <div className="experiment-link">Perlin noise</div>
                </Link>

                <Link to='/a/vhs-1'>
                  <div className="experiment-link">VHS deterioration 1</div>
                </Link>
              </div>

              <Route exact path='/a' render={() => <Redirect to='/a/straight-perlin'/>}/>

              <Route path='/a/basic-static' render={() => (
                <div className='experiment'>
                  <h2 className='experiment-title'>Static</h2>
                  <p>
                    Generating some mostly regular static.
                  </p>

                  <Static />
                </div>
              )}/>

              <Route path='/a/squares' render={() => (
                <div className='experiment'>
                  <h2 className='experiment-title'>Rotated squares</h2>

                  <Squares />
                </div>
              )}/>

              <Route path='/a/straight-perlin' render={() => (
                <div className='experiment'>
                  <h2 className='experiment-title'>Perlin noise</h2>

                  <p>
                    Just some plain ol Perlin noise
                  </p>

                  <BasicPerlin />
                </div>
              )}/>

              <Route path='/a/vhs-1' render={() => (
                <div className='experiment'>
                  <h2 className='experiment-title'>VHS deterioration 1</h2>

                  <p>
                    Applies a vhs deterioration effect to a single image
                  </p>

                  <VHS1 />
                </div>
              )}/>
            </div>
          )} />

          <Route path='*' render={() => <Redirect to='/a'/>} />
        </Switch>
      </Router>
    )
  }
}

export default App
