import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import "taro-ui/dist/style/components/button.scss" // 按需引入
import './medicalTreatment.scss'
import Httpclient from '../../../httpclient/http'
import PetGeneralSituation from '../../components/petGeneralSituation/petGeneralSituation'
import Config from '../../config/globalConfig.json'

export default class Case extends Component {

  constructor(props) {
    super(props)
    this.state = {
      // userID: '1000000002',
      petGeneralSituationList: []
    }
  }

  componentDidShow() {
    Taro.hideToast()
    let userID = Taro.getStorageSync('userID') 
    console.log('UserID是' + userID)
    if (userID) {
      
      // 获取宠物概要列表
      Httpclient.get(Config.request_host + '/pet/total?userID=' + Taro.getStorageSync('userID'))
      .then(res => {
        console.log(res.Data)

        if (res.Data.count < 1) {
          console.log('未找到宠物信息')
          Taro.showToast({
            title: '请先添加宠物信息',
            icon: 'none',
            duration: 1200,
          })

          this.setState({
            petGeneralSituationList: []
          })
        } else {
          console.log()
          let petGeneralSituationList = res.Data.petGeneralSituationList

          console.log('设置到state中')
          this.setState({
            petGeneralSituationList: petGeneralSituationList
          })
    
          console.log(this.state.petGeneralSituationList)
        }
      })
      .catch(err => {
        console.error(err)
        return
      })
    } else {

      console.log('宠物概要信息页面，用户未登录')
      Taro.showToast({
        title: '请先添加宠物信息',
        icon: 'none',
        duration: 1200,
      })

      this.setState({
        petGeneralSituationList: []
      })
    }
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
