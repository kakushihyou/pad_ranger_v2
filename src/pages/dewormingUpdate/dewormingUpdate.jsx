import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import { AtButton, AtList, AtListItem, AtInput, AtMessage } from 'taro-ui'
import { getDewormingTypeMemo } from '../../util/tool'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './dewormingUpdate.scss'
import Httpclient from '../../../httpclient/http'

export default class DewormingUpdate extends Component {

  constructor(props) {
    super(props)
    this.state = {
      dewormingDetail: {},
      dewormingTypeSelector: ['体内', '体外'],
      dewormingTypeSelectorChecked: '',
      dosage: '',
      weight: '',
      medication: '',
      manufacturer: '',
      dewormingAddress: '',
      doctor: '',
      dewormingDateSel: '',
      nextDewormingDateSel: '',
      changed: false,
      saved: false,
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

  componentWillMount () { 
    console.log(getCurrentInstance().router.params)
    // TODO 获取宠物详情
    Httpclient.get(
      'http://localhost:9669/pet/deworming?ID=' + getCurrentInstance().router.params.dewormingID)
      .then(res => {
        console.log(res.Data)
        this.setState({
          dewormingDetail: res.Data,
          dosage: res.Data.dosage,
          medication: res.Data.medication,
          manufacturer: res.Data.manufacturer,
          dewormingAddress: res.Data.dewormingAddress,
          doctor: res.Data.doctor,
          weight: res.Data.weight === 0 ? '' : res.Data.weight,
          dewormingTypeSelectorChecked: getDewormingTypeMemo(res.Data.dewormingType),
          dewormingDateSel: res.Data.dewormingDate,
          nextDewormingDateSel: res.Data.nextDewormingDate
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

  onDewormingTypeChange = (e) => {
    console.log(e.detail.value)
    let dewormingType = Number(e.detail.value) + 1
    let dewormingDetail = this.state.dewormingDetail
    let preDewormingType = Number(dewormingDetail.dewormingType)
    if (dewormingType === preDewormingType) {
      console.log('修改前后没有变化')
      return
    }
    
    dewormingDetail.dewormingType = dewormingType
    this.setState({
      dewormingDetail: dewormingDetail,
      dewormingTypeSelectorChecked: getDewormingTypeMemo(dewormingType),
      changed: true
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
      let dewormingDetail = this.state.dewormingDetail
      dewormingDetail.medication = value
      this.setState({
        medication: value,
        dewormingDetail: dewormingDetail,
        changed: true
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
      let dewormingDetail = this.state.dewormingDetail
      dewormingDetail.weight = Number(value)
      this.setState({
        weight: value,
        dewormingDetail: dewormingDetail,
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
      let dewormingDetail = this.state.dewormingDetail
      dewormingDetail.manufacturer = value
      this.setState({
        manufacturer: value,
        dewormingDetail: dewormingDetail,
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
      let dewormingDetail = this.state.dewormingDetail
      dewormingDetail.dosage = value
      this.setState({
        dosage: value,
        dewormingDetail: dewormingDetail,
        changed: true
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
      let dewormingDetail = this.state.dewormingDetail
      dewormingDetail.dewormingAddress = value
      this.setState({
        dewormingAddress: value,
        dewormingDetail: dewormingDetail,
        changed: true
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
      let dewormingDetail = this.state.dewormingDetail
      dewormingDetail.doctor = value
      this.setState({
        doctor: value,
        dewormingDetail: dewormingDetail,
        changed: true
      })
      errMsgMap.delete('doctor')
    }

    return value
  }

  onDewormingDateChange = (e) => {
    console.log(e.detail.value)
    let dewormingDate = e.detail.value
    let dewormingDetail = this.state.dewormingDetail
    let preDewormingDate = dewormingDetail.dewormingDate
    if (dewormingDate === preDewormingDate) {
      console.log('修改前后没有变化')
      return
    }
    
    dewormingDetail.dewormingDate = dewormingDate
    this.setState({
      dewormingDate: dewormingDate,
      dewormingDateSel: dewormingDate,
      dewormingDetail: dewormingDetail,
      changed: true
    })
  }

  onNextDewormingDateChange = (e) => {
    console.log(e.detail.value)
    let nextDewormingDate = e.detail.value
    let dewormingDetail = this.state.dewormingDetail
    let preNextDewormingDate = dewormingDetail.nextDewormingDate
    if (nextDewormingDate === preNextDewormingDate) {
      console.log('修改前后没有变化')
      return
    }
    
    dewormingDetail.nextDewormingDate = nextDewormingDate
    this.setState({
      nextDewormingDate: nextDewormingDate,
      nextDewormingDateSel: nextDewormingDate,
      dewormingDetail: dewormingDetail,
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
      
      // ID                int64   `json:"id"`
      // PetID             int64   `json:"petID"`
      // Medication        string  `json:"medication"`
      // DewormingType     int     `json:"dewormingType"`
      // Manufacturer      string  `json:"manufacturer"`
      // Dosage            string  `json:"dosage"`
      // DewormingDate     string  `json:"dewormingDate"`
      // NextDewormingDate string  `json:"nextDewormingDate"`
      // DewormingAddress  string  `json:"dewormingAddress"`
      // Remind            int     `json:"remind"`
      // RemindTime        string  `json:"remindTime"`
      // Doctor            string  `json:"doctor"`
      // Weight            float32 `json:"weight"`
      var requestBody = {
        ID: this.state.dewormingDetail.id,
        PetID: this.state.dewormingDetail.petID,
        Medication: this.state.dewormingDetail.medication,
        DewormingType: this.state.dewormingDetail.dewormingType, // 0:母，1:公，2:未知
        Manufacturer: this.state.dewormingDetail.manufacturer,
        Dosage: this.state.dewormingDetail.dosage, // 物种 1:猫，2:狗
        DewormingDate: this.state.dewormingDetail.dewormingDate,
        Weight: this.state.dewormingDetail.weight,
        NextDewormingDate: this.state.dewormingDetail.nextDewormingDate,
        DewormingAddress: this.state.dewormingDetail.dewormingAddress, // 绝育标识 1:已绝育，0:未绝育
        Remind: this.state.dewormingDetail.remind,
        RemindTime: this.state.dewormingDetail.remindTime,
        Doctor: this.state.dewormingDetail.doctor
      }

      console.log(requestBody)
      Httpclient.post(
        'http://localhost:9669/pet/deworming', requestBody, 'application/json')
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

  render () {
    let petDetail = this.state.petDetail
    return (
      <View className='modify'>
        {/* <Text>驱虫类型：{getDewormingTypeMemo(petDewormingDetail.dewormingType)}</Text>
          <Text>药物名称：{petDewormingDetail.medication}</Text>
          <Text>生产厂商：{petDewormingDetail.manufacture}</Text>
          <Text>当前体重：{petDewormingDetail.weight} KG</Text>
          <Text>用药剂量：{petDewormingDetail.dosage}</Text>
          <Text>驱虫日期：{petDewormingDetail.dewormingDate}</Text>
          <Text>下次驱虫：{petDewormingDetail.nextDewormingDate}</Text>
          <Text>驱虫地点：{petDewormingDetail.dewormingAddress}</Text>
          <Text>宠物医师：{petDewormingDetail.doctor}</Text> */}
          <AtMessage /> 
          <View className='center'>
          <Picker class='picker' mode='selector' range={this.state.dewormingTypeSelector} onChange={this.onDewormingTypeChange.bind(this)}>
            <AtList hasBorder={false}>
              <AtListItem title='驱虫类型' hasBorder={true} extraText={this.state.dewormingTypeSelectorChecked} />
            </AtList>
          </Picker>
          
          <AtInput class='rightInput' name='medication' type='text' title='药物名称' border={true} adjustPosition={true} placeholder='请输入药物名称' value={this.state.medication} onChange={this.onMedicationChange} />
          
          <Picker class='picker' mode='date' value={this.state.dewormingDetail.dewormingDate} onChange={this.onDewormingDateChange}>
            <AtList hasBorder={false}>
              <AtListItem title='驱虫日期' hasBorder={true} extraText={this.state.dewormingDateSel} />
            </AtList>
          </Picker>
          
          <AtInput class='rightInput' name='manufacturer' type='text' title='生产厂商' border={true} adjustPosition={true} placeholder='请输入药物厂商' value={this.state.manufacturer} onChange={this.onManufacturerChange} />

          <AtInput class='rightInput' name='weight' type='number' title='当前体重' border={true} adjustPosition={true} placeholder='请输入体重(KG)' value={this.state.weight} onChange={this.onWeightChange}/>

          <AtInput class='rightInput' name='dosage' type='text' title='用药剂量' border={true} adjustPosition={true} placeholder='请输入用药剂量' value={this.state.dosage} onChange={this.onDosageChange}/>
          
          <AtInput class='rightInput' name='dewormingAddress' type='text' title='驱虫地点' border={true} adjustPosition={true} placeholder='请输入驱虫地点' value={this.state.dewormingAddress} onChange={this.onDewormingAddressChange}/>

          <AtInput class='rightInput' name='doctor' type='text' title='宠物医师' border={true} adjustPosition={true} placeholder='请输入宠物医师' value={this.state.doctor} onChange={this.onDoctorChange}/>
          
          <Picker class='picker' mode='date' value={this.state.dewormingDetail.nextDewormingDate} onChange={this.onNextDewormingDateChange}>
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

