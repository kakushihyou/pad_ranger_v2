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
    let res = e.detail
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

    Taro.switchTab({
      url: '../../pages/index/index'
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
