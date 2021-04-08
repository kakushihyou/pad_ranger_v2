import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import { AtButton, AtList, AtListItem, AtInput, AtMessage } from 'taro-ui'
import { getCurrentDate, getDiagnosisTypeMemo, getInitialDiagnosisMemo} from '../../../util/tool'
import "taro-ui/dist/style/components/button.scss" // 按需引入
import './caseAdd.scss'
import Httpclient from '../../../../httpclient/http'
import Config from '../../../config/globalConfig.json'

export default class CaseUpdate extends Component {

  constructor(props) {
    super(props)
    this.state = {
      diagnosisType: '',
      diagnosisTypeSelector: ['疾病', '体检'],
      diagnosisTypeSelectorChecked: '疾病',
      diagnosisAddress: '',
      diagnosisDate: getCurrentDate(),
      diagnosisDateSel: getCurrentDate(),
      weight: '',
      age: '',
      isInitial: '',
      isInitialSelector: ['初诊', '复诊'],
      isInitialSelectorChecked: '初诊',
      preDiagnosis: '',
      preDiagnosisSelector: [],
      preDiagnosisSelectorChecked: '',
      symptom: '',
      diagnosisResult: '',
      therapy: '',
      medication: '',
      doctor: '',
      revisit: getCurrentDate(),
      revisitSel: getCurrentDate(),
      saved: false,
      hasPreDiagnosis: false,
      errMsgMap: new Map()
    }
    
    this.commit = this.commit.bind(this)
    this.goback = this.goback.bind(this)
  }

