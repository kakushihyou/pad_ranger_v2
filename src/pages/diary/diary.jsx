import React, { Component } from 'react'
import { View, Text} from '@tarojs/components'
import {AtFab, AtSearchBar, AtModal} from 'taro-ui'
import Taro from '@tarojs/taro'
import "taro-ui/dist/style/components/button.scss" // 按需引入
import './diary.scss'
import DiaryItem from '../../components/diaryItem/diaryItem'
import Httpclient from '../../../httpclient/http'
import Config from '../../config/globalConfig.json'

export default class Diary extends Component {

  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      condition: '',
      conditionDate: '',
      conditionDateSel: '',
      pageNum: 1,
      diaryList: []
    }

  }

  componentDidShow = () => {
    this.setState({
      showModal: false
    })
    let userID = Taro.getStorageSync('userID') 
    if (userID) {

      Taro.getSetting({
        success(res) {
          if (!res.authSetting["scope.userInfo"]) {
              
            console.error('获取微信用户信息授权失败')
            Taro.navigateTo({
              url: '/pages/wxLogin/wxLogin'
            })
            return
          }
        }
      })

      // 获取用户日记列表
      Httpclient.get(Config.request_host + '/diary/list?userID=' + Taro.getStorageSync('userID')  + '&pageNum=' + this.state.pageNum + '&keyword=' + this.state.condition)
      .then(res => {
        console.log(res.Data)
        if (res.Data.count > 0) {
          this.setState({
            diaryList: res.Data.diaryList
          })
        } else {
          Taro.showToast({
            title: "快去写日记吧～",
            icon: 'none',
            duration: 3000
          })

          this.setState({
            diaryList: []
          })
        }
      })
      .catch(err => {
        console.error(err)
        Taro.showToast({
          title: '出错了？朕很生气！',
          icon: "none"
        })
        return
      })
    } else {
      //   Taro.navigateTo({
      //     url: '/pages/wxLogin/wxLogin'
      //   })
      //   return
      // }
      this.setState({
        diaryList: []
      })
      Taro.showToast({
        title: "快去写日记吧～",
        icon: 'none',
        duration: 3000
      })
    }
  }

  onReachBottom = () => {
    console.log('hahah')
    let pageNum = this.state.pageNum
    this.setState({
      pageNum: pageNum + 1
    })

    this.search()
  }

  search = function() {

    if (this.state.condition == null && this.state.condition == "") {
      this.setState({
        pageNum: 1
      })
    }
    Httpclient.get(Config.request_host + '/diary/list?userID=' + Taro.getStorageSync('userID') + '&pageNum=' + this.state.pageNum + '&keyword=' + this.state.condition)
    .then(res => {
      console.log(res.Data)
      if (res.Data.count > 0) {
        let list = this.state.diaryList
        list.push(res.Data.diaryList)
        this.setState({
          diaryList: list
        })
      }
    })
    .catch(err => {
      console.error(err)
      Taro.showToast({
        title: '出错了？朕很生气！',
        icon: "none"
      })
      return
    })
  }

  onConditionDateChange = (e) => {
    console.log(e.detail.value)
    let conditionDate = e.detail.value
    
    this.setState({
      conditionDate: conditionDate,
      conditionDateSel: conditionDate
    })

    this.search()
  }

  onChange = (e) => {
    // console.log(e)
    this.setState({
      condition: e
    })
  }

  onActionClick = (e) => {
    console.log(this.state.condition)
    let userID = Taro.getStorageSync('userID')
    if (!userID) {
      console.log('未登录的搜索直接返回空')
      this.setState({
        diaryList: []
      })
      return
    }
    this.setState({
      pageNum: 1
    })
    Httpclient.get(Config.request_host + '/diary/list?userID=' + userID + '&pageNum=' + this.state.pageNum + '&keyword=' + this.state.condition)
    .then(res => {
      console.log(res.Data)
      this.setState({
        diaryList: res.Data.diaryList
      })
    })
    .catch(err => {
      console.error(err)
      Taro.showToast({
        title: '出错了？朕很生气！',
        icon: "none"
      })
      return
    })
  }

  onButtonClick = () => {
    console.log('跳转到新增日记页面')
    let userID = Taro.getStorageSync('userID')
    if (userID) {
      // 跳转到新增日记页面
      Taro.navigateTo({
        url: '/diary/pages/diaryAdd/diaryAdd?userID=' + userID
      })
    } else {
      this.setState({
        showModal: true
      })
    }
  }

  refuseLogin = () => {
    console.log('拒绝登录')
    Taro.showToast({
      title: '等你哟～',
      icon: "none"
    })
    this.setState({
      showModal: false
    })
  }

  confirmLogin = () => {
    console.log('同意登录')
    Taro.navigateTo({
      url: '/pages/wxLogin/wxLogin'
    })
  }

  render () {
    return (
      <View className='diary'>
        <View className='modal'>
          {
            this.state.showModal ? (
              <AtModal isOpened 
                title='登录'
                cancelText='暂不登录'
                confirmText='马上登录'
                content='登录后才能添加日记喔~'
                onCancel={this.refuseLogin.bind(this)}
                onConfirm={this.confirmLogin.bind(this)}
              />
            ) : ''
          }
        </View>
        <AtSearchBar placeholder="请输入要搜索的日记内容关键词" fixed={true} showActionButton={false} inputType='text' value={this.state.condition} onChange={this.onChange.bind(this)} onActionClick={this.onActionClick.bind(this)} />
        <View className='list'>
          {
            (this.state.diaryList != null && this.state.diaryList.length > 0) ? (
              this.state.diaryList.map((item) => {
                return (
                  <DiaryItem info={item} />
                )
              })
            ) : (<View /> )
          }
        </View>
          
        <View className="post-button">
          <AtFab className='fabButton' onClick={this.onButtonClick.bind(this)} size='small'>
            <Text className="at-fab__icon at-icon at-icon-add"></Text>
          </AtFab>
        </View>
      </View>
    )
  }
}
