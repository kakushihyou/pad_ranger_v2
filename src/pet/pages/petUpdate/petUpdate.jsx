import React, { Component } from 'react'
import Taro, { getApp, getCurrentInstance, getCurrentPages } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import { AtButton, AtAvatar, AtList, AtListItem, AtInput, AtMessage, AtImagePicker } from 'taro-ui'
import {getDefaultHeadImg, getGenderStr, jsGetAge, getSpeciesMemo, getSterilizationMemo} from '../../../util/tool'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './petUpdate.scss'
import Httpclient from '../../../../httpclient/http'
import Config from '../../../config/globalConfig.json'

export default class PetUpdate extends Component {

  constructor(props) {
    super(props)
    this.state = {
      petDetail: {},
      headImg: '',
      nickName: '',
      colour: '',
      weight: '',
      genderSelector: ['母', '公', '未知'],
      genderSelectorChecked: '',
      speciesSelector: ['猫', '狗'],
      speciesSelectorChecked: '',
      sterilizationSelector: ['未绝育', '已绝育'],
      sterilizationSelectorChecked: '',
      birthdaySel: '',
      adoptDateSel: '',
      sterilizationDateSel: '',
      changed: false,
      saved: false,
      uploading: false,
      errMsgMap: new Map()
    }
    
    this.commit = this.commit.bind(this)
    this.goback = this.goback.bind(this)
    this.onGenderChange = this.onGenderChange.bind(this)
    this.onSpeciesChange = this.onSpeciesChange.bind(this)
    this.onNickNameChange =  this.onNickNameChange.bind(this)
    this.onColourChange = this.onColourChange.bind(this)
    this.onWeightChange = this.onWeightChange.bind(this)
    this.onBirthdayChange = this.onBirthdayChange.bind(this)
    this.onSterilizationDateChange = this.onSterilizationDateChange.bind(this)
    this.imageSelect = this.imageSelect.bind(this)
  }

  componentWillMount () { 
    console.log(getCurrentInstance().router.params)
    this.setState({
      changed: false
    })
    // TODO 获取宠物详情
    Httpclient.get(
      Config.request_host + '/pet/detail?ID=' + getCurrentInstance().router.params.petID)
      .then(res => {
        console.log(res.Data)
        this.setState({
          petDetail: res.Data,
          headImg: res.Data.headImg,
          nickName: res.Data.nickName,
          colour: res.Data.colour,
          weight: res.Data.weight,
          genderSelectorChecked: getGenderStr(res.Data.gender),
          sterilizationSelectorChecked: getSterilizationMemo(res.Data.sterilizationFlag),
          speciesSelectorChecked: getSpeciesMemo(res.Data.species),
          birthdaySel: res.Data.birthday,
          adoptDateSel: res.Data.adoptDate,
          sterilizationDateSel: res.Data.sterilizationDate
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

  onGenderChange = (e) => {
    console.log(e.detail.value)
    let gender = Number(e.detail.value)
    let petDetail = this.state.petDetail
    let preGender = Number(petDetail.gender)
    if (gender === preGender) {
      console.log('修改前后没有变化')
      return
    }
    
    petDetail.gender = gender
    this.setState({
      petDetail: petDetail,
      genderSelectorChecked: getGenderStr(gender),
      changed: true
    })
  }

  onSpeciesChange = (e) => {
    console.log(e.detail.value)
    let species = Number(e.detail.value) + 1
    let petDetail = this.state.petDetail
    let preSpecies = Number(petDetail.species)
    if (species === preSpecies) {
      console.log('修改前后没有变化')
      return
    }
    
    petDetail.species = species
    this.setState({
      petDetail: petDetail,
      speciesSelectorChecked: getSpeciesMemo(species),
      changed: true
    })
  }

  onSterilizationChange = (e) => {
    console.log(e.detail.value)
    let sterilization = Number(e.detail.value)
    let petDetail = this.state.petDetail
    let preSterilization = Number(petDetail.sterilization)
    if (sterilization === preSterilization) {
      console.log('修改前后没有变化')
      return
    }
    
    petDetail.sterilizationFlag = sterilization
    this.setState({
      petDetail: petDetail,
      sterilizationSelectorChecked: getSterilizationMemo(sterilization),
      changed: true
    })
  }

  onNickNameChange = (value) => {
    console.log(value)
    let errMsgMap = this.state.errMsgMap
    let errMsg = '朕不配拥有姓名吗？'
    if (value == null || value == '') {
      Taro.atMessage({
        message: errMsg,
        type: 'error',
        duration: 2000
      })
      errMsgMap.set('nickName', errMsg)
      this.setState({
        nickName: '',
        errMsgMap: errMsgMap
      })
    } else {
      let petDetail = this.state.petDetail
      petDetail.nickName = value
      this.setState({
        nickName: value,
        petDetail: petDetail,
        changed: true
      })
      errMsgMap.delete('nickName')
    }

    return value
  }

  onColourChange = (value) => {
    console.log(value)
    let errMsgMap = this.state.errMsgMap
    let errMsg = '难道朕没有颜色吗？'
    if (value == null || value == '') {
      Taro.atMessage({
        message: errMsg,
        type: 'error',
        duration: 2000
      })
      errMsgMap.set('colour', errMsg)
      this.setState({
        colour: '',
        errMsgMap: errMsgMap
      })
    } else {
      let petDetail = this.state.petDetail
      petDetail.colour = value
      this.setState({
        colour: value,
        petDetail: petDetail,
        changed: true
      })
      errMsgMap.delete('colour')
    }

    return value
  }

  onWeightChange = (value) => {
    console.log(value)
    let errMsgMap = this.state.errMsgMap
    let errMsg = '难道朕在你心里没有重量吗？'
    if (value == null || value == '' || Number(value) == 0) {
      Taro.atMessage({
        message: errMsg,
        type: 'error',
        duration: 2000
      })
      errMsgMap.set('weight', errMsg)
      this.setState({
        errMsgMap: errMsgMap,
        weight: ''
      })
    } else {
      let petDetail = this.state.petDetail
      petDetail.weight = value
      this.setState({
        weight: value,
        petDetail: petDetail,
        changed: true
      })
      errMsgMap.delete('weight')
    }

    return value
  }

  onBirthdayChange = (e) => {
    console.log(e.detail.value)
    let birthday = e.detail.value
    let petDetail = this.state.petDetail
    let preBirthday = petDetail.birthday
    if (birthday === preBirthday) {
      console.log('修改前后没有变化')
      return
    }
    
    petDetail.birthday = birthday
    this.setState({
      petDetail: petDetail,
      birthdaySel: birthday,
      changed: true
    })
  }

  onAdoptDateChange = (e) => {
    console.log(e.detail.value)
    let adoptDate = e.detail.value
    let petDetail = this.state.petDetail
    let preAdoptDate = petDetail.adoptDate
    if (adoptDate === preAdoptDate) {
      console.log('修改前后没有变化')
      return
    }
    
    petDetail.adoptDate = adoptDate
    this.setState({
      petDetail: petDetail,
      adoptDateSel: adoptDate,
      changed: true
    })
  }

  onSterilizationDateChange = (e) => {
    console.log(e.detail.value)
    let sterilizationDate = e.detail.value
    let petDetail = this.state.petDetail
    let preSterilizationDate = petDetail.sterilizationDate
    if (sterilizationDate === preSterilizationDate) {
      console.log('修改前后没有变化')
      return
    }
    
    petDetail.sterilizationDate = sterilizationDate
    this.setState({
      petDetail: petDetail,
      sterilizationDateSel: sterilizationDate,
      changed: true
    })
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
        ID: this.state.petDetail.id,
        UserID: this.state.petDetail.userID,
        NickName: this.state.petDetail.nickName,
        Gender: this.state.petDetail.gender, // 0:母，1:公，2:未知
        Birthday: this.state.petDetail.birthday,
        Species: this.state.petDetail.species, // 物种 1:猫，2:狗
        Colour: this.state.petDetail.colour,
        Weight: this.state.petDetail.weight,
        AdoptDate: this.state.petDetail.adoptDate,
        SterilizationFlag: this.state.petDetail.sterilizationFlag, // 绝育标识 1:已绝育，0:未绝育
        SterilizationDate: this.state.petDetail.sterilizationDate
      }

      console.log(requestBody)
      Httpclient.post(
        Config.request_host + '/pet', requestBody, 'application/json')
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
          this.setState({
            saved: true
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
    if (this.state.changed && !this.state.saved) {
      Taro.showModal({
        cancelText:'稍后再改',
        cancelColor:'#FFC1C1',
        confirmText:'确实忘了',
        confirmColor:'#9BCEFA',
        content:'朕的信息是不是忘了保存？',
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
      Taro.navigateBack({
        delta: 1
      })
    }
  }

  imageSelect = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success: (res) => {
        this.setState({
          uploading: true
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        // TODO 上传图片到腾讯COS对象存储，获取存储路径
        this.setState({
          headImg: tempFilePaths[0],
        },()=>{
          console.log(tempFilePaths);
        })
      }
    })
  }

  render () {
    let petDetail = this.state.petDetail
    return (
      <View className='modify'>
        {/* <AtMessage /> */}
        {
          this.state.uploading ? (<AtActivityIndicator content='上传中...'></AtActivityIndicator>) : (<AtMessage />)
        }
        <View className='photo' onClick={this.imageSelect}>
          <AtAvatar circle image={this.state.headImg === '' ? getDefaultHeadImg(petDetail.species) : this.state.headImg} >
          </AtAvatar>
        </View>
        <View className='center'>
          <AtInput class='rightInput' name='nickName' type='text' title='昵称' border={false} adjustPosition={true} placeholder='请输入昵称' value={this.state.nickName} onChange={this.onNickNameChange} />
          
          <Picker class='picker' mode='selector' range={this.state.speciesSelector} onChange={this.onSpeciesChange.bind(this)}>
            <AtList hasBorder={true}>
              <AtListItem title='种类' hasBorder={false} extraText={this.state.speciesSelectorChecked} />
            </AtList>
          </Picker>
          
          <AtInput class='rightInput' name='colour' type='text' title='花色' border={false} adjustPosition={true} placeholder='请输入花色' value={this.state.colour} onChange={this.onColourChange} />

          <Picker class='picker' name='gender' mode='selector' range={this.state.genderSelector} onChange={this.onGenderChange.bind(this)}>
            <AtList hasBorder={true}>
              <AtListItem title='性别' hasBorder={false} extraText={this.state.genderSelectorChecked} />
            </AtList>
          </Picker>

          <AtInput class='rightInput' name='weight' type='number' title='体重' border={false} adjustPosition={true} placeholder='请输入体重(KG)' value={this.state.weight} onChange={this.onWeightChange}/>
          
          <Picker class='picker' mode='date' value={this.state.petDetail.birthday} onChange={this.onBirthdayChange}>
            <AtList hasBorder={true}>
              <AtListItem title='生日' hasBorder={false} extraText={this.state.birthdaySel} />
            </AtList>
          </Picker>
          
          <Picker class='picker' mode='date' value={this.state.petDetail.adoptDate} onChange={this.onAdoptDateChange}>
            <AtList hasBorder={false}>
              <AtListItem title='接驾日期' hasBorder={false} extraText={this.state.adoptDateSel} />
            </AtList>
          </Picker>
          
          <Picker class='picker' mode='selector' range={this.state.sterilizationSelector} onChange={this.onSterilizationChange}>
            <AtList hasBorder={true}>
              <AtListItem title='是否绝育' hasBorder={false} extraText={this.state.sterilizationSelectorChecked} />
            </AtList>
          </Picker>
          {/* <View>是否绝育：{getSterilizationMemo(petDetail.sterilizationFlag)}</View> */}
          <Picker class='picker' mode='date' value={this.state.petDetail.sterilizationDate} onChange={this.onSterilizationDateChange}>
            <AtList hasBorder={false}>
              <AtListItem title='绝育日期' hasBorder={false} extraText={this.state.sterilizationDateSel} />
            </AtList>
          </Picker>
        </View>
        <AtButton className='confirm' type='primary' size='small' circle onClick={this.commit}>确认</AtButton>
        <AtButton className='cancel' type='primary' size='small' circle onClick={this.goback}>取消</AtButton>
      </View>
    )
  }
}
