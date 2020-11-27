import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton, AtSearchBar, AtFab} from 'taro-ui'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './diary.scss'
import DiaryItem from '../../components/diaryItem/diaryItem'
import HttpClient from '../../../httpclient/http'

export default class Diary extends Component {

  constructor(props) {
    super(props)
    this.state = {
      condition: '',
      diaryList: []
    }
  }

  componentDidShow = () => {
    // TODO 获取用户日记列表
    Httpclient.get('http://localhost:9669/pet/inoculation/list?petID=' + getCurrentInstance().router.params.petID)
    .then(res => {
      console.log(res.Data)
      if (res.Data.count > 0) {
        this.setState({
          petInoculationList: res.Data.petInoculationList
        })
      }
    })
    .catch(err => {
      console.error(err)
      Taro.showToast({
        title: '出错了？朕很生气！',
        icon: "none"
      })
      return
    })
  }

  onChange = () => {

  }

  onActionClick = () => {

  }

  onButtonClick = () => {

  }

  render () {
    return (
      <View className='diary'>
        <AtSearchBar inputType='number' value={this.state.condition} onChange={this.onChange.bind(this)} onActionClick={this.onActionClick.bind(this)} />
        {
          this.state.diaryList.length > 0 ? (
            <View className='card'>
              {
                this.state.diaryList.map((item) => {
                  return (
                    <DiaryItem info={item}/>
                  )
                })
              }
            </View>
          ) : (<View /> )
        }
          
        <View className="post-button">
          <AtFab className='fabButton' onClick={this.onButtonClick.bind(this)} size='small'>
            <Text className="at-fab__icon at-icon at-icon-add"></Text>
          </AtFab>
        </View>
      </View>
    )
  }
}
