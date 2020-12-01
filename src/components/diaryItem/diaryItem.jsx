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

  render () {

    let diaryDetail = this.props.info
    console.log(diaryDetail)
    let year = diaryDetail.DiaryTime.split('-')[0]
    let month = diaryDetail.DiaryTime.split('-')[1]
    let day = diaryDetail.DiaryTime.split('-')[2].split(' ')[0]
    let time = diaryDetail.DiaryTime.split(' ')[1]
    let tipStyle = ''
    if (diaryDetail.Mood < 40) {
      tipStyle = 'color:#efc1c2'
    } else if (diaryDetail.Mood < 70) {
      tipStyle = 'color:#9BCEFA'
    } else {
      tipStyle = 'color:#afcd50'
    }

    return (
      
      <View className='tips' style={tipStyle}>
        <View className='date-view'>
          <View className='year-month'>{year}-{month}</View>
          <View className='day'>{day}</View>
          <View className='weekday'>{getWeekdayMemo(diaryDetail.Week)}</View>
        </View>
        {/* <View className='time'>{time}</View> */}
        {/* <View className='mood'>心情分: {diaryDetail.Mood}</View>  */}
        {/* <View className='weather'>{diaryDetail.Weather}</View> */}
        <View className='content'>{diaryDetail.Content}</View>
      </View>
    )
  }
}