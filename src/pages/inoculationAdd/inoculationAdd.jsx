import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import { AtButton, AtList, AtListItem, AtInput, AtMessage } from 'taro-ui'
import { getVaccineTypeMemo, getCurrentDate} from '../../util/tool'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './inoculationAdd.scss'
import Httpclient from '../../../httpclient/http'
import Config from '../../config/globalConfig.json'

export default class InoculationAdd extends Component {

  constructor(props) {
    super(props)
    this.state = {
      vaccineType: 1,
      vaccineTypeSelector: ['核心疫苗', '非核心疫苗'],
      vaccineTypeSelectorChecked: '核心疫苗',
      dosage: '',
      weight: '',
      vaccineName: '',
      manufacturer: '',
      inoculationAddress: '',
      doctor: '',
      inoculationDate: getCurrentDate(),
      inoculationDateSel: getCurrentDate(),
      nextInoculationDate: getCurrentDate(),
      nextInoculationDateSel: getCurrentDate(),
      errMsgMap: new Map()
    }
    
    this.commit = this.commit.bind(this)
    this.goback = this.goback.bind(this)
    this.onVaccineTypeChange = this.onVaccineTypeChange.bind(this)
    this.onVaccineNameChange = this.onVaccineNameChange.bind(this)
    this.onDosageChange = this.onDosageChange.bind(this)
    this.onManufacturerChange =  this.onManufacturerChange.bind(this)
    this.onInoculationAddressChange = this.onInoculationAddressChange.bind(this)
    this.onDoctorChange = this.onDoctorChange.bind(this)
    this.onWeightChange = this.onWeightChange.bind(this)
    this.onInoculationDateChange = this.onInoculationDateChange.bind(this)
    this.onNextInoculationDateChange = this.onNextInoculationDateChange.bind(this)
  }

  onVaccineTypeChange = (e) => {
    console.log(e.detail.value)
    let vaccineType = Number(e.detail.value) + 1
    
    this.setState({
      vaccineType: vaccineType,
      vaccineTypeSelectorChecked: getVaccineTypeMemo(vaccineType)
    })
  }

  onVaccineNameChange = (value) => {
    console.log(value)
    let errMsgMap = this.state.errMsgMap
    let errMsg = '你给朕注射的什么药？'
    if (value == null || value == '') {
      Taro.atMessage({
        message: errMsg,
        type: 'error',
        duration: 2000
      })
      errMsgMap.set('vaccineName', errMsg)
      this.setState({
        vaccineName: '',
        errMsgMap: errMsgMap
      })
    } else {
      
      this.setState({
        vaccineName: value
      })
      errMsgMap.delete('vaccineName')
    }

    return value
  }

  onWeightChange = (value) => {
    console.log('体重')
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
      
      this.setState({
        weight: value
      })
      errMsgMap.delete('weight')
    }

    return value
  }

  onManufacturerChange = (value) => {
    console.log(value)
    let errMsgMap = this.state.errMsgMap
    let errMsg = '朕想知道这药是哪里生产的？'
    if (value == null || value == '') {
      Taro.atMessage({
        message: errMsg,
        type: 'error',
        duration: 2000
      })
      errMsgMap.set('manufacturer', errMsg)
      this.setState({
        manufacturer: '',
        errMsgMap: errMsgMap
      })
    } else {
      
      this.setState({
        manufacturer: value
      })
      errMsgMap.delete('manufacturer')
    }

    return value
  }

  onDosageChange = (value) => {
    console.log(value)
    let errMsgMap = this.state.errMsgMap
    let errMsg = '你给朕吃了多少？'
    if (value == null || value == '') {
      Taro.atMessage({
        message: errMsg,
        type: 'error',
        duration: 2000
      })
      errMsgMap.set('dosage', errMsg)
      this.setState({
        dosage: '',
        errMsgMap: errMsgMap
      })
    } else {
      
      this.setState({
        dosage: value
      })
      errMsgMap.delete('dosage')
    }

    return value
  }

  onInoculationAddressChange = (value) => {
    console.log(value)
    let errMsgMap = this.state.errMsgMap
    let errMsg = '你要带朕去哪儿？'
    if (value == null || value == '') {
      Taro.atMessage({
        message: errMsg,
        type: 'error',
        duration: 2000
      })
      errMsgMap.set('inoculationAddress', errMsg)
      this.setState({
        inoculationAddress: '',
        errMsgMap: errMsgMap
      })
    } else {
      
      this.setState({
        inoculationAddress: value
      })
      errMsgMap.delete('inoculationAddress')
    }

    return value
  }

  onDoctorChange = (value) => {
    console.log(value)
    let errMsgMap = this.state.errMsgMap
    let errMsg = '朕的御医呢？'
    if (value == null || value == '') {
      Taro.atMessage({
        message: errMsg,
        type: 'error',
        duration: 2000
      })
      errMsgMap.set('doctor', errMsg)
      this.setState({
        doctor: '',
        errMsgMap: errMsgMap
      })
    } else {
      
      this.setState({
        doctor: value
      })
      errMsgMap.delete('doctor')
    }

    return value
  }

  onInoculationDateChange = (e) => {
    console.log(e.detail.value)
    let inoculationDate = e.detail.value
    
    this.setState({
      inoculationDate: inoculationDate,
      inoculationDateSel: inoculationDate
    })
  }

  onNextInoculationDateChange = (e) => {
    console.log(e.detail.value)
    let nextInoculationDate = e.detail.value
    
    this.setState({
      nextInoculationDate: nextInoculationDate,
      nextInoculationDateSel: nextInoculationDate
    })
  }

  commit = (e) =>{
    console.log('提交')
    console.log(this.state.errMsgMap)
    console.log(this.state.dewormingDetail)
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
      let petID = getCurrentInstance().router.params.petID
      var requestBody = {
        PetID: Number(petID),
        VaccineName: this.state.vaccineName,
        VaccineType: this.state.vaccineType, // 0:母，1:公，2:未知
        Manufacturer: this.state.manufacturer,
        Dosage: this.state.dosage, 
        InoculationDate: this.state.inoculationDate,
        Weight: Number(this.state.weight),
        NextInoculationDate: this.state.nextInoculationDate,
        InoculationAddress: this.state.inoculationAddress, // 绝育标识 1:已绝育，0:未绝育
        Remind: this.state.remind,
        RemindTime: this.state.remindTime,
        Doctor: this.state.doctor
      }

      console.log(requestBody)
      Httpclient.put(
        Config.request_host + '/pet/inoculation', requestBody, 'application/json')
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

  render () {
    let petDetail = this.state.petDetail
    return (
      // PetID               int64  `json:"petID"`
      // VaccineName         string `json:"vaccineName"`
      // VaccineType         int    `json:"vaccineType"`
      // Manufacturer        string `json:"manufacturer"`
      // Dosage              int    `json:"dosage"`
      // InoculationDate     string `json:"inoculationDate"`
      // NextInoculationDate string `json:"nextInoculationDate"`
      // Remind              int    `json:"remind"`
      // RemindTime          string `json:"remindTime"`
      // InoculationAddress  string `json:"inoculationAddress"`
      // Doctor              string `json:"doctor"`
      <View className='modify'>
        <AtMessage /> 
        <View className='center'>
          <AtInput class='rightInput' name='vaccineName' type='text' title='疫苗名称' border={true} adjustPosition={true} placeholder='请输入疫苗名称' value={this.state.vaccineName} onChange={this.onVaccineNameChange} />
          
          <Picker class='picker' mode='selector' range={this.state.vaccineTypeSelector} onChange={this.onVaccineTypeChange.bind(this)}>
            <AtList hasBorder={false}>
              <AtListItem title='疫苗类型' hasBorder={true} extraText={this.state.vaccineTypeSelectorChecked} />
            </AtList>
          </Picker>

          <Picker class='picker' mode='date' value={this.state.inoculationDate} onChange={this.onInoculationDateChange}>
            <AtList hasBorder={false}>
              <AtListItem title='接种日期' hasBorder={true} extraText={this.state.inoculationDateSel} />
            </AtList>
          </Picker>
          
          <AtInput class='rightInput' name='manufacturer' type='text' title='生产厂商' border={true} adjustPosition={true} placeholder='请输入疫苗厂商' value={this.state.manufacturer} onChange={this.onManufacturerChange} />

          <AtInput class='rightInput' name='weight' type='number' title='当前体重' border={true} adjustPosition={true} placeholder='请输入体重(KG)' value={this.state.weight} onChange={this.onWeightChange}/>

          <AtInput class='rightInput' name='dosage' type='text' title='用药剂量' border={true} adjustPosition={true} placeholder='请输入用药剂量' value={this.state.dosage} onChange={this.onDosageChange}/>
          
          <AtInput class='rightInput' name='inoculationAddress' type='text' title='接种地点' border={true} adjustPosition={true} placeholder='请输入驱虫地点' value={this.state.inoculationAddress} onChange={this.onInoculationAddressChange}/>

          <AtInput class='rightInput' name='doctor' type='text' title='宠物医师' border={true} adjustPosition={true} placeholder='请输入宠物医师' value={this.state.doctor} onChange={this.onDoctorChange}/>
          
          <Picker class='picker' mode='date' value={this.state.nextInoculationDate} onChange={this.onNextInoculationDateChange}>
            <AtList hasBorder={false}>
              <AtListItem title='下次接种' hasBorder={false} extraText={this.state.nextInoculationDateSel} />
            </AtList>
          </Picker>
        </View>
        <AtButton className='confirm' type='primary' size='small' circle onClick={this.commit}>确认</AtButton>
        <AtButton className='cancel' type='primary' size='small' circle onClick={this.goback}>取消</AtButton>
      </View>
    )
  }
}

