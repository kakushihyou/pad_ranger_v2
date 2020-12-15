import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtButton, AtInput, AtTextarea, AtMessage } from 'taro-ui'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './diaryUpdate.scss'
import Httpclient from '../../../httpclient/http'
import BackGroundPng from '../../assets/background/background_cat.png'

export default class DiaryUpdate extends Component {

  constructor(props) {
    super(props)
    this.state = {
      diaryDetail: {},
      mod: '',
      weather: '',
      content: '',
      changed: false,
      saved: false,
      errMsgMap: new Map()
    }
  }

  componentWillMount = () => { 
    console.log('getCurrentInstance().router.params')
    // TODO 获取宠物详情
    Httpclient.get(
      'http://localhost:9669/diary/detail?diaryID=' + getCurrentInstance().router.params.diaryID)
      .then(res => {
        console.log(res.Data)
        this.setState({
          diaryDetail: res.Data,
          mod: res.Data.mod,
          weather: res.Data.weather,
          content: res.Data.content
        })
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

  onModChange = (value) => {
    console.log(value)
    let errMsgMap = this.state.errMsgMap
    let errMsg = '试着给自己安排一种心情？'
    if (value == null || value == '') {
      Taro.atMessage({
        message: errMsg,
        type: 'error',
        duration: 2000
      })
      errMsgMap.set('mod', errMsg)
      this.setState({
        mod: '',
        errMsgMap: errMsgMap
      })
    } else {
      let diaryDetail = this.state.diaryDetail
      diaryDetail.mod = value
      this.setState({
        mod: value,
        diaryDetail: diaryDetail,
        changed: true
      })
      errMsgMap.delete('mod')
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
      let diaryDetail = this.state.diaryDetail
      diaryDetail.weather = value
      this.setState({
        weather: value,
        diaryDetail: diaryDetail,
        changed: true
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
      let diaryDetail = this.state.diaryDetail
      diaryDetail.content = value
      this.setState({
        content: value,
        diaryDetail: diaryDetail,
        changed: true
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
      var requestBody = {
        ID: this.state.diaryDetail.id,
        Title: this.state.diaryDetail.title,
        DiaryTime: this.state.diaryDetail.diaryTime,
        Weather: this.state.diaryDetail.weather,
        Mod: this.state.diaryDetail.mod,
        Content: this.state.diaryDetail.content, 
        Images: this.state.diaryDetail.images
      }

      console.log(requestBody)
      Httpclient.post(
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
    if (this.state.changed) {
      Taro.showModal({
        cancelText:'稍后再来',
        cancelColor:'#FFC1C1',
        confirmText:'去保存',
        confirmColor:'#9BCEFA',
        content:'今天的心情尚未保存噢',
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
    } else {
      aro.navigateBack({
        delta: 1
      })
    }
  }


  render () {
    let diaryDetail = this.state.diaryDetail
    console.log(diaryDetail)
    let diaryTime = new Date(diaryDetail.diaryTime)
    return (
      <View className='top' >
        <AtMessage /> 
        <View class="op">
          <Image class='background-image' src={BackGroundPng} ></Image>  
        </View>
        <View className='detail'>
          <View className='header'>
            <AtInput class='rightInput' name='mod' type='text' title='心情分' border={true} adjustPosition={true} placeholder='请输入心情分' value={this.state.mod} onChange={this.onModChange.bind(this)} />
            <AtInput class='rightInput' name='weather' type='text' title='天气' border={true} adjustPosition={true} placeholder='请输入天气' value={this.state.weather} onChange={this.onWeatherChange.bind(this)}/>
          </View>
          <AtTextarea name='content' value={this.state.content} onChange={this.onContentChange.bind(this)} maxLength={500} placeholder='开始整理你的心情吧～' />
          <AtButton className='confirm' type='primary' size='small' circle onClick={this.commit.bind(this)}>确认</AtButton>
          <AtButton className='cancel' type='primary' size='small' circle onClick={this.goback.bind(this)}>取消</AtButton>
        </View>
      </View>
    )
  }
}
