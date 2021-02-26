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
      petResumeList: [],
      // TODO
      userID: '1000000002'
    }
  }

  componentWillMount () {
    // TODO Test
    Taro.setStorage({
      key: 'userID',
      Data: '1000000002'
    })


    // TODO 判断是否需要微信授权

    // console.log('index222222222')
    // TODO 微信登录
    // Taro.login({
    //   success(res) {
    //     var code = res.code
    //     console.log(code)
    //     Httpclient.post(
    //       'http://localhost:9669/login', {code: code}, 'application/json')
    //       .then(res => {
    //         console.log(res.Data)
    //         var userId = res.Data
    //         // TODO 将userId存入缓存
    //         Taro.setStorage({
    //            key: 'userID',
    //            Data: userId
    //          })
    //         // TODO 获取用户授权
    //         Taro.getSetting({
    //           success(res) {
    //             console.log(res.authSetting["scope.userInfo"])
    //             if (!res.authSetting["scope.userInfo"]) {
    //               Taro.authorize({
    //                 scope: 'scope.userInfo',
    //                 success() {
    //                   console.log('获取授权成功')
    //                 },
    //                 fail() {
    //                   console.error('微信授权失败')
    //                 }
    //               })
    //             }

    //             Taro.getUserInfo({
    //               success: function(res) {
    //                 var jsonData = {
    //                   UserID : userId,
    //                   RawData : res.rawData,
    //                   Signature : res.signature,
    //                   EncryptedData : res.encryptedData,
    //                   Iv : res.iv
    //                 }
    //                 Taro.setStorage({
    //                   key: 'userInfo',
    //                   Data: jsonData
    //                 })
    //                 console.log(jsonData)
    //                 Httpclient.post('http://localhost:9669/analysisWxUserInfo', jsonData, 'application/json')
    //                   .then(res => {
    //                     console.log(res)
    //                   })
    //                   .catch(err => {
    //                     console.error(err)
    //                   })
    //               }
    //             })
    //           }
    //         })

    //       })
    //       .catch(err => {
    //         console.error(err)
    //         alert('微信登录失败')
    //         return
    //       })
    //   },
    //   fail(res) {
    //     alert("微信登录失败")
    //     return
    //   }
    // }).catc((error) => {
    //   console.error(error)
    // })
   }

  componentDidShow () {
    this.getPetList()
  }

   getPetList() {
    // TODO 获取用户的宠物列表结果示例  
    let petResumeListInfo 
    Httpclient.get(Config.request_host + '/pet/list?userID=' + this.state.userID)
    .then(res => {

      if (res.Data.count < 1) {
        console.log('未找到宠物信息')
        return (
          <View className='noData'>
            <Text>主人，啥也没找到</Text> 
          </View>
        )
      }
      petResumeListInfo = res.Data.userPetList

      console.log('设置到state中')
      this.setState({
        petResumeList: petResumeListInfo,
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
    Taro.navigateTo({
      url: '/pet/pages/petAdd/petAdd?userID=' + this.state.userID
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
