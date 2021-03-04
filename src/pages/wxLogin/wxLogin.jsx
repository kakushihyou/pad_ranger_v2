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
    let userID = Taro.getStorageSync('userID')

    if (!userID) {
      Taro.login({
        success: (loginRes) => {
          var code = loginRes.code
          console.log(code)
          Httpclient.post(
            Config.request_host + '/login', {code: code}, 'application/json')
            .then(res => {
              userID = res.Data
              // 将userId存入缓存
              Taro.setStorageSync('userID', userID)
              this.analysisWxuserInfo(detail)
            })
            .catch((err) => {
              console.error(err)
              Taro.showToast({
                title: "微信登录失败",
                icon: 'none'
              })
            })
        },
        fail: () => {
          Taro.showToast({
            title: "微信登录失败",
            icon: 'none'
          })
        }
      })
      .catch((error) => {
        console.error(error)
      })
    } else {
      this.analysisWxuserInfo(detail)
    }

    Taro.switchTab({
      url: '../../pages/index/index'
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
