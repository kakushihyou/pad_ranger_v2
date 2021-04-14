import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton, AtIcon } from 'taro-ui'
import Taro, {getCurrentPages} from '@tarojs/taro'
import {getVaccineTypeMemo} from '../../util/tool'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './petInoculationItem.scss'
import Httpclient from '../../../httpclient/http'
import Config from '../../config/globalConfig.json'

export default class PetInoculationItem extends Component {

  constructor(props) {
    super(props)
  }

  trash = () => {
    console.log('开始删除')
    let petInoculationItem = this.props.info
    let callback = this.props.callback
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
            Httpclient.delete(Config.request_host + '/pet/inoculation?ID=' + petInoculationItem.id)
            .then(res => {
              Taro.showToast({
                title: '朕是不会生病的～',
                duration: 1200,
                icon: "none",
                complete: function() {
                  // var page = getCurrentPages().pop()
                  //   console.log(page)
                  //   if (page == undefined || page == null) {
                  //     return
                  //   }
                  //   page.onShow()
                  callback()
                }
              })
            })
            .catch(err => {
              console.error(err)
              Taro.showToast({
                title: '咋还删不掉了呢～',
                icon: "none",
                duration: 1200
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
    let inoculationID = this.props.info.id
    Taro.navigateTo({
      url: '/case/pages/inoculationUpdate/inoculationUpdate?inoculationID=' + inoculationID
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
    let petInoculationDetail = this.props.info
    return (
      <View className='singleDewormingInfo'>
          <View className='at-icon'>
            <AtIcon className='trash' value='trash' size='20' color='#FFC1C1' onClick={this.trash.bind(this)}></AtIcon>
            <AtIcon className='edit' value='edit' size='20' color='#FFC1C1' onClick={this.edit.bind(this)}></AtIcon>
          </View>
          <Text>疫苗类型：{getVaccineTypeMemo(petInoculationDetail.vaccineType)}</Text>
          <Text>疫苗名称：{petInoculationDetail.vaccineName}</Text>
          <Text>生产厂商：{petInoculationDetail.manufacturer}</Text>
          <Text>当前体重：{petInoculationDetail.weight} KG</Text>
          <Text>用药剂量：{petInoculationDetail.dosage}</Text>
          <Text>接种日期：{petInoculationDetail.inoculationDate}</Text>
          <Text>下次接种：{petInoculationDetail.nextInoculationDate}</Text>
          <Text>驱虫地点：{petInoculationDetail.inoculationAddress}</Text>
          <Text>宠物医师：{petInoculationDetail.doctor}</Text>
      </View>
    )
  }
}