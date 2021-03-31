import React, { Component } from 'react'
import { View, Text} from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtModal, AtFab} from 'taro-ui'
import 'taro-ui/dist/style/index.scss'
import "taro-ui/dist/style/components/button.scss" // 按需引入
import './index.scss'
import Httpclient from '../../../httpclient/http'
import SignlePetResume  from "../../components/singlePetResume/singlePetResume";
import Swip from '../../components/swipe/swipe'
import Config from '../../config/globalConfig.json'

export default class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      petResumeList: [],
      showModal: false
    }

    // this.getPetList = this.getPetList.bind(this)
  }

  componentWillMount () {
    
  }

  componentDidShow () {

    this.setState({
      showModal: false
    })

    // 微信登录
    let userID = Taro.getStorageSync('userID')

    if (Taro.getStorageSync('userID')) {
    //   Taro.navigateTo({
    //     url: '/pages/wxLogin/wxLogin'
    //   })
    //   return
    // } else {
      // 用户授权
      Taro.getSetting({
        success(res) {
          if (!res.authSetting["scope.userInfo"]) {
              
            console.error('获取微信用户信息授权失败')
            Taro.navigateTo({
              url: '/pages/wxLogin/wxLogin'
            })
            return
          } 
          else {
            Taro.getUserInfo({
              success: function(res) {
                var jsonData = {
                  UserID : Taro.getStorageSync('userID'),
                  RawData : res.rawData,
                  Signature : res.signature,
                  EncryptedData : res.encryptedData,
                  Iv : res.iv
                }
                Taro.setStorageSync('userInfo', jsonData)
                console.log(jsonData)
                Httpclient.post(Config.request_host + '/analysisWxUserInfo', jsonData, 'application/json')
                  .then(res => {
                    console.log(res)
                  })
                  .catch(err => {
                    console.error(err)
                  })
              }
            })
          }
        }
      })

      this.getPetList(Taro.getStorageSync('userID'))
    } else {
      Taro.showToast({
        title: '没有宠物信息，快去添加吧',
        icon: 'none',
        duration: 1200
      })

      this.setState({
        petResumeList: [],
      })
    }
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
          duration: 1200
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
