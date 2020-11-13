import React, { Component } from 'react'
import Taro, { getCurrentInstance, getCurrentPages } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton, AtAvatar } from 'taro-ui'
import {getDefaultHeadImg, getGenderStr, jsGetAge, getSpeciesMemo, getSterilizationMemo, getInoculationMemo} from '../../util/tool'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './petDetail.scss'
import Httpclient from '../../../httpclient/http'

export default class PetDetail extends Component {

  constructor(props) {
    super(props)
    this.state = {
      petDetail: {}
    }
    this.modifyPet = this.modifyPet.bind(this)
    this.deletePet = this.deletePet.bind(this)
  }



  componentDidShow () { 
    console.log(getCurrentInstance().router.params)
    // TODO 获取宠物详情
    Httpclient.get(
      'http://localhost:9669/pet/detail?ID=' + getCurrentInstance().router.params.petID)
      .then(res => {
        console.log(res.Data)
        this.setState({
          petDetail: res.Data
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

  handleClick() {
    // TODO 跳转到病例页面
    Taro.switchTab({
      url: '/pages/case/case?tab=inoculation'
    })
  }

  modifyPet = () =>{
    console.log('详情页跳转到修改页')
    Taro.navigateTo({
      url: '/pages/petUpdate/petUpdate?petID=' + this.state.petDetail.id
    })
  }

  deletePet = () => {
    let petDetail = this.state.petDetail
    Taro.showModal({
      cancelText:'好',
      cancelColor:'#FFC1C1',
      confirmText:'狠心拒绝',
      confirmColor:'#9BCEFA',
      content: petDetail.nickName + '想继续守在你身边，可以吗？',
      showCancel: true,  //是否显示取消按钮
      success(res)
      {
          if(res.confirm)
          {
            console.log('删除')
            Httpclient.delete('http://localhost:9669/pet?ID=' + petDetail.id)
            .then(res => {
              Taro.showToast({
                title: petDetail.accompanyDays + '天，谢谢你',
                duration: 3200,
                icon: "none"
              })

              Taro.switchTab({
                url: '../../pages/index/index'
              })
            })
            .catch(err => {
              console.error(err)
              Taro.showToast({
                title: '再陪你一会儿',
                icon: "none"
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
    let petDetail = this.state.petDetail
    return (
      <View className='detail'>
        <View className='header '>
          <View className='photo'>
            <AtAvatar circle image={petDetail.headImg === '' ? getDefaultHeadImg(petDetail.species) : petDetail.headImg}></AtAvatar>
          </View>
          <View className='memo'>
            <Text className='nickname'>{petDetail.nickName}</Text>
            <Text>这是{petDetail.nickName}陪伴你的第{petDetail.accompanyDays}天</Text>
          </View>
        </View>
        <View className='center'>
          <View>性别：{getGenderStr(petDetail.gender)}</View>
          <View>年龄：{jsGetAge(petDetail.birthday || "")}岁</View>
          <View>种类：{getSpeciesMemo(petDetail.species)}</View>
          {/* <View>品种：山大王</View> */}
          <View>花色：{petDetail.colour}</View>
          <View>生日：{petDetail.birthday}</View>
          <View>接驾日期：{petDetail.adoptDate}</View>
          <View>体重：{petDetail.weight}KG</View>
          <View>是否绝育：{getSterilizationMemo(petDetail.sterilizationFlag)}</View>
          <View>绝育时间：{petDetail.sterilizationDate}</View>
          <View>是否接种疫苗：{getInoculationMemo(petDetail.inoculationFlag)}</View>
          <View>接种详情：<Text className='clickLook' onClick={this.handleClick}>点击查看</Text></View>
        </View>
        <AtButton className='modify' type='primary' size='small' circle onClick={this.modifyPet}>修改</AtButton>
        <AtButton className='delete' type='primary' size='small' circle onClick={this.deletePet}>删除</AtButton>
      </View>
    )
  }
}
