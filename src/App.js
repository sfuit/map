import React, {Component} from 'react';
import './assets/css/index.css'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import HomeMap from './views/map'
import Read from './views/read'
import Weater from './views/weater'
import Setting from './views/setting'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index:0
    }
  }
  changeAct = (num) =>{
    this.setState({
      index:num
    })
  }
  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <Route exact path="/" component={HomeMap} />
            <Route path="/read" component={Read} />
            <Route path="/weater" component={Weater} />
            <Route path="/setting" component={Setting} />
            <div className='tab'>
              <div>
                <Link to='/' className={this.state.index===0?'active':""} onClick={this.changeAct.bind(this,0)}><i className='iconfont icon-wc'></i><span>卫生间</span></Link>
                <Link to='read' className={this.state.index===1?'active':""} onClick={this.changeAct.bind(this,1)}><i className='iconfont icon-tubiaozhizuomoban-'></i><span>消遣</span></Link>
                <Link to='/weater' className={this.state.index===2?'active':""} onClick={this.changeAct.bind(this,2)}><i className='iconfont icon-tianqi'></i><span>天气</span></Link>
                <Link to='/setting' className={this.state.index===3?'active':""} onClick={this.changeAct.bind(this,3)}><i className='iconfont icon-shezhi'></i><span>设置</span></Link>
              </div>
            </div>
          </div>
        </Router>
      </div>)
  }
}

export default App;
