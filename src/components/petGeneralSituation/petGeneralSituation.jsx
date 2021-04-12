import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton, AtAvatar } from 'taro-ui'
import Taro from '@tarojs/taro'
import {getDefaultHeadImg, jsGetAge, getGenderStr} from '../../util/tool'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './petGeneralSituation.scss'
import Config from '../../config/globalConfig.json'


export default class PetGeneralSituation extends Component {

  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    
    let petID = this.props.info.petID
    console.log('进入详情页面')
    // TODO 查看是否已经接受消息推送
    // var needRequestSubscription = true
    // Taro.getSetting({
    //   withSubscriptions: true,
    //   success: (res) => {
    //     console.log(res.subscriptionsSetting)
    //     if (res.subscriptionsSetting.mainSwitch) {
    //       console.log(res.subscriptionsSetting)
    //       console.log(Config.msgTmpId)
    //       // if (k == Config.msgTmpId) {
    //       //   needRequestSubscription = false
    //       // }
    //     } else {
    //       needRequestSubscription = false
    //     }
    //   },
    //   fail: () => {
    //     console.log('获取用户权限失败')
    //   }
    // })

    // if (needRequestSubscription) {
    //   Taro.requestSubscribeMessage({
    //     tmplIds: [Config.msgTmpId],
    //     success: (res) => {
    //       console.log('用户授权成功')
    //       console.log(res)
    //     },
    //     fail: (e) => {
    //       console.log('用户授权失败[' + e.errCode + '],' + e.errMsg)
    //     }
    //   })
    // }

    Taro.navigateTo({
      url:'/case/pages/situationDetail/situationDetail?petID=' + petID
    })
  }

  render () {
    let petGeneralSituation = this.props.info
    return (
      <View className='singleSituation' onClick={this.handleClick}>
        <View className='photo'>
          <AtAvatar circle size='small' image={petGeneralSituation.headImg === '' ? getDefaultHeadImg(petGeneralSituation.species) : petGeneralSituation.headImg}></AtAvatar>
        </View>
        <View className='petSituation'>
          <Text>昵称：{petGeneralSituation.nickName}</Text>
          <Text>疫苗：{petGeneralSituation.inoculationCount} 次</Text>
          <Text>驱虫：{petGeneralSituation.dewormingCount} 次</Text>
          <Text>病例：{petGeneralSituation.caseCount} 条</Text>
        </View>
      </View>
    )
  }
}