import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton, AtIcon } from 'taro-ui'
import Taro from '@tarojs/taro'
import {getDewormingTypeMemo} from '../../util/tool'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './petDewormingItem.scss'
import Httpclient from '../../../httpclient/http'

export default class PetDewormingItem extends Component {

  constructor(props) {
    super(props)
  }

  trash = () => {
    console.log('开始删除')
    let petDewormingItem = this.props.info
    Taro.showModal({
      cancelText:'点错了',
      cancelColor:'#FFC1C1',
      confirmText:'没病',
      confirmColor:'#9BCEFA',
      content: '朕没病？',
      showCancel: true,  //是否显示取消按钮
      success(res)
      {
          if(res.confirm)
          {
            console.log('删除')
            Httpclient.delete('http://localhost:9669/pet/deworming?ID=' + petDewormingItem.id)
            .then(res => {
              Taro.showToast({
                title: '朕是不会生病的～',
                duration: 3200,
                icon: "none"
              })
            })
            .catch(err => {
              console.error(err)
              Taro.showToast({
                title: '咋还删不掉了呢～',
                icon: "none"
              })
              return
            })
          }else if(res.cancel)
          {
            console.log('取消删除')
          }
      }
    })

  }

  edit = () => {
    console.log('跳转到修改页面')
    let dewormingID = this.props.info.id
    Taro.navigateTo({
      url: '/pages/dewormingUpdate/dewormingUpdate?dewormingID=' + dewormingID
    })
  }

  render () {

    // dewormingAddress: "上海市宠乐宠物医院"
    // dewormingDate: "2015-06-15"
    // dewormingType: 1 (1:体内，2:体外)
    // doctor: "李大夫"
    // dosage: "1颗"
    // id: 100001
    // manufacture: "上海宠物体内驱虫药品有限公司"
    // medication: "体内驱虫"
    // nextDewormingDate: ""
    // petID: 100000
    // remind: 1
    // remindTime: "2015-09-15"
    let petDewormingDetail = this.props.info
    return (
      <View className='singleDewormingInfo'>
          <View className='at-icon'>
            <AtIcon className='trash' value='trash' size='20' color='#FFC1C1' onClick={this.trash.bind(this)}></AtIcon>
            <AtIcon className='edit' value='edit' size='20' color='#FFC1C1' onClick={this.edit.bind(this)}></AtIcon>
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