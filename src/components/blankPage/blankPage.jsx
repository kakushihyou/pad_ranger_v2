import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton, AtAvatar, AtSwipeAction } from 'taro-ui'
import Taro, { getCurrentPages } from '@tarojs/taro'

import "taro-ui/dist/style/components/button.scss"
import './blankPage.scss'
import BlankIcon from '../../assets/icon/blank.png'

export default class Blank extends Component {

  render () {
    return (
      <View className='blank'>
        <image className='blankIcon' src={BlankIcon} ></image>
      </View>
    )
  }
}