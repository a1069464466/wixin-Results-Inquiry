//index.js
//获取应用实例
const AppID = '	wxcfd89c3f201cc325';
const Secret = '7ad95e8454572da0b0e4de55bb4b8b3e';
var   app = getApp()
var Openid="";
Page({
  onReady: function () {
    this.openid()
    // wx.navigateTo({
    //   url: '../cjfl/cjfl',
    // })
  },
  data:{
    cuowu:false,
    loadingHidden: true, //加载信息
    zhezhao:true//遮罩逻辑
  },
  //登录上传信息
  denglu:function(e){
      // console.log(111)
      var that=this;
      console.log(e.detail.value.mm)
      if (e.detail.value.name.length == 10 && e.detail.value.mm.length==6){
        var xinxi = [e.detail.value.name, e.detail.value.mm]
        wx.request({
          url: 'https://wzct.wtc.edu.cn/index.php?s=/addon/Wtcdg/Wtcdg/test',
          header: { 'Content-Type': 'application/x-www-form-urlencoded' },
          method: "POST",
          data:{
            id:e.detail.value.mm,
            xh:e.detail.value.name,
            openid: Openid
          },       
          success:function(e){
            console.log("判断输入的帐号",e)
            clearInterval(1)
            if (e.data.personal==false){
               that.setData({
                 cuowu: !(that.data.cuowu)
               })
             }
             else if(e.data.erro=='333'){
              wx.showModal({
                content: '此帐号已在其他地方登陆过',
                icon: "success"
              })
             }
             else{
                  app.grcj=e.data.course;
                  app.grxx=e.data.personal;
                  wx.redirectTo ({
                    url: '../cjcx/cjcx',
                  })
             }

          }
      })}
      else{
        wx.showModal({
          content:'请把信息填写完整',
          icon:"success"
        })
      }
  },
  //获取OPENID
  openid:function(){
      var that=this
      wx.login({
        success:function(res){
          console.log("!---->",res)
          if(res.code){
            wx.request({
              url: 'https://wzct.wtc.edu.cn/index.php?s=/addon/Wtcdg/Wtcdg/cj_getopenid',
              method: 'GET',
              header: { 'Content-Type': 'application/x-www-form-urlencoded' },
              data:{
                code:res.code
              },
              success:function(e){
                console.log(e);
                console.log("没返回"+e.data);
                Openid = e.data;
                app.globalData.qopenid = Openid;//把openid放入到app全局变量之中
                that.Verify();
              }
            })
          }
          else{
            console.log("没获取到")
          }
        }
      })
  },
  //校验是否为第一次登录
  Verify:function(){
    var that=this;
    console.log("v-->"+Openid)
      wx.request({
        url: 'https://wzct.wtc.edu.cn/index.php?s=/addon/Wtcdg/Wtcdg/sfbd',
        method: "POST",
        header: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: {
          openid: Openid
        },
        success:function(e){
            console.log("6666",e);
            if(e.data!== ""){
              that.setData({
                zhezhao:false
              })
            }
            if(e.data!=0){
              app.grcj = e.data.course;
              app.grxx = e.data.personal;
              wx.redirectTo({
                 url: '../cjcx/cjcx',
              })
            }
            console.log("判断是否为第一次登录",e.data)
          }
      })
      
  },
  cuowu_queding:function(){
      this.setData({
        cuowu:!(this.data.cuowu)
      })
  },
  //加载动画
  loadingTap: function () {
    this.setData({
      loadingHidden: false
    });
    var that = this;
    setTimeout(function  () {
      that.setData({
        loadingHidden: true
      });
      that.update();
    }, 500);
  } ,
})