  componentDidShow () { 
    console.log(getCurrentInstance().router.params)
    Taro.hideToast()
    // 获取之前的病历
    Httpclient.get(
      Config.request_host + '/pet/case/history?petID=' + getCurrentInstance().router.params.petID + '&targetTime=' + getCurrentDate())
      .then(res => {
        console.log('历史病历')
        console.log(res.Data)
        if (res.Data.count > 0) {
          let preDiagnosisList = []
          res.Data.petCaseList.forEach((item) => {
            preDiagnosisList.push(item.diagnosisDate.replace(/-/g, '') + '_' + item.diagnosisAddress + '_' + item.id)
          })
        
          this.setState({
            preDiagnosisSelector: preDiagnosisList
          })
        }
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

  onDiagnosisTypeChange = (e) => {
    console.log(e.detail.value)
    let diagnosisType = Number(e.detail.value) + 1
    
    this.setState({
      diagnosisType: diagnosisType,
      diagnosisTypeSelectorChecked: getDiagnosisTypeMemo(diagnosisType)
    })
  }

  onInitialChange = (e) => {
    console.log(e.detail.value)
    let initial = Number(e.detail.value) + 1
    
    this.setState({
      isInitial: initial,
      isInitialSelectorChecked: getInitialDiagnosisMemo(initial)
    })

    console.log('是否是初诊' + initial)
    if (initial === 1) {
      this.setState({
        preDiagnosisSelectorChecked: '',
        hasPreDiagnosis: false
      })
    } else {
      this.setState({
        hasPreDiagnosis: true
      })
    }
  }

  onPreDiagnosisChange = (e) => {
    console.log(e.detail.value)
    let content = this.state.preDiagnosisSelector[e.detail.value]
    let contentArr = content.split('-')
    let currentPreID = contentArr[contentArr.length - 1]

    this.setState({
      preDiagnosis: currentPreID,
      preDiagnosisSelectorChecked: content
    })
  }

  onDiagnosisAddressChange = (value) => {
    console.log(value)
    let errMsgMap = this.state.errMsgMap
    let errMsg = '你带朕去哪了？'
    if (value == null || value == '') {
      Taro.atMessage({
        message: errMsg,
        type: 'error',
        duration: 2000
      })
      errMsgMap.set('diagnosisAddress', errMsg)
      this.setState({
        diagnosisAddress: '',
        errMsgMap: errMsgMap
      })
    } else {
    
      this.setState({
        diagnosisAddress: value
      })
      errMsgMap.delete('diagnosisAddress')
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

  onAgeChange = (value) => {
    console.log(value)
    let errMsgMap = this.state.errMsgMap
    let errMsg = '你忘了朕的年龄了？'
    if (value == null || value == '') {
      Taro.atMessage({
        message: errMsg,
        type: 'error',
        duration: 2000
      })
      errMsgMap.set('age', errMsg)
      this.setState({
        age: '',
        errMsgMap: errMsgMap
      })
    } else {
      
      this.setState({
        age: value
      })
      errMsgMap.delete('age')
    }

    return value
  }

  onSymptomChange = (value) => {
    console.log(value)
    let errMsgMap = this.state.errMsgMap
    let errMsg = '朕看起来如何？'
    if (value == null || value == '') {
      Taro.atMessage({
        message: errMsg,
        type: 'error',
        duration: 2000
      })
      errMsgMap.set('symptom', errMsg)
      this.setState({
        symptom: '',
        errMsgMap: errMsgMap
      })
    } else {
      
      this.setState({
        symptom: value
      })
      errMsgMap.delete('symptom')
    }

    return value
  }

  onDiagnosisResultChange = (value) => {
    console.log(value)
    let errMsgMap = this.state.errMsgMap
    let errMsg = '御医怎么说？'
    if (value == null || value == '') {
      Taro.atMessage({
        message: errMsg,
        type: 'error',
        duration: 2000
      })
      errMsgMap.set('diagnosisResult', errMsg)
      this.setState({
        diagnosisResult: '',
        errMsgMap: errMsgMap
      })
    } else {
      
      this.setState({
        diagnosisResult: value
      })
      errMsgMap.delete('diagnosisResult')
    }

    return value
  }

  onTherapyChange = (value) => {
    console.log(value)
    let errMsgMap = this.state.errMsgMap
    let errMsg = '朕可还有救？'
    if (value == null || value == '') {
      Taro.atMessage({
        message: errMsg,
        type: 'error',
        duration: 2000
      })
      errMsgMap.set('therapy', errMsg)
      this.setState({
        therapy: '',
        errMsgMap: errMsgMap
      })
    } else {
      
      this.setState({
        therapy: value
      })
      errMsgMap.delete('therapy')
    }

    return value
  }

  onMedicationChange = (value) => {
    console.log(value)
    let errMsgMap = this.state.errMsgMap
    let errMsg = '御医给朕开了什么方子？'
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

  onDiagnosisDateChange = (e) => {
    console.log(e.detail.value)
    let diagnosisDate = e.detail.value
    
    this.setState({
      diagnosisDate: diagnosisDate,
      diagnosisDateSel: diagnosisDate
    })
  }

  onRevisitChange = (e) => {
    console.log(e.detail.value)
    let revisitDate = e.detail.value
   
    this.setState({
      revisit: revisitDate,
      revisitSel: revisitDate
    })
  }

  commit = (e) =>{
    console.log('提交')
    console.log(this.state.errMsgMap)
    console.log(this.state.caseDetail)
    let errMsgMap = this.state.errMsgMap
    if (this.state.age == null || this.state.age.length == 0 || this.state.age == 0) {
      errMsgMap.set('age', '你忘了朕的年龄了？')
    }

    if (this.state.weight == null || this.state.weight.length == 0 || this.state.weight <= 0) {
      errMsgMap.set('weight', '难道朕在你心里没有重量吗？')
    }

    if (this.state.symptom == null || this.state.symptom.length == 0) {
      errMsgMap.set('symptom', '朕看起来如何？')
    }

    if (this.state.diagnosisResult == null || this.state.diagnosisResult.length == 0) {
      errMsgMap.set('diagnosisResult', '御医怎么说？')
    }

    if (this.state.therapy == null || this.state.therapy.length == 0) {
      errMsgMap.set('therapy', '朕可还有救？')
    }

    if (this.state.diagnosisAddress == null || this.state.diagnosisAddress.length == 0) {
      errMsgMap.set('diagnosisAddress', '你带朕去哪了？')
    }

    if (this.state.medication == null || this.state.medication.length == 0) {
      errMsgMap.set('medication', '御医给朕开了什么方子？')
    }

    if (this.state.doctor == null || this.state.doctor.length == 0) {
      errMsgMap.set('doctor', '朕的御医呢？')
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
    } else {
      
      var requestBody = {
        PetID: Number(getCurrentInstance().router.params.petID),
        PreID: Number(this.state.preDiagnosis),
        Age: Number(this.state.age), 
        DiagnosisAddress: this.state.diagnosisAddress,
        DiagnosisDate: this.state.diagnosisDate,
        DiagnosisResult: this.state.diagnosisResult,
        DiagnosisType: Number(this.state.diagnosisType), 
        IsInitial: Number(this.state.isInitial),
        Weight: Number(this.state.weight),
        Medication: this.state.medication,
        Revisit: this.state.revisit, 
        Symptom: this.state.symptom, 
        Revisit: this.state.revisit, 
        Therapy: this.state.therapy,
        RemindTime: this.state.remindTime,
        Doctor: this.state.doctor
      }

      console.log(requestBody)
      Httpclient.put(
        Config.request_host + '/pet/case', requestBody, 'application/json')
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
          
          <Picker class='picker' mode='selector' range={this.state.diagnosisTypeSelector} onChange={this.onDiagnosisTypeChange.bind(this)}>
            <AtList hasBorder={false}>
              <AtListItem title='就医类型' hasBorder={true} extraText={this.state.diagnosisTypeSelectorChecked} />
            </AtList>
          </Picker>

          <AtInput class='rightInput' name='diagnosisAddress' type='text' title='就诊地点' border={true} adjustPosition={true} placeholder='请输入就诊地点' value={this.state.diagnosisAddress} onChange={this.onDiagnosisAddressChange.bind(this)} />

          <Picker class='picker' mode='date' value={this.state.diagnosisDate} onChange={this.onDiagnosisDateChange.bind(this)}>
            <AtList hasBorder={false}>
              <AtListItem title='就诊日期' hasBorder={true} extraText={this.state.diagnosisDateSel} />
            </AtList>
          </Picker>
          
          <AtInput class='rightInput' name='weight' type='number' title='当前体重' border={true} adjustPosition={true} placeholder='请输入体重(KG)' value={this.state.weight} onChange={this.onWeightChange.bind(this)}/>
          
          <AtInput class='rightInput' name='age' type='number' title='就诊年龄' border={true} adjustPosition={true} placeholder='请输入就诊年龄' value={this.state.age} onChange={this.onAgeChange.bind(this)} />

          <Picker class='picker' mode='selector' range={this.state.isInitialSelector} onChange={this.onInitialChange.bind(this)}>
            <AtList hasBorder={false}>
              <AtListItem title='是否初诊' hasBorder={true} extraText={this.state.isInitialSelectorChecked} />
            </AtList>
          </Picker>

          <Picker class='picker' mode='selector' disabled={!this.state.hasPreDiagnosis} range={this.state.preDiagnosisSelector} onChange={this.onPreDiagnosisChange.bind(this)}>
            <AtList hasBorder={false}>
              <AtListItem title='上次诊疗' hasBorder={true} extraText={this.state.preDiagnosisSelectorChecked} />
            </AtList>
          </Picker>

          <AtInput class='rightInput' name='symptom' type='text' title='症状概述' border={true} adjustPosition={true} placeholder='请输入症状' value={this.state.symptom} onChange={this.onSymptomChange.bind(this)}/>
          
          <AtInput class='rightInput' name='diagnosisResult' type='text' title='诊断结果' border={true} adjustPosition={true} placeholder='请输入诊断结果' value={this.state.diagnosisResult} onChange={this.onDiagnosisResultChange.bind(this)}/>
          <AtInput class='rightInput' name='therapy' type='text' title='治疗方法' border={true} adjustPosition={true} placeholder='请输入治疗方法' value={this.state.therapy} onChange={this.onTherapyChange.bind(this)}/>
          <AtInput class='rightInput' name='medication' type='text' title='治疗用药' border={true} adjustPosition={true} placeholder='请输入治疗用药' value={this.state.medication} onChange={this.onMedicationChange.bind(this)}/>

          <AtInput class='rightInput' name='doctor' type='text' title='宠物医师' border={true} adjustPosition={true} placeholder='请输入宠物医师' value={this.state.doctor} onChange={this.onDoctorChange.bind(this)}/>
          
          <Picker class='picker' mode='date' value={this.state.revisit} onChange={this.onRevisitChange.bind(this)}>
            <AtList hasBorder={false}>
              <AtListItem title='复诊日期' hasBorder={false} extraText={this.state.revisit} />
            </AtList>
          </Picker>
        </View>
        <AtButton className='confirm' type='primary' size='small' circle onClick={this.commit}>确认</AtButton>
        <AtButton className='cancel' type='primary' size='small' circle onClick={this.goback}>取消</AtButton>
      </View>
    )
  }
}

