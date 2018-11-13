import React from 'react';
import Axios from 'axios'
import '../assets/css/read.css'
import Bscroll  from 'better-scroll'
import Loading from '../base/loading'
export default class Read extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      type:1,
      page:1,
      list:[],
      isShow:true,
      dropDown:false,
      isUploadingShow:false
    }
  }
  componentDidMount(){
    this.setState({
      page:1
    },()=>{
      this.getData()
      this.initsroll()
    })
  }
  initsroll(){
    setTimeout(() => {
      if (!this.scroll) {
        this.scroll = new Bscroll(this.refs.scroll, {
          scrollY: true,
          probeType: 3
        });
      }else{
        this.scroll.refresh();
      }
      this.scroll.on('scroll', (pos) => {
        if(pos.y>50){
          this.setState({
            dropDown:true
          })
        }
      })
      this.scroll.on('touchEnd', (pos) => {
        if(pos.y > 50){
          setTimeout(()=>{
            this.getData()
            this.initsroll()
          },3000)
        }
        if(this.scroll.maxScrollY>pos.y+10){
          this.setState({
            isUploadingShow:true,
            page:this.state.page++
          },()=>{
            this.scroll.refresh()
            setTimeout(()=>{
              this.getData()
              this.scroll.refresh()
            },5000)
          })
        }
      })
    },20)
    setTimeout(() => {
      this.scroll.refresh()
    },2000)
  }
  changeAct = (num) =>{
    this.setState({
      list:[],
      type:num,
      isShow:true,
    },()=>{
      console.log(this.state.type)
      this.getData()
      this.scroll.refresh()
    })
  }
  getData = () =>{
    let url = `https://www.apiopen.top/satinGodApi?type=${this.state.type}&page=${this.state.page}`
    Axios(url).then((res)=>{
      let nlist = this.state.list
      this.setState({
        list:nlist.concat(res.data.data),
        isShow:false,
        isUploadingShow:false,
        dropDown:false
      })
    })
  }
  render() {
    return (
      <div className='read'>
        <nav>
          <div className={this.state.type===1?'active':""} onClick={this.changeAct.bind(this,1)}>全部</div>
          <div className={this.state.type===2?'active':""} onClick={this.changeAct.bind(this,2)}>文字</div>
          <div className={this.state.type===3?'active':""} onClick={this.changeAct.bind(this,3)}>图片</div>
          <div className={this.state.type===4?'active':""} onClick={this.changeAct.bind(this,4)}>git</div>
          <div className={this.state.type===5?'active':""} onClick={this.changeAct.bind(this,5)}>视频</div>
        </nav>
        <div className='content' ref='scroll'>
          <ul ref='text'>
            <div className='loadingContainer' style={{
                'display' : this.state.dropDown ? 'block':'none'
              }}>
              <Loading />
            </div>
            {
              this.state.list.map((val,index)=>{
                if(val.type === "text"){
                  return (
                    <li key={index}>
                      <div className='title'>
                        <img src={val.header}></img>
                        <div className='r'>
                          <h2>{val.username}</h2>
                          <p>{val.passtime}</p>
                        </div>
                      </div>
                      <p className='text'>{val.text}</p>
                    </li>
                  )
                }else if(val.type === "video"){
                  return (
                    <li key={index}>
                      <div className='title'>
                        <img src={val.header}></img>
                        <div className='r'>
                          <h2>{val.username}</h2>
                          <p>{val.passtime}</p>
                        </div>
                      </div>
                      <p className='text'>{val.text}</p>
                      <video src={val.video} controls loop className='video'></video>
                    </li>
                  )
                }else if(val.type === "image"){
                  return (
                    <li key={index}>
                      <div className='title'>
                        <img src={val.header}></img>
                        <div className='r'>
                          <h2>{val.username}</h2>
                          <p>{val.passtime}</p>
                        </div>
                      </div>
                      <p className='text'>{val.text}</p>
                      <img src={val.image}></img>
                    </li>
                  )
                }else if(val.type === "gif"){
                  return (
                    <li key={index}>
                      <div className='title'>
                        <img src={val.header}></img>
                        <div className='r'>
                          <h2>{val.username}</h2>
                          <p>{val.passtime}</p>
                        </div>
                      </div>
                      <p className='text'>{val.text}</p>
                      <img src={val.gif}></img>
                    </li>
                  )
                }
              })
            }
            <div className='loadingContainer' style={{
                'display' : this.state.isUploadingShow ? 'block':'none'
              }}>
              <Loading />
            </div>
          </ul>
          <div className='readLoading' style={{
              'display' : this.state.isShow ? 'block':'none'
            }}>
            <Loading />
          </div>
        </div>
      </div>
    )}
  }
