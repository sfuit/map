import React, {Component} from 'react';
import '../assets/css/loading.css'
import image from './loading.gif'
class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="loading">
        <img src={image}></img>
      </div>)
  }
}

export default App;
