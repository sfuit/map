import React from 'react';
const AMap = window.AMap;
export default class HomeMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start:[],
      end:[]
    }
  }
  componentDidMount () {
    const _this = this
    let map = new AMap.Map('app', {
      resizeEnable: true,
      mapStyle:"amap://styles/fresh"
    });
    AMap.plugin('AMap.Geolocation', function() {
      var geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 5000,          //超过10秒后停止定位，默认：5s
        buttonPosition:'LB',    //定位按钮的停靠位置
        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点
      });
      map.addControl(geolocation);
      geolocation.getCurrentPosition(function(status,result){
        if(status=='complete'){
          onComplete(result)
        }else{
          onError(result)
        }
      });
    });
    //解析定位结果
    function onComplete(data) {
      alert('定位成功')
      var str = [];
      str.push('定位结果：' + data.position);
      str.push('定位类别：' + data.location_type);
      if(data.accuracy){
        str.push('精度：' + data.accuracy + ' 米');
      }//如为IP精确定位结果则没有精度信息
      str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
      let address = []
      // console.log(data.position)
      address.push(data.position.lng)
      address.push(data.position.lat)
      console.log(address)
      _this.setState({
        start:address
      })
    }
    //解析定位错误信息
    function onError(data) {
      alert('失败原因排查信息:'+data.message)
    }
    AMap.plugin([
      'AMap.ToolBar',
    ], function(){
      // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
      map.addControl(new AMap.ToolBar({
        // 简易缩放模式，默认为 false
        liteStyle: true
      }));
    });
    AMap.service('AMap.PlaceSearch',function(){
      let placeSearch = new AMap.PlaceSearch({
        pageSize: 50, // 单页显示结果条数
        pageIndex: 1, // 页码
        city: "027", // 兴趣点城市
        map: map, // 展现结果的地图实例
      });
      placeSearch.search('厕所', function (status, result) {
        console.log(result)
        var pois = result.poiList.pois;
        for(var i = 0; i < pois.length; i++){
          var poi = pois[i];
          var marker = [];
          // console.log(pois[i])
          marker[i] = new AMap.Marker({
            content:'<div class="marker" >'+i+'</div>',
            position: poi.location,
          });
          map.add(marker[i]);
        }
        map.setFitView();
        AMap.event.addListener(placeSearch, "markerClick", function(e){
          let address = []
          address.push(e.event.lnglat.lng)
          address.push(e.event.lnglat.lat)
          _this.setState({
            end:address
          })
          AMap.service('AMap.Walking',function(){
            var walking = new AMap.Walking({
              map: map,
            })
            if(walking){
              walking.clear();
            }
            walking.search(_this.state.start,_this.state.end, function(status, result) {
              console.log(_this.state.start, _this.state.end)
              if (status === 'complete') {
                console.log('成功')
              } else {
                console.log('失败')
              }
            })
          })
        })
      })
    });
  }
  render() {
    return (
      <div id='app' style={{position:'fixed',width: '100%', top:0,bottom:'60px'}}></div>
    )}
  }
