import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtButton, AtInput, AtTextarea, AtMessage } from 'taro-ui'
import {getCurrentDate} from '../../util/tool'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './diaryAdd.scss'
import Httpclient from '../../../httpclient/http'
import BackGroundPng from '../../assets/background/background_cat.png'

export default class DiaryUpdate extends Component {

  constructor(props) {
    super(props)
    this.state = {
      mood: '',
      weather: '',
      content: '',
      saved: false,
      errMsgMap: new Map()
    }
  }

  onMoodChange = (value) => {
    console.log(value)
    let errMsgMap = this.state.errMsgMap
    let errMsg = '试着给自己安排一种心情？'
    if (value == null || value == '') {
      Taro.atMessage({
        message: errMsg,
        type: 'error',
        duration: 2000
      })
      errMsgMap.set('mood', errMsg)
      this.setState({
        mood: '',
        errMsgMap: errMsgMap
      })
    } else {
      if (Number(value) > 100 || Number(value) < 0) {
        Taro.atMessage({
          message: '情绪太低落和太高涨都不太好噢～',
          type: 'error',
          duration: 2000
        })
        errMsgMap.set('mood', '情绪太低落和太高涨都不太好噢～')
      } else {
        this.setState({
          mood: Number(value)
        })
        errMsgMap.delete('mood')
      }
    }

    return value
  }

  onWeatherChange = (value) => {
    console.log(value)
    let errMsgMap = this.state.errMsgMap
    let errMsg = '选一个合适的天气？'
    if (value == null || value == '') {
      Taro.atMessage({
        message: errMsg,
        type: 'error',
        duration: 2000
      })
      errMsgMap.set('weather', errMsg)
      this.setState({
        weather: '',
        errMsgMap: errMsgMap
      })
    } else {
      this.setState({
        weather: value
      })
      errMsgMap.delete('weather')
    }

    return value
  }

  onContentChange = (value) => {
    console.log(value)
    let errMsgMap = this.state.errMsgMap
    let errMsg = '试着整理一下心情？'
    if (value == null || value == '') {
      Taro.atMessage({
        message: errMsg,
        type: 'error',
        duration: 2000
      })
      errMsgMap.set('content', errMsg)
      this.setState({
        content: '',
        errMsgMap: errMsgMap
      })
    } else {
      this.setState({
        content: value
      })
      errMsgMap.delete('content')
    }

    return value
  }

  commit = (e) =>{
    console.log('提交')
    console.log(this.state.errMsgMap)
    let errMsgMap = this.state.errMsgMap
    if (errMsgMap != null && errMsgMap.size != 0) {
      console.log('有错误')
      let msgList = []
      errMsgMap.forEach(function(v, k) {
        console.log(k + ':' + v)
        msgList.push(v)
      })

      console.log(msgList)
      Taro.atMessage({
        message: msgList.pop(),
        type: 'error',
        duration: 3000
      })
    } else {
      console.log('用户ID是' + getCurrentInstance().router.params.userID)
      var requestBody = {
        UserID: Number(getCurrentInstance().router.params.userID),
        Weather: this.state.weather,
        Mood: this.state.mood,
        Content: this.state.content
      }

      console.log(requestBody)
      Httpclient.put(
        'http://localhost:9669/diary', requestBody, 'application/json')
      .then(res => {
        console.log(res)
        if (res.Success) {
          Taro.showToast({
            title: '干的漂亮！',
            duration: 3200,
            icon: "none",
            complete: function() {
              Taro.navigateBack({
                delta: 1
              })
            }
          })
        } else {
          Taro.atMessage({
            message: res.Message,
            type: 'error',
            duration: 3000
          })
        }
      })
      .catch(err => {
        console.error(err)
        Taro.atMessage({
          message: '出错了？朕很生气！',
          type: 'error',
          duration: 3000
        })
      })
    }
  }

  goback = () => {
    Taro.showmoodal({
      cancelText:'稍后再来',
      cancelColor:'#FFC1C1',
      confirmText:'去保存',
      confirmColor:'#9BCEFA',
      content:'今天的心情尚未记录噢',
      showCancel: true,  //是否显示取消按钮
      success(res)
      {
          if(res.confirm)
          {
            console.log('留在页面')
            return
          }else if(res.cancel)
          {
            console.log('返回')
            Taro.navigateBack({
              delta: 1
            })
          }
      }
    })
  }


  render () {
    return (
      <View className='top' >
        <AtMessage /> 
        <View class="op">
          <Image class='background-image' src={BackGroundPng} ></Image>  
        </View>
        <View className='detail'>
          {/* <View className='header'> */}
            <AtInput class='rightInput' name='mood' type='number' title='心情分' border={true} adjustPosition={true} placeholder='请输入心情分(0-100之间)' value={this.state.mood} onChange={this.onMoodChange.bind(this)} />
            <AtInput class='rightInput' name='weather' type='text' title='天气' border={true} adjustPosition={true} placeholder='请输入天气' value={this.state.weather} onChange={this.onWeatherChange.bind(this)}/>
          {/* </View> */}
          <AtTextarea class='textarea' name='content' value={this.state.content} onChange={this.onContentChange.bind(this)} maxLength={500} placeholder='开始整理你的心情吧～'  height='680' />
          <AtButton className='confirm' type='primary' size='small' circle onClick={this.commit.bind(this)}>确认</AtButton>
          <AtButton className='cancel' type='primary' size='small' circle onClick={this.goback.bind(this)}>取消</AtButton>
        </View>
      </View>
    )
  }
}
