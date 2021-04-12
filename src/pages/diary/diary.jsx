import React, { Component } from 'react'
import { View, Text} from '@tarojs/components'
import {AtFab, AtSearchBar, AtModal} from 'taro-ui'
import Taro, { getCurrentInstance } from '@tarojs/taro'
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

  componentDidShow() {
    Taro.hideToast()
    let needRefresh = Taro.getStorageSync('needRefresh')
    let updateDiaryInfo = Taro.getStorageSync('updateDiaryInfo')
    let deleteDiaryID = Taro.getStorageSync('deleteDiaryID')
    let dataList = this.state.diaryList
    this.setState({
      showModal: false
    })
    let userID = Taro.getStorageSync('userID') 
    console.log('UserID是' + userID)
    if (userID) {

      if (needRefresh || (dataList == null || dataList.length == 0)) {
        this.setState({
          pageNum: 1
        })
        // 获取用户日记列表
        Httpclient.get(Config.request_host + '/diary/list?userID=' + Taro.getStorageSync('userID')  + '&pageNum=' + this.state.pageNum + '&keyword=' + this.state.condition)
        .then(res => {
          // console.log(res.Data)
          if (res.Data.count > 0) {
            console.log('日记列表不为空')
            this.setState({
              diaryList: res.Data.diaryList
            })
            Taro.removeStorageSync('needRefresh')
          } else {
            console.log('查询到的日记列表为空')
            
            Taro.showToast({
              title: '快去写日记吧～',
              icon: 'none',
              duration: 1200,
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
            icon: "none",
            duration: 1200
          })
          return
        })
      } else if (updateDiaryInfo) {
        var newList = [] 
        dataList.forEach((item, index) => {
          if (item.id == updateDiaryInfo.id) {
            newList.push(updateDiaryInfo)
          } else {
            newList.push(item)
          }
        })

        this.setState({
          diaryList: newList
        })
      } else if (deleteDiaryID) {
        let newList = []
        dataList.forEach((item, index) => {
          if (item.id != deleteDiaryID) {
            newList.push(item)
          }
        })

        this.setState({
          diaryList: newList
        })        
      }
    } else {
      console.log('日记列表页面，用户未登录')
     
      Taro.showToast({
        title: "快去写日记吧～",
        icon: 'none',
        duration: 1200,
      })
      this.setState({
        diaryList: []
      })
    }
  }

  onReachBottom = () => {
    let pageNum = this.state.pageNum
    this.setState({
      pageNum: pageNum + 1
    })

    this.search()
  }

  search = () => {
    let dataList = this.state.diaryList
    if (this.state.condition == null && this.state.condition == "") {
      this.setState({
        pageNum: 1
      })
    }
    Httpclient.get(Config.request_host + '/diary/list?userID=' + Taro.getStorageSync('userID') + '&pageNum=' + this.state.pageNum + '&keyword=' + this.state.condition)
    .then(res => {
      // console.log(res.Data)
      if (res.Data.count > 0) {
        dataList.push(...res.Data.diaryList)
        this.setState({
          diaryList: dataList
        })
      } else {
        let pageNum = this.state.pageNum
        this.setState({
          pageNum: pageNum - 1
        })
      }
    })
    .catch(err => {
      console.error(err)
      Taro.showToast({
        title: '出错了？朕很生气！',
        icon: "none",
        duration: 1200
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
        icon: "none",
        duration: 1200
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
      icon: "none",
      duration: 1200
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
