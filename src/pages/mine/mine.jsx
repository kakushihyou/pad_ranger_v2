import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton, AtAvatar } from 'taro-ui'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './mine.scss'
import Httpclient from '../../../httpclient/http'
import  SignlePetResume  from "../../components/singlePetResume/singlePetResume";

export default class Mine extends Component {

  constructor(props) {
    super(props)
    this.state = {
      petResumeList: []
    }
  }

  componentWillMount () {
  
   }

  componentDidMount () {
    
   }

  render () {
    // console.log('开始渲染页面' + JSON.stringify(this.state.petResumeList))
    return (
      
      this.state.petResumeList.map((item) => {
        return (
          <View className='index'>
            <SignlePetResume petResume={item} />
          </View>
        )
      })
    )
  }
}
