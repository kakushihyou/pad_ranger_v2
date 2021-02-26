import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton, AtIcon, AtFloatLayout } from 'taro-ui'
import Taro from '@tarojs/taro'
import {getWeekdayMemo, getDiagnosisTypeMemo} from '../../util/tool'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './diaryItem.scss'

export default class DiaryItem extends Component {

  constructor(props) {
    super(props)
    
  }

  handleClick = () => {
    console.log('跳转到日记详情页面')
    console.log('日记ID是' + this.props.info.id)
    Taro.navigateTo({
      url:'/diary/pages/diaryDetail/diaryDetail?ID=' + this.props.info.id
    })
  }

  render () {

    let diaryDetail = this.props.info
    console.log(diaryDetail)
    let year = diaryDetail.diaryTime.split('-')[0]
    let month = diaryDetail.diaryTime.split('-')[1]
    let day = diaryDetail.diaryTime.split('-')[2].split(' ')[0]
    let time = diaryDetail.diaryTime.split(' ')[1]
    let tipStyle = ''
    if (diaryDetail.mood < 40) {
      tipStyle = 'color:#efc1c2'
    } else if (diaryDetail.mood < 70) {
      tipStyle = 'color:#9BCEFA'
    } else {
      tipStyle = 'color:#afcd50'
    }

    return (
      
      <View className='tips' style={tipStyle} onClick={this.handleClick.bind(this)}>
        <View className='date-view'>
          <View className='year-month'>{year}-{month}</View>
          <View className='day'>{day}</View>
          <View className='weekday'>{getWeekdayMemo(diaryDetail.week)}</View>
        </View>
        {/* <View className='time'>{time}</View> */}
        {/* <View className='mood'>心情分: {diaryDetail.Mood}</View>  */}
        {/* <View className='weather'>{diaryDetail.Weather}</View> */}
        <View className='content'>{diaryDetail.content}</View>
      </View>
    )
  }
}