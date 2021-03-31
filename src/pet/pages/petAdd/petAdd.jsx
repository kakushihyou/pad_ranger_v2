import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import { AtButton, AtAvatar, AtList, AtListItem, AtInput, AtMessage, AtActivityIndicator } from 'taro-ui'
import {uploadFile, getGenderStr, getCurrentDate, getSpeciesMemo, getSterilizationMemo} from '../../../util/tool'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './petAdd.scss'
import Httpclient from '../../../../httpclient/http'
import AddIconBlank from '../../../assets/icon/add_icon_blank.png'
import Config from '../../../config/globalConfig.json'
import CosAuth from '../../../../cos/cos-auth'
import { _allowStateChangesInsideComputed } from 'mobx'

export default class PetUpdate extends Component {

  constructor(props) {
    super(props)
    this.state = {
      headImg: AddIconBlank,
      nickName: '',
      gender: 2,
      species: 1,
      sterilizationFlag: 0,
      colour: '',
      weight: '',
      birthday: getCurrentDate(),
      adoptDate: getCurrentDate(),
      sterilizationDate: getCurrentDate(),
      genderSelector: ['母', '公', '未知'],
      genderSelectorChecked: '母',
      speciesSelector: ['猫', '狗'],
      speciesSelectorChecked: '猫',
      sterilizationSelector: ['未绝育', '已绝育'],
      sterilizationSelectorChecked: '未绝育',
      birthdaySel: getCurrentDate(),
      adoptDateSel: getCurrentDate(),
      sterilizationDateSel: getCurrentDate(),
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
    console.log(this.state)
  }

  onGenderChange = (e) => {
    console.log(e.detail.value)
    let gender = Number(e.detail.value)
    
    this.setState({
      gender: gender,
      genderSelectorChecked: getGenderStr(gender)
    })
  }

  onSpeciesChange = (e) => {
    console.log(e.detail.value)
    let species = Number(e.detail.value) + 1
    
    this.setState({
      species: species,
      speciesSelectorChecked: getSpeciesMemo(species)
    })
  }

  onSterilizationChange = (e) => {
    console.log(e.detail.value)
    let sterilization = Number(e.detail.value)
    
    this.setState({
      sterilizationFlag: sterilization,
      sterilizationSelectorChecked: getSterilizationMemo(sterilization)
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
      
      this.setState({
        nickName: value
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
      this.setState({
        colour: value
      })
      errMsgMap.delete('colour')
    }

    return value
  }

  onWeightChange = (value) => {
    console.log(value)
    let weight = Number(value)
    let errMsgMap = this.state.errMsgMap
    let errMsg = '难道朕在你心里没有重量吗？'
    if (value == null || value == '' || weight <= 0) {
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
      this.setState({
        weight: weight
      })
      errMsgMap.delete('weight')
    }

    return weight
  }

  onBirthdayChange = (e) => {
    console.log(e.detail.value)
    let birthday = e.detail.value
    
    this.setState({
      birthday: birthday,
      birthdaySel: birthday
    })
  }

  onAdoptDateChange = (e) => {
    console.log(e.detail.value)
    let adoptDate = e.detail.value
    
    this.setState({
      adoptDate: adoptDate,
      adoptDateSel: adoptDate
    })
  }

  onSterilizationDateChange = (e) => {
    console.log(e.detail.value)
    let sterilizationDate = e.detail.value
    
    this.setState({
      sterilizationDate: sterilizationDate,
      sterilizationDateSel: sterilizationDate
    })
  }

  commit = (e) =>{
    console.log('提交')
    console.log(this.state.errMsgMap)
    let errMsgMap = this.state.errMsgMap
    if (this.state.nickName == null || this.state.nickName.length == 0) {
      errMsgMap.set('nickName', '朕不配拥有姓名吗？')
    }

    if (this.state.colour == null || this.state.colour.length == 0) {
      errMsgMap.set('colour', '难道朕没有颜色吗？')
    }

    if (this.state.weight == null || this.state.weight.length == 0 || this.state.weight <= 0) {
      errMsgMap.set('weight', '难道朕在你心里没有重量吗？')
    }
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

      return false
    }
    
    console.log('要添加的头像是' + this.state.headImg)
    // 上传图片到腾讯COS对象存储，获取存储路径
    let headImg = this.state.headImg
    let fileName = headImg.substr(headImg.lastIndexOf('/') + 1);
    console.log(fileName)
    if (fileName === 'add_icon_blank.png') {
      this.addPet('')
    } else {
      // 上传图片到腾讯COS对象存储，获取存储路径
      this.setState({
        uploading: true
      })
      uploadFile(headImg, this.addPet)
      this.setState({
        uploading: false
      })
    }
  }

  addPet = (headImg) => {
    let userID  = getCurrentInstance().router.params.userID
    var requestBody = {
      UserID: Number(userID),
      NickName: this.state.nickName,
      Gender: this.state.gender, // 0:母，1:公，2:未知
      Birthday: this.state.birthday,
      Species: this.state.species, // 物种 1:猫，2:狗
      Colour: this.state.colour,
      Weight: this.state.weight,
      AdoptDate: this.state.adoptDate,
      SterilizationFlag: this.state.sterilizationFlag, // 绝育标识 1:已绝育，0:未绝育
      SterilizationDate: this.state.sterilizationDate,
      HeadImg: headImg,
    }

    console.log(requestBody)
    Httpclient.put(
      Config.request_host + '/pet', requestBody, 'application/json')
    .then(res => {
      console.log(res)
      if (res.Success) {
        
        Taro.showToast({
          title: '干的漂亮！',
          duration: 1200,
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

  goback = () => {
    Taro.showModal({
      cancelText:'稍后再来',
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
  }

  imageSelect = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success: (res) => {
        
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let filePath = res.tempFiles[0].path;
        console.log(filePath)
        this.setState({
          headImg: filePath
        })
      },
      fail: (e) => {
        console.log(e)
        console.log('上传文件失败')
      }
    })
  }

  render () {
    return (
      <View className='modify'>
        {
          this.state.uploading ? (<AtActivityIndicator content='上传中...'></AtActivityIndicator>) : (<AtMessage />)
        }
        <View className='photo' onClick={this.imageSelect}>
          <AtAvatar circle image={this.state.headImg}></AtAvatar>
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
          
          <Picker class='picker' mode='date' value={this.state.birthday} onChange={this.onBirthdayChange}>
            <AtList hasBorder={true}>
              <AtListItem title='生日' hasBorder={false} extraText={this.state.birthdaySel} />
            </AtList>
          </Picker>
          
          <Picker class='picker' mode='date' value={this.state.adoptDate} onChange={this.onAdoptDateChange}>
            <AtList hasBorder={false}>
              <AtListItem title='接驾日期' hasBorder={false} extraText={this.state.adoptDateSel} />
            </AtList>
          </Picker>
          
          <Picker class='picker' mode='selector' range={this.state.sterilizationSelector} onChange={this.onSterilizationChange}>
            <AtList hasBorder={true}>
              <AtListItem title='是否绝育' hasBorder={false} extraText={this.state.sterilizationSelectorChecked} />
            </AtList>
          </Picker>
          {
            !this.state.sterilizationSelectorChecked | this.state.sterilizationSelectorChecked == '未绝育' ? '' : (
              <Picker class='picker' mode='date' value={this.state.sterilizationDate} onChange={this.onSterilizationDateChange}>
                <AtList hasBorder={false}>
                  <AtListItem title='绝育日期' hasBorder={false} extraText={this.state.sterilizationDateSel} />
                </AtList>
              </Picker>
            )
          }
          
        </View>
        <AtButton className='confirm' type='primary' size='small' circle onClick={this.commit}>确认</AtButton>
        <AtButton className='cancel' type='primary' size='small' circle onClick={this.goback}>取消</AtButton>
      </View>
    )
  }
}
