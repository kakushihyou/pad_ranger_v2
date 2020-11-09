import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './medicalTreatment.scss'
import Httpclient from '../../../httpclient/http'
import PetGeneralSituation from '../../components/petGeneralSituation/petGeneralSituation'

export default class Case extends Component {

  constructor(props) {
    super(props)
    this.state = {
      userID: '1000000002',
      petGeneralSituationList: []
    }
  }

  componentDidShow = () => {
    // TODO 获取宠物概要列表
    Httpclient.get('http://localhost:9669/pet/total?userID=' + this.state.userID)
    .then(res => {
      console.log(res.Data)

      if (res.Data.count < 1) {
        console.log('未找到宠物信息')
        return (
          <View className='noData'>
            <Text>主人，啥也没找到</Text> 
          </View>
        )
      }
      let petGeneralSituationList = res.Data.petGeneralSituationList

      console.log('设置到state中')
      this.setState({
        petGeneralSituationList: petGeneralSituationList
      })

      console.log(this.state.petGeneralSituationList)
    })
    .catch(err => {
      console.error(err)
      return
    })
  }

  render () {
    return (
      this.state.petGeneralSituationList.map((item) => {
        return (
          <View className='list'>
            <PetGeneralSituation info={item}/>
          </View>
        )
      })
    )
  }
}
