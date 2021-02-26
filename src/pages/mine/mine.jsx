import React, { Component } from 'react'
import { View, Image } from '@tarojs/components'
import { AtButton, AtAvatar } from 'taro-ui'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './mine.scss'
import  BackGroundPng  from "../../assets/background/backgroud_ranger.png";

export default class Mine extends Component {

  constructor(props) {
    super(props)
    
  }

  componentWillMount () {
  
   }

  componentDidMount () {
    
   }

  render () {
    return (
      <View className='index'>
        <View class="op">
          <Image class='background-image' src={BackGroundPng} ></Image>  
        </View>
        <View className='at-article'>
          <View className='at-article__h1'>
            <View>
              Hey！
            </View>
            <View>
              我将一直守在你身边，直到生命的最后一刻。从现在起，做你的专属侠客，守护你的心灵，不离不弃。我就是你的肉垫侠，用小肉垫来温热你的心灵，抵抗内心的黑暗。
            </View>
          </View>
        </View>
      </View>
    )
  }
}
