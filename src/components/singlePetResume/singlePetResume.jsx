import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton, AtAvatar } from 'taro-ui'
import Taro from '@tarojs/taro'
import {getDefaultHeadImg, jsGetAge, getGenderStr} from '../../util/tool'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './singlePetResume.scss'


export default class SinglePetResume extends Component {

  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    console.log('进入详情页面')
    let petID = this.props.petResume.id
    Taro.navigateTo({
      url:'/pet/pages/petDetail/petDetail?petID=' + petID
    })
  }

  render () {
    let petResume = this.props.petResume
    // console.log('获取到宠物概要' + JSON.stringify(petResume))
    return (
      <View className='singlePet' onClick={this.handleClick}>
        <View className='photo'>
          <AtAvatar circle size='small' image={petResume.headImg === '' ? getDefaultHeadImg(petResume.species) : petResume.headImg}></AtAvatar>
        </View>
        <View className='petResume' >
          <Text>昵称：{petResume.nickName}</Text>
          <Text>年龄：{jsGetAge(petResume.birthday)} 岁</Text>
          <Text>性别：{getGenderStr(petResume.gender)}</Text>
        </View>
      </View>
    )
  }
}