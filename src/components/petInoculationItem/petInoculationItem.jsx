import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton, AtAvatar } from 'taro-ui'
import Taro from '@tarojs/taro'
import {getDefaultHeadImg, jsGetAge, getGenderStr} from '../../util/tool'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './petInoculationItem.scss'


export default class PetInoculationItem extends Component {

  constructor(props) {
    super(props)
  }


  render () {
    let petInoculationDetail = this.props.info
    return (
      <View className='singleSituation' onClick={this.handleClick}>
          <Text>昵称：{petGeneralSituation.nickName}</Text>
          <Text>疫苗：{petGeneralSituation.inoculationCount} 次</Text>
          <Text>驱虫：{petGeneralSituation.dewormingCount} 次</Text>
          <Text>病例：{petGeneralSituation.caseCount} 条</Text>
      </View>
    )
  }
}