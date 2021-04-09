import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import { AtButton, AtList, AtListItem, AtInput, AtMessage } from 'taro-ui'
import { getVaccineTypeMemo, getCurrentDate, doSubscription} from '../../../util/tool'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './inoculationUpdate.scss'
import Httpclient from '../../../../httpclient/http'
import Config from '../../../config/globalConfig.json'

export default class InoculationUpdate extends Component {

  constructor(props) {
    super(props)
    this.state = {
      inoculationDetail: {},
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
      changed: false,
      saved: false,
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

  componentDidShow () { 
    console.log(getCurrentInstance().router.params)
    Taro.hideToast()
    this.setState({
      changed: false
    })
    // 获取宠物详情
    Httpclient.get(
      Config.request_host + '/pet/inoculation?ID=' + getCurrentInstance().router.params.inoculationID)
      .then(res => {
        console.log(res.Data)
        this.setState({
          inoculationDetail: res.Data,
          dosage: res.Data.dosage,
          vaccineType: res.Data.vaccineType,
          vaccineName: res.Data.vaccineName,
          manufacturer: res.Data.manufacturer,
          inoculationAddress: res.Data.inoculationAddress,
          doctor: res.Data.doctor,
          weight: res.Data.weight === 0 ? '' : res.Data.weight,
          vaccineTypeSelectorChecked: getVaccineTypeMemo(res.Data.vaccineType),
          inoculationDateSel: res.Data.inoculationDate,
          nextInoculationDateSel: res.Data.nextInoculationDate
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

  onVaccineTypeChange = (e) => {
    console.log(e.detail.value)
    let vaccineType = Number(e.detail.value) + 1
    let inoculationDetail = this.state.inoculationDetail
    let preVaccineType = Number(inoculationDetail.vaccineType)
    if (vaccineType === preVaccineType) {
      console.log('修改前后没有变化')
      return
    }
    
    inoculationDetail.vaccineType = vaccineType
    this.setState({
      inoculationDetail: inoculationDetail,
      vaccineTypeSelectorChecked: getVaccineTypeMemo(vaccineType),
      changed: true
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
      let inoculationDetail = this.state.inoculationDetail
      inoculationDetail.vaccineName = value
      this.setState({
        vaccineName: value,
        inoculationDetail: inoculationDetail,
        changed: true
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
      let inoculationDetail = this.state.inoculationDetail
      inoculationDetail.weight = value
      this.setState({
        weight: value,
        inoculationDetail: inoculationDetail,
        changed: true
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
      let inoculationDetail = this.state.inoculationDetail
      inoculationDetail.manufacturer = value
      this.setState({
        manufacturer: value,
        inoculationDetail: inoculationDetail,
        changed: true
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
      let inoculationDetail = this.state.inoculationDetail
      inoculationDetail.dosage = value
      this.setState({
        dosage: value,
        inoculationDetail: inoculationDetail,
        changed: true
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
      let inoculationDetail = this.state.inoculationDetail
      inoculationDetail.inoculationAddress = value
      this.setState({
        inoculationAddress: value,
        inoculationDetail: inoculationDetail,
        changed: true
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
      let inoculationDetail = this.state.inoculationDetail
      inoculationDetail.doctor = value
      this.setState({
        doctor: value,
        inoculationDetail: inoculationDetail,
        changed: true
      })
      errMsgMap.delete('doctor')
    }

    return value
  }

  onInoculationDateChange = (e) => {
    console.log(e.detail.value)
    let inoculationDate = e.detail.value
    let inoculationDetail = this.state.inoculationDetail
    let preInoculationDate = inoculationDetail.inoculationDate
    if (inoculationDate === preInoculationDate) {
      console.log('修改前后没有变化')
      return
    }
    
    inoculationDetail.inoculationDate = inoculationDate
    this.setState({
      inoculationDetail: inoculationDetail,
      inoculationDate: inoculationDate,
      inoculationDateSel: inoculationDate,
      changed: true
    })
  }

  onNextInoculationDateChange = (e) => {
    console.log(e.detail.value)
    let nextInoculationDate = e.detail.value
    let inoculationDetail = this.state.inoculationDetail
    let preNextInoculationDate = inoculationDetail.nextInoculationDate
    if (nextInoculationDate === preNextInoculationDate) {
      console.log('修改前后没有变化')
      return
    }

    inoculationDetail.nextInoculationDate = nextInoculationDate
    this.setState({
      inoculationDetail: inoculationDetail,
      nextInoculationDate: nextInoculationDate,
      nextInoculationDateSel: nextInoculationDate,
      changed: true
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
      doSubscription(this.requestInoculationUpdate)
    }
  }

  requestInoculationUpdate = (remind) => {
    var requestBody = {
      ID: this.state.inoculationDetail.id,
      PetID: this.state.inoculationDetail.petID,
      VaccineName: this.state.inoculationDetail.vaccineName,
      VaccineType: this.state.inoculationDetail.vaccineType, // 0:母，1:公，2:未知
      Manufacturer: this.state.inoculationDetail.manufacturer,
      Dosage: this.state.inoculationDetail.dosage, 
      InoculationDate: this.state.inoculationDetail.inoculationDate,
      Weight: Number(this.state.inoculationDetail.weight),
      NextInoculationDate: this.state.inoculationDetail.nextInoculationDate,
      InoculationAddress: this.state.inoculationDetail.inoculationAddress, // 绝育标识 1:已绝育，0:未绝育
      Remind: remind,
      RemindTime: this.state.inoculationDetail.remindTime,
      Doctor: this.state.inoculationDetail.doctor
    }

    console.log(requestBody)
    Httpclient.post(
      Config.request_host + '/pet/inoculation', requestBody, 'application/json')
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

  render () {
    let petDetail = this.state.petDetail
    return (
      <View className='modify'>
        <AtMessage /> 
        <View className='center'>
          <AtInput class='rightInput' name='vaccineName' type='text' title='疫苗名称' border={true} adjustPosition={true} placeholder='请输入疫苗名称' value={this.state.vaccineName} onChange={this.onVaccineNameChange} />
          
          <Picker class='picker' mode='selector' range={this.state.vaccineTypeSelector} onChange={this.onVaccineTypeChange.bind(this)}>
            <AtList hasBorder={false}>
              <AtListItem title='疫苗类型' hasBorder={true} extraText={this.state.vaccineTypeSelectorChecked} />
            </AtList>
          </Picker>

          <Picker class='picker' mode='date' value={this.state.inoculationDetail.inoculationDate} onChange={this.onInoculationDateChange}>
            <AtList hasBorder={false}>
              <AtListItem title='接种日期' hasBorder={true} extraText={this.state.inoculationDateSel} />
            </AtList>
          </Picker>
          
          <AtInput class='rightInput' name='manufacturer' type='text' title='生产厂商' border={true} adjustPosition={true} placeholder='请输入疫苗厂商' value={this.state.manufacturer} onChange={this.onManufacturerChange} />

          <AtInput class='rightInput' name='weight' type='number' title='当前体重' border={true} adjustPosition={true} placeholder='请输入体重(KG)' value={this.state.weight} onChange={this.onWeightChange}/>

          <AtInput class='rightInput' name='dosage' type='text' title='用药剂量' border={true} adjustPosition={true} placeholder='请输入用药剂量' value={this.state.dosage} onChange={this.onDosageChange}/>
          
          <AtInput class='rightInput' name='inoculationAddress' type='text' title='接种地点' border={true} adjustPosition={true} placeholder='请输入驱虫地点' value={this.state.inoculationAddress} onChange={this.onInoculationAddressChange}/>

          <AtInput class='rightInput' name='doctor' type='text' title='宠物医师' border={true} adjustPosition={true} placeholder='请输入宠物医师' value={this.state.doctor} onChange={this.onDoctorChange}/>
          
          <Picker class='picker' mode='date' value={this.state.inoculationDetail.nextInoculationDate} onChange={this.onNextInoculationDateChange}>
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

