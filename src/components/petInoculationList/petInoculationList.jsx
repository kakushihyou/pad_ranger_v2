import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton, AtAvatar } from 'taro-ui'
import Taro from '@tarojs/taro'
import PetInoculationItem from '../petInoculationItem/petInoculationItem'
import BlankPage from '../blankPage/blankPage'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './petInoculationList.scss'


export default class PetInoculationList extends Component {

  constructor(props) {
    super(props)
  }

  render () {
    let petInoculationList = this.props.list
    return (
      <View className='petInoculationList'>
        {
          petInoculationList.map((item) => {
            return (
              <PetInoculationItem info={item} callback={this.props.callback}></PetInoculationItem>
            )
          })
        }
      </View>
    )
  }
}