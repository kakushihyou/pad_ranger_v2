import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton, AtAvatar } from 'taro-ui'
import Taro from '@tarojs/taro'
import {getDefaultHeadImg, jsGetAge, getGenderStr} from '../../util/tool'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './petGeneralSituation.scss'


export default class PetGeneralSituation extends Component {

  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    console.log('进入详情页面')
    let petID = this.props.info.id
    Taro.navigateTo({
      url:'/pages/situationDetail/situationDetail?petID=' + petID
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