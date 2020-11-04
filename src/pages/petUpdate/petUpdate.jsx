import React, { Component } from 'react'
import Taro, { getCurrentInstance, getCurrentPages } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import { AtButton, AtAvatar, AtList, AtListItem, AtInput } from 'taro-ui'
import {getDefaultHeadImg, getGenderStr, jsGetAge, getSpeciesMemo, getSterilizationMemo} from '../../util/tool'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './petUpdate.scss'
import Httpclient from '../../../httpclient/http'

export default class PetUpdate extends Component {

  constructor(props) {
    super(props)
    this.state = {
      petDetail: {},
      genderSelector: ['公', '母'],
      genderSelectorChecked: '',
      speciesSelector: ['猫', '狗'],
      speciesSelectorChecked: '',
      sterilizationSelector: ['已绝育', '未绝育'],
      sterilizationSelectorChecked: ''
    }
    
    this.commit = this.commit.bind(this)
    this.goback = this.goback.bind(this)
  }



  componentWillMount () { 
    console.log(getCurrentInstance().router.params)
    // TODO 获取宠物详情
    Httpclient.get(
      'http://localhost:9669/pet/detail?ID=' + getCurrentInstance().router.params.petID)
      .then(res => {
        console.log(res.Data)
        this.setState({
          petDetail: res.Data,
          genderSelectorChecked: getGenderStr(res.Data.gender),
          speciesSelectorChecked: getSpeciesMemo(res.Data.species)
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

  commit = () =>{
    

  }

  goback = () => {
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
            // console.log('删除')
            // Httpclient.delete('http://localhost:9669/pet?ID=' + '100000')
            // .then(res => {
              Taro.showToast({
                title: petDetail.accompanyDays + '天，谢谢你',
                duration: 3200,
                icon: "none"
              })

              Taro.switchTab({
                url: '../../pages/index/index'
              })
            // })
            // .catch(err => {
            //   console.error(err)
            //   Taro.showToast({
            //     title: '再陪你一会儿',
            //     icon: "none"
            //   })
            //   return
            // })
          }else if(res.cancel)
          {
            console.log('取消删除')
          }
      }
    })
  }

  onClick = () => {

  }


  render () {
    let petDetail = this.state.petDetail
    return (
      <View className='modify'>
        <View className='photo'>
          <AtAvatar circle image={petDetail.headImg === '' ? getDefaultHeadImg(petDetail.species) : petDetail.headImg}></AtAvatar>
        </View>
        <View className='center'>
          <Picker class='picker' mode='selector' range={this.state.genderSelector} onChange={this.onChange}>
            <AtList>
              <AtListItem title='性别' extraText={this.state.genderSelectorChecked} />
            </AtList>
          </Picker>
          <Picker class='picker' mode='selector' range={this.state.speciesSelector} onChange={this.onChange}>
            <AtList>
              <AtListItem title='种类' extraText={this.state.speciesSelectorChecked} />
            </AtList>
          </Picker>
          <AtInput class='rightInput' name='colour' type='text' title='花色' placeholder='请输入花色' value={petDetail.colour} />
          <View>生日：{petDetail.birthday}</View>
          <View>接驾日期：{petDetail.adoptDate}</View>
          <View>体重：{petDetail.weight}KG</View>
          <View>是否绝育：{getSterilizationMemo(petDetail.sterilizationFlag)}</View>
          <View>绝育时间：{petDetail.sterilizationDate}</View>
        </View>
        <AtButton className='confirm' type='primary' size='small' circle onClick={this.commit}>确认</AtButton>
        <AtButton className='cancel' type='primary' size='small' circle onClick={this.goback}>取消</AtButton>
      </View>
    )
  }
}
