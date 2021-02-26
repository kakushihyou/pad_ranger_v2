import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton, AtAvatar } from 'taro-ui'
import Taro from '@tarojs/taro'
import PetCaseItem from '../petCaseItem/petCaseItem'
import BlankPage from '../blankPage/blankPage'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './petCaseList.scss'


export default class PetCaseList extends Component {

  constructor(props) {
    super(props)
  }

  render () {
    let petCaseList = this.props.list
    return (
      <View className='petCaseList'>
        {
          petCaseList.map((item) => {
            return (
              <PetCaseItem info={item} handleFloatLayoutShow={() => this.props.handleFloatLayoutShow(item.preID)}></PetCaseItem>
            )
          })
        }
      </View>
    )
  }
}