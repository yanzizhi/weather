// pages/weather/weather.js
let util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: '武汉',
    weather: {},
    today: ''
  },


  // 根据城市名称查询天气预报信息
  searchWeather: function(cityName) {
    let self = this;
    wx.request({
      url: 'https://wthrcdn.etouch.cn/weather_mini?city=' + cityName,
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        if(res.data.status == 1002) {
          // 显示错误消息
          wx.showModal({
            title: '提示',
            content: '输入的城市名称有误，请重新输入！',
            showCancel: false,
            success: function(res) {
              self.setData({
                inputCity: ''
              })
            }
          })
        } else {
          // 获取天气数据
          let weather = res.data.data;
          // console.log(weather);
          for(let i=0; i<weather.forecast.length; i++) {
            let d = weather.forecast[i].date;
            // 处理日期信息，添加空格
            // console.log(d);
            weather.forecast[i].date = "" + d.replace('星期', '\n星期');
          }
          // console.log(weather);
          self.setData({
            city: cityName,
            weather: weather,
            inputCity: ''  //清空查询输入框
          })
        }
      }
    })
  },
  // 输入事件
  inputing: function(e) {
    this.setData({
      inputCity: e.detail.value
    })
  },
  // 搜索按钮
  bindSearch: function() {
    this.searchWeather(this.data.inputCity);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      today: util.formatTime(new Date()).split(' ')[0]  //更新当前日期
    })
    let self = this;
    // 获取当前位置经纬度
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        // console.log(res);
        // 根据经纬度获取地点名称
        wx.request({
          url: 'https://api.map.baidu.com/geocoder/v2/' + '?ak=ASAT5N3tnHIa4APW0SNPeXN5&location=' + res.latitude + ',' + res.longitude + '&output=json&pois=0',
          data: {},
          header: {
            'Content-Type': 'application/json'
          },
          success: function(res) {
            // console.log(res);
            let city = res.data.result.addressComponent.city;  //城市名称
            let district = res.data.result.addressComponent.district;  //城市地区
            self.setData({
              city: city,
            })
            let city1 = city.replace('市', '');  //去掉获取的城市名称的‘市’，用空字符串代替“市”
            // console.log(city1);
            self.searchWeather(city1);
          }
        })
      },
    })


    // let cityName = this.data.city;
    // wx.request({
    //   url: 'https://wthrcdn.etouch.cn/weather_mini?city=' + cityName,
    //   success: function(res) {
    //     // console.log(res);
    //     self.setData({
    //       weather: res.data.data,
    //     })
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})