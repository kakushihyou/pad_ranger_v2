import React, { Component } from 'react'
import Taro, { getCurrentInstance, getCurrentPages } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtButton, AtAvatar, AtIcon } from 'taro-ui'
import {getDefaultHeadImg, getGenderStr, jsGetAge, getSpeciesMemo, getSterilizationMemo, getInoculationMemo} from '../../../util/tool'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './diaryDetail.scss'
import Httpclient from '../../../../httpclient/http'
import BackGroundPng from '../../../assets/background/background_cat.png'
import Config from '../../../config/globalConfig.json'

export default class DiaryDetail extends Component {

  constructor(props) {
    super(props)
    this.state = {
      diaryDetail: {},
      modifyShow: false
    }
    this.trash = this.trash.bind(this)
    this.edit = this.edit.bind(this)
  }

  componentDidShow = () => { 
    console.log('getCurrentInstance().router.params')
    // TODO 获取宠物详情
    Httpclient.get(
      Config.request_host + '/diary/detail?diaryID=' + getCurrentInstance().router.params.ID)
      .then(res => {
        console.log(res.Data)
        let today = new Date()
        let todayYear = today.getFullYear()
        let todayMonth = today.getMonth()
        let todayDate = today.getDate()

        let diaryTime = new Date(res.Data.diaryTime)
        console.log(diaryTime)
        let diaryYear = diaryTime.getFullYear()
        let diaryMonth = diaryTime.getMonth()
        let diaryDate = diaryTime.getDate()

        let modifyShow = false
        if (todayYear === diaryYear && todayMonth === diaryMonth && todayDate === diaryDate) {
          modifyShow = true
        }
        this.setState({
          diaryDetail: res.Data,
          modifyShow: modifyShow
        })
      })
      .catch(err => {
        console.error(err)
        Taro.showToast({
          title: '出错了？朕很生气！',
          icon: "none",
          duration: 1200
        })
        return
      })
  }

  edit = () => {
    console.log('详情页跳转到修改页')
    Taro.navigateTo({
      url: '/diary/pages/diaryUpdate/diaryUpdate?diaryID=' + this.state.diaryDetail.id
    })
  }

  trash = () => {
    let diaryDetail = this.state.diaryDetail
    Taro.showModal({
      cancelText:'再想想',
      cancelColor:'#FFC1C1',
      confirmText:'确定',
      confirmColor:'#9BCEFA',
      content: '确定要删除吗？',
      showCancel: true,  //是否显示取消按钮
      success(res)
      {
          if(res.confirm)
          {
            console.log('删除')
            Httpclient.delete(Config.request_host + '/diary?diaryID=' + diaryDetail.id)
            .then(res => {
              Taro.showToast({
                title: '删除成功',
                duration: 1200,
                icon: "none"
              })
              Taro.setStorageSync('deleteDiaryID', diaryDetail.id)
              Taro.switchTab({
                url: '../../../pages/diary/diary'
              })
            })
            .catch(err => {
              console.error(err)
              Taro.showToast({
                title: '咋还删不掉了呢',
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


  render () {
    let diaryDetail = this.state.diaryDetail
    console.log(diaryDetail)
    let diaryTime = new Date(diaryDetail.diaryTime)
    return (
      <View className='top' >
        <View class="op">
          <Image class='background-image' src={BackGroundPng} ></Image>  
        </View>
        <View className='detail'>
          <View className='header'>
            <View className='diaryTime'>{diaryTime.toLocaleDateString()}</View>
            {/* <View className='diaryTime'>{diaryDetail.diaryTimeStr}</View> */}
            <View className='mood'>心情分: {diaryDetail.mood}</View> 
            <View className='weather'>{diaryDetail.weather}</View>
          </View>
          <View className='content'>{diaryDetail.content}</View>
          {
            this.state.modifyShow ? (<AtButton className='modify' type='primary' size='small' circle onClick={this.edit}>修改</AtButton>) : ''
          }
          <AtButton className='delete' type='primary' size='small' circle onClick={this.trash}>删除</AtButton>
        </View>
      </View>
    )
  }
}
