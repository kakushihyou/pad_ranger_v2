import React, { Component } from 'react'
import { View, Text, Image} from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtModal, AtFab, AtCurtain} from 'taro-ui'
import 'taro-ui/dist/style/index.scss'
import "taro-ui/dist/style/components/button.scss" // 按需引入
import './index.scss'
import Httpclient from '../../../httpclient/http'
import SignlePetResume  from "../../components/singlePetResume/singlePetResume";
import Swip from '../../components/swipe/swipe'
import Config from '../../config/globalConfig.json'
import {getNextDayTime} from '../../util/tool'

export default class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      petResumeList: [],
      showModal: false,
      showCurtain: false,
      curtainImg: '',
      curtainLinkUrl: ''
    }

    // this.getPetList = this.getPetList.bind(this)
  }

  componentWillMount () {

  }

  componentDidShow () {

    Taro.hideToast()
    this.setState({
      showModal: false
    })

    let curtainDueTime = Taro.getStorageSync("curtainDueTime")
    console.log('幕帘下次弹出的间隔 是' + curtainDueTime)
    if (!curtainDueTime || curtainDueTime == 0) {

      console.log('幕帘首次弹出')
      this.getCurtain()
    } else {

      // this.setState({
      //   showCurtain: false
      // })
      var currentTime = new Date().getTime()
      if (currentTime - curtainDueTime >= 0) {
        console.log('幕帘重新弹出')
        this.getCurtain()
      } else {
        console.log('幕帘已弹出，并且未到下次弹出时间')
      }
    }

    // 微信登录
    let userID = Taro.getStorageSync('userID')
    console.log("首页获取的userID是" + userID)
    if (userID) {
      this.getPetList(Taro.getStorageSync('userID'))
    } else {
      Taro.showToast({
        title: '没有宠物信息，快去添加吧',
        icon: 'none',
        duration: 1200,
      })

      this.setState({
        petResumeList: [],
      })
    }
  }

  getCurtain = () => {
    Httpclient.get(Config.request_host + '/curtain')
      .then(res => {
        if (res.Data) {
          this.setState({
            showCurtain: true,
            curtainImg: res.Data.CurtainImg,
            curtainLinkUrl: res.Data.LinkUrl
          })

          Taro.setStorageSync("curtainDueTime", getNextDayTime().getTime())
        }
      })
      .catch(err => {
        console.error(err)
      })
  }

  getPetList = (userID) => {
    // 获取用户的宠物列表结果示例  
    if (!userID) {
      return
    }
    let petResumeListInfo 
    Httpclient.get(Config.request_host + '/pet/list?userID=' + userID)
    .then(res => {

      if (res.Data.count < 1) {
        console.log('未找到宠物信息')
        Taro.showToast({
          title: '没有宠物信息，快去添加吧',
          icon: 'none',
          duration: 1200,
          // complete: () => {
          //   Taro.hideToast()
          // }
        })

        this.setState({
          petResumeList: [],
        })
      } else {
        petResumeListInfo = res.Data.userPetList

        console.log('设置到state中')
        this.setState({
          petResumeList: petResumeListInfo,
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

  onButtonClick = () => {
    let userID = Taro.getStorageSync('userID')
    if (userID) {
      // console.log('userID是' + userID)
      Taro.navigateTo({
        url: '/pet/pages/petAdd/petAdd?userID=' + userID
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

  clickCurtainImg = () => {
    // TODO 个人版不支持webView，暂时做成页面跳转
    console.log('点击幕帘，跳转到相应的活动页面')
    let linkUrl = this.state.curtainLinkUrl
    if (linkUrl) {
      Taro.navigateTo({
        url:'/curtains/pages/curtainImg/curtainImg?curtainImg=' + linkUrl
      })
    }

    console.log('点击完毕，关闭幕帘')
    this.setState({
      showCurtain: false
    })
  }

  closeCurtain = () => {
    console.log('关闭幕帘')
    this.setState({
      showCurtain: false
    })
  }

  render () {
    return (
      <View className='page'>
        <View className='modal'>
          {
            this.state.showModal ? (
              <AtModal isOpened 
                title='登录'
                cancelText='暂不登录'
                confirmText='马上登录'
                content='登录后才能添加宠物信息喔~'
                onCancel={this.refuseLogin.bind(this)}
                onConfirm={this.confirmLogin.bind(this)}
              />
            ) : ''
          }
        </View>
        <View className='curtain'>
          {
            this.state.showCurtain ? (
              <AtCurtain 
                isOpened={this.state.showCurtain} 
                onClose={this.closeCurtain.bind(this)} 
                closeBtnPosition='bottom'> 
                <Image src={this.state.curtainImg} onClick={this.clickCurtainImg.bind(this)}></Image>
              </AtCurtain>
            ) : ''
          }
        </View>
        <View className='list'>
          {
            this.state.petResumeList.map((item) => {
              return (
                <View className='index'>
                  <Swip content={<SignlePetResume petResume={item} />} info={item} />
                </View>
              )
            })
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
