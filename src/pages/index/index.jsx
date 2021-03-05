import React, { Component } from 'react'
import { View, Text} from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtButton, AtAvatar, AtFab} from 'taro-ui'
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
      petResumeList: []
    }

    // this.getPetList = this.getPetList.bind(this)
  }

  componentWillMount () {
    
  }

  componentDidShow () {

    // 微信登录
    let userID = Taro.getStorageSync('userID')

    if (!userID) {
      Taro.navigateTo({
        url: '/pages/wxLogin/wxLogin'
      })
      return
      // Taro.login({
      //   success: (loginRes) => {
      //     var code = loginRes.code
      //     console.log(code)
      //     Httpclient.post(
      //       Config.request_host + '/login', {code: code}, 'application/json')
      //       .then(res => {
      //         userID = res.Data
      //         // 将userId存入缓存
      //         Taro.setStorageSync('userID', userID)
      //       })
      //       .catch(err => {
      //         console.error(err)
      //         Taro.showModal({
      //           confirmText:'确实忘了',
      //           confirmColor:'#9BCEFA',
      //           content: err,
      //           showCancel: false,  //是否显示取消按钮
      //         })
      //         Taro.showToast({
      //           title: "微信登录失败1",
      //           icon: 'none'
      //         })

      //         return
      //       })
      //   },
      //   fail: () => {
      //     Taro.showToast({
      //       title: "微信登录失败2",
      //       icon: 'none'
      //     })

      //     return
      //   }
      // })
      // .catch((error) => {
      //   console.error(error)
      // })
    } 

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
        icon: "none"
      })
      return
    })
   }

  onButtonClick = () => {
    Taro.navigateTo({
      url: '/pet/pages/petAdd/petAdd?userID=' + Taro.getStorageSync('userID')
    })
  } 

  render () {
    return (
      <View className='page'>
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
