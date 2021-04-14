import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton, AtIcon, AtFloatLayout } from 'taro-ui'
import Taro , {getCurrentPages}from '@tarojs/taro'
import {getInitialDiagnosisMemo, getDiagnosisTypeMemo} from '../../util/tool'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './petCaseItem.scss'
import Httpclient from '../../../httpclient/http'
import Config from '../../config/globalConfig.json'

export default class PetCaseItem extends Component {

  constructor(props) {
    super(props)
  }

  trash = () => {
    console.log('开始删除')
    let petCaseItem = this.props.info
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
            Httpclient.delete(Config.request_host + '/pet/case?ID=' + petCaseItem.id)
            .then(res => {
              Taro.showToast({
                title: '朕是不会生病的～',
                duration: 1200,
                icon: "none",
                complete: function() {
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
    let caseID = this.props.info.id
    let petID = this.props.info.petID
    Taro.navigateTo({
      url: '/case/pages/caseUpdate/caseUpdate?caseID=' + caseID + '&petID=' + petID
    })
  }

  render () {

    // diagnosisAddress: "二丫宠物医"
    // diagnosisDate: "2020-03-12"
    // diagnosisResult: "体内毛团过多"
    // diagnosisType: 1
    // doctor: "李医生"
    // id: 100001
    // isInitial: 1
    // medication: "化毛膏"
    // petID: 100000
    // preID: 0
    // remind: 1
    // remindTime: "2020-05-12 04:00:00"
    // revisit: "2020-05-12"
    // symptom: "频繁呕吐"
    // therapy: "吃化毛膏"
    // weight: 0
    let petCaseDetail = this.props.info
    return (
      <View>
        <View className='singleCaseInfo'>
          <View className='at-icon'>
            <AtIcon className='trash' value='trash' size='20' color='#FFC1C1' onClick={this.trash.bind(this)}></AtIcon>
            <AtIcon className='edit' value='edit' size='20' color='#FFC1C1' onClick={this.edit.bind(this)}></AtIcon>
          </View>
          <Text>就医类型：{getDiagnosisTypeMemo(petCaseDetail.diagnosisType)}</Text>
          <Text>就诊地点：{petCaseDetail.diagnosisAddress}</Text>
          <Text>就诊日期：{petCaseDetail.diagnosisDate}</Text>
          <Text>当前体重：{petCaseDetail.weight} KG</Text>
          <Text>就诊年龄：{petCaseDetail.age} 岁</Text>
          <Text>是否初诊：{getInitialDiagnosisMemo(petCaseDetail.isInitial)}</Text>
          <View>上次诊疗：{petCaseDetail.preID === 0 ? '无' : (<Text className='clickLook' onClick={() => this.props.handleFloatLayoutShow(petCaseDetail.preID)}>点击查看</Text>)}</View>
          <Text>症状概述：{petCaseDetail.symptom}</Text>
          <Text>诊断结果：{petCaseDetail.diagnosisResult}</Text>
          <Text>治疗方法：{petCaseDetail.therapy}</Text>
          <Text>治疗用药：{petCaseDetail.medication}</Text>
          <Text>复诊日期：{petCaseDetail.revisit}</Text>
          <Text>宠物医师：{petCaseDetail.doctor}</Text>
        </View>
      </View>
    )
  }
}