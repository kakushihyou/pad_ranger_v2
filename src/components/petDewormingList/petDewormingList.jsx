import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton, AtAvatar } from 'taro-ui'
import Taro from '@tarojs/taro'
import PetDewormingItem from '../petDewormingItem/petDewormingItem'
import BlankPage from '../blankPage/blankPage'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './petDewormingList.scss'
import Httpclient from '../../../httpclient/http'


export default class PetDewormingList extends Component {

  constructor(props) {
    super(props)
  }

  render () {
    let petDewormingList = this.props.list
    return (
      <View className='petDewormingList'>
        {
          petDewormingList.map((item) => {
            return (
              <PetDewormingItem info={item}></PetDewormingItem>
            )
          })
        }
      </View>
    )
  }
}