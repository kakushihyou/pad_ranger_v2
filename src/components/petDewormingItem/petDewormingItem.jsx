import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton, AtIcon } from 'taro-ui'
import Taro from '@tarojs/taro'
import {getDewormingTypeMemo} from '../../util/tool'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './petDewormingItem.scss'


export default class PetDewormingItem extends Component {

  constructor(props) {
    super(props)
  }


  render () {

    // dewormingAddress: "上海市宠乐宠物医院"
    // dewormingDate: "2015-06-15"
    // dewormingType: 1 (1:体内，2:体外)
    // doctor: "李大夫"
    // dosage: "1颗"
    // id: 100001
    // manufacturer: "上海宠物体内驱虫药品有限公司"
    // medication: "体内驱虫"
    // nextDewormingDate: ""
    // petID: 100000
    // remind: 1
    // remindTime: "2015-09-15"
    let petDewormingDetail = this.props.info
    return (
      <View className='singleDewormingInfo'>
          <View className='at-icon'>
          <AtIcon className='trash' value='trash' size='20' color='#FFC1C1'></AtIcon>
            <AtIcon className='edit' value='edit' size='20' color='#FFC1C1'></AtIcon>
          </View>
          <Text>驱虫类型：{getDewormingTypeMemo(petDewormingDetail.dewormingType)}</Text>
          <Text>药物名称：{petDewormingDetail.medication}</Text>
          <Text>生产厂商：{petDewormingDetail.manufacturer}</Text>
          <Text>当前体重：{petDewormingDetail.weight} KG</Text>
          <Text>用药剂量：{petDewormingDetail.dosage}</Text>
          <Text>驱虫日期：{petDewormingDetail.dewormingDate}</Text>
          <Text>下次驱虫：{petDewormingDetail.nextDewormingDate}</Text>
          {/* <Text>提醒日期：{petDewormingDetail.remindTime}</Text> */}
          <Text>驱虫地点：{petDewormingDetail.dewormingAddress}</Text>
          <Text>宠物医师：{petDewormingDetail.doctor}</Text>
      </View>
    )
  }
}