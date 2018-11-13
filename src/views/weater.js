import React from 'react';
import Axios from 'axios'
import '../assets/css/weater.css'
import Loading from '../base/loading'
import Bscroll  from 'better-scroll'
const returnCitySN = window.returnCitySN
const AMap = window.AMap;
export default class Weater extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list:{},
      city:'',
      isShow:true
    }
  }
  componentDidMount(){
    this.getCity()
  }
  initSrcoll(){
    setTimeout(()=>{
      this.scroll = new Bscroll(this.refs.wrapper, {})
    },20)
  }
  getData = () =>{
    let url = `https://www.apiopen.top/weatherApi?city=${this.state.city}`
    Axios(url).then((res)=>{
      let nlist = {
        city:res.data.data.city,
        wendu:res.data.data.wendu,
        ganmao:res.data.data.ganmao,
        forecast:[]
      }
      for(let i in res.data.data.forecast){
        let a =res.data.data.forecast[i].high
        let oli = {
          date:res.data.data.forecast[i].date,
          fengxiang:res.data.data.forecast[i].fengxiang,
          high:res.data.data.forecast[i].high.substring(3,6),
          low:res.data.data.forecast[i].low.substring(3,6),
          type:res.data.data.forecast[i].type
        }
        nlist.forecast.push(oli)
      }
      this.setState({
        list: nlist||{}
      })
    })
  }
  getCity(){
    const _this = this
    AMap.plugin('AMap.Geolocation', function() {
      var geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 2000,          //超过10秒后停止定位，默认：5s
      });
      geolocation.getCurrentPosition(function(status,result){
        if(status=='complete'){
          _this.setState({
            city:result.addressComponent.city,
            isShow:false
          },()=>{
              _this.getData()
              _this.initSrcoll()
          })
        }else{
          alert('获取定位失败')
          _this.setState({
            city:'武汉',
            isShow:false
          },()=>{
              _this.getData()
              _this.initSrcoll()
          })
        }
      });
    });
  }
  render() {
    // console.log(this.state.list)
    return (
      <div className='weater'>
        <div className='main'>
          <h2> {this.state.list.city}</h2>
          <div className='content'>
            <div className='today'>
              <p>{this.state.list.wendu}℃</p>
              <p>{this.state.list.ganmao}</p>
            </div>
            <div className='forecast' ref='wrapper'>
              <div >
                {
                  (this.state.list.forecast||[]).map((val,index)=>{
                    return (
                      <div key={index} className='items'>
                        <p className='date'>{val.date}</p>
                        <p className='type'>{val.type}</p>
                        <div className='b'>
                          <p className='wendu'>{val.high}/{val.low}</p>
                          <p className='fengxiang'>{val.fengxiang}</p>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </div>
        <div className='weaterLoading' style={{
          'display' : this.state.isShow ? 'block':'none'
        }}>
          <Loading />
        </div>
      </div>
);
}
}
