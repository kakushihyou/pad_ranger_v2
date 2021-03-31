import React, { Component } from 'react'
import { View, Text} from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtButton, AtAvatar, AtFab} from 'taro-ui'
import 'taro-ui/dist/style/index.scss'
import "taro-ui/dist/style/components/button.scss" // 按需引入
import './wxLogin.scss'
import Httpclient from '../../../httpclient/http'
import Config from '../../config/globalConfig.json'

export default class Index extends Component {

  constructor(props) {
    super(props)
    this.bindUserInfo = this.bindUserInfo.bind(this)
  }

  bindUserInfo = (e) => {
    console.log(e)
    let detail = e.detail
    // 微信登录
    Taro.login({
      success: (loginRes) => {
        var code = loginRes.code
        console.log(code)
        Httpclient.post(
          Config.request_host + '/login', {code: code}, 'application/json')
          .then(res => {
            let userID = res.Data
            console.log('微信授权页面登陆获取userID是' + userID)
            // 将userId存入缓存
            Taro.setStorageSync('userID', userID)
            this.analysisWxuserInfo(detail)
            // Taro.switchTab({
            //   url: '../../pages/index/index'
            // })
            Taro.navigateBack({
              delta: 1
            })
          })
          .catch((err) => {
            console.error(err)
            Taro.showToast({
              title: "微信登录失败3",
              icon: 'none',
              duration: 1200
            })
          })
      },
      fail: () => {
        Taro.showToast({
          title: "微信登录失败4",
          icon: 'none',
          duration: 1200
        })
      }
    })
    .catch((error) => {
      console.error(error)
    })
  }

  analysisWxuserInfo = (info) => {
    var jsonData = {
      UserID : Taro.getStorageSync('userID'),
      RawData : info.rawData,
      Signature : info.signature,
      EncryptedData : info.encryptedData,
      Iv : info.iv
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

  render () {
    return (
      <View className='login'>
        <AtButton className='access' type='primary' full circle size='mini' openType='getUserInfo' onGetUserInfo={this.bindUserInfo}>点击获取微信授权</AtButton>
        <AtButton className='cancel' type='primary' full circle size='mini' openType='getUserInfo'>拒绝授权</AtButton>
      </View>
    )
  }
}
