import React, { Component } from 'react'
import { View, Image } from '@tarojs/components'
import Taro, { getCurrentInstance } from '@tarojs/taro'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './curtainImg.scss'

export default class CurtainImg extends Component {

  constructor(props) {
    super(props)
  }

  componentDidShow () { 
    
  }

  render () {
    return (
      <View className='index'>
        <View class="op">
          <Image class='background-image' src={getCurrentInstance().router.params.curtainImg} ></Image>  
        </View>
      </View>
    )
  }
}
