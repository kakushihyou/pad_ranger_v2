import React, { Component } from 'react'
import { View, Text} from '@tarojs/components'
import { AtButton, AtAvatar} from 'taro-ui'
import 'taro-ui/dist/style/index.scss'
import "taro-ui/dist/style/components/button.scss" // 按需引入
import './index.scss'
import Httpclient from '../../../httpclient/http'
import SignlePetResume  from "../../components/singlePetResume/singlePetResume";
import Swip from '../../components/swipe/swipe'

export default class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      petResumeList: [],
    }
  }

  componentWillMount () {
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
    Httpclient.get('http://localhost:9669/pet/list?userID=' + '1000000002')
    .then(res => {
      // console.log(res.Data)

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

      // console.log(this.state.petResumeList)
    })
    .catch(err => {
      console.error(err)
      return
    })
   }

  render () {
    // console.log('开始渲染页面' + JSON.stringify(this.state.petResumeList))
    return (
      
      this.state.petResumeList.map((item) => {
        let modify_url = '/pages/petUpdate/petUpdate?petID=' + item.id
        return (
          <View className='index' onLongPress={this.addPetInfo}>
            <Swip content={<SignlePetResume petResume={item} />} info={item} modify_url={modify_url} />
          </View>
        )
      })
    )
  }
}
