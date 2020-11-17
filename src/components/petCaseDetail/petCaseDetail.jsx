import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton, AtIcon, AtFloatLayout } from 'taro-ui'
import Taro from '@tarojs/taro'
import {getInitialDiagnosisMemo, getDiagnosisTypeMemo} from '../../util/tool'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './petCaseDetail.scss'

export default class PetCaseDetail extends Component {

  constructor(props) {
    super(props)

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
        <View className='caseDetail'>
          <Text>就诊地点：{petCaseDetail.diagnosisAddress}</Text>
          <Text>就诊日期：{petCaseDetail.diagnosisDate}</Text>
          <Text>当前体重：{petCaseDetail.weight} KG</Text>
          <Text>就诊年龄：{petCaseDetail.age} 岁</Text>
          <Text>是否初诊：{getInitialDiagnosisMemo(petCaseDetail.isInitial)}</Text>
          <Text>症状概述：{petCaseDetail.symptom}</Text>
          <Text>诊断结果：{petCaseDetail.diagnosisResult}</Text>
          <Text>治疗方法：{petCaseDetail.therapy}</Text>
          <Text>治疗用药：{petCaseDetail.medication}</Text>
          <Text>宠物医师：{petCaseDetail.doctor}</Text>
        </View>
      </View>
    )
  }
}