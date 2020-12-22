import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import { AtButton, AtList, AtListItem, AtInput, AtMessage } from 'taro-ui'
import { getDewormingTypeMemo, getCurrentDate} from '../../util/tool'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './dewormingAdd.scss'
import Httpclient from '../../../httpclient/http'
import Config from '../../config/globalConfig.json'

export default class DewormingAdd extends Component {

  constructor(props) {
    super(props)
    this.state = {
      dewormingType: 1,
      dewormingTypeSelector: ['体内', '体外'],
      dewormingTypeSelectorChecked: '体内',
      dosage: '',
      weight: '',
      medication: '',
      manufacturer: '',
      dewormingAddress: '',
      doctor: '',
      dewormingDate: getCurrentDate(),
      dewormingDateSel: getCurrentDate(),
      nextDewormingDate: getCurrentDate(),
      nextDewormingDateSel: getCurrentDate(),
      errMsgMap: new Map()
    }
    
    this.commit = this.commit.bind(this)
    this.goback = this.goback.bind(this)
    this.onDewormingTypeChange = this.onDewormingTypeChange.bind(this)
    this.onMedicationChange = this.onMedicationChange.bind(this)
    this.onDosageChange = this.onDosageChange.bind(this)
    this.onManufacturerChange =  this.onManufacturerChange.bind(this)
    this.onDewormingAddressChange = this.onDewormingAddressChange.bind(this)
    this.onDoctorChange = this.onDoctorChange.bind(this)
    this.onWeightChange = this.onWeightChange.bind(this)
    this.onDewormingDateChange = this.onDewormingDateChange.bind(this)
    this.onNextDewormingDateChange = this.onNextDewormingDateChange.bind(this)
  }

  onDewormingTypeChange = (e) => {
    console.log(e.detail.value)
    let dewormingType = Number(e.detail.value) + 1
    
    this.setState({
      dewormingType: dewormingType,
      dewormingTypeSelectorChecked: getDewormingTypeMemo(dewormingType)
    })
  }

  onMedicationChange = (value) => {
    console.log(value)
    let errMsgMap = this.state.errMsgMap
    let errMsg = '你给朕吃的什么药？'
    if (value == null || value == '') {
      Taro.atMessage({
        message: errMsg,
        type: 'error',
        duration: 2000
      })
      errMsgMap.set('medication', errMsg)
      this.setState({
        medication: '',
        errMsgMap: errMsgMap
      })
    } else {
      
      this.setState({
        medication: value
      })
      errMsgMap.delete('medication')
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

  onDewormingAddressChange = (value) => {
    console.log(value)
    let errMsgMap = this.state.errMsgMap
    let errMsg = '你要带朕去哪儿？'
    if (value == null || value == '') {
      Taro.atMessage({
        message: errMsg,
        type: 'error',
        duration: 2000
      })
      errMsgMap.set('dewormingAddress', errMsg)
      this.setState({
        dewormingAddress: '',
        errMsgMap: errMsgMap
      })
    } else {
      
      this.setState({
        dewormingAddress: value
      })
      errMsgMap.delete('dewormingAddress')
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

  onDewormingDateChange = (e) => {
    console.log(e.detail.value)
    let dewormingDate = e.detail.value
    
    this.setState({
      dewormingDate: dewormingDate,
      dewormingDateSel: dewormingDate
    })
  }

  onNextDewormingDateChange = (e) => {
    console.log(e.detail.value)
    let nextDewormingDate = e.detail.value
    
    this.setState({
      nextDewormingDate: nextDewormingDate,
      nextDewormingDateSel: nextDewormingDate
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
        Medication: this.state.medication,
        DewormingType: this.state.dewormingType,
        Manufacturer: this.state.manufacturer,
        Dosage: this.state.dosage, 
        DewormingDate: this.state.dewormingDate,
        Weight: Number(this.state.weight),
        NextDewormingDate: this.state.nextDewormingDate,
        DewormingAddress: this.state.dewormingAddress,
        Remind: this.state.remind,
        RemindTime: this.state.remindTime,
        Doctor: this.state.doctor
      }

      console.log(requestBody)
      Httpclient.put(
        Config.request_host + '/pet/deworming', requestBody, 'application/json')
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
      <View className='modify'>
          <AtMessage /> 
          <View className='center'>
          <Picker class='picker' mode='selector' range={this.state.dewormingTypeSelector} onChange={this.onDewormingTypeChange.bind(this)}>
            <AtList hasBorder={false}>
              <AtListItem title='驱虫类型' hasBorder={true} extraText={this.state.dewormingTypeSelectorChecked} />
            </AtList>
          </Picker>
          
          <AtInput class='rightInput' name='medication' type='text' title='药物名称' border={true} adjustPosition={true} placeholder='请输入药物名称' value={this.state.medication} onChange={this.onMedicationChange} />
          
          <Picker class='picker' mode='date' value={this.state.dewormingDate} onChange={this.onDewormingDateChange}>
            <AtList hasBorder={false}>
              <AtListItem title='驱虫日期' hasBorder={true} extraText={this.state.dewormingDateSel} />
            </AtList>
          </Picker>
          
          <AtInput class='rightInput' name='manufacturer' type='text' title='生产厂商' border={true} adjustPosition={true} placeholder='请输入药物厂商' value={this.state.manufacturer} onChange={this.onManufacturerChange} />

          <AtInput class='rightInput' name='weight' type='number' title='当前体重' border={true} adjustPosition={true} placeholder='请输入体重(KG)' value={this.state.weight} onChange={this.onWeightChange}/>

          <AtInput class='rightInput' name='dosage' type='text' title='用药剂量' border={true} adjustPosition={true} placeholder='请输入用药剂量' value={this.state.dosage} onChange={this.onDosageChange}/>
          
          <AtInput class='rightInput' name='dewormingAddress' type='text' title='驱虫地点' border={true} adjustPosition={true} placeholder='请输入驱虫地点' value={this.state.dewormingAddress} onChange={this.onDewormingAddressChange}/>

          <AtInput class='rightInput' name='doctor' type='text' title='宠物医师' border={true} adjustPosition={true} placeholder='请输入宠物医师' value={this.state.doctor} onChange={this.onDoctorChange}/>
          
          <Picker class='picker' mode='date' value={this.state.nextDewormingDate} onChange={this.onNextDewormingDateChange}>
            <AtList hasBorder={false}>
              <AtListItem title='下次驱虫' hasBorder={false} extraText={this.state.nextDewormingDateSel} />
            </AtList>
          </Picker>

        </View>
        <AtButton className='confirm' type='primary' size='small' circle onClick={this.commit}>确认</AtButton>
        <AtButton className='cancel' type='primary' size='small' circle onClick={this.goback}>取消</AtButton>
      </View>
    )
  }
}

