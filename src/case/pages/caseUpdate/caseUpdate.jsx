import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import { AtButton, AtList, AtListItem, AtInput, AtMessage } from 'taro-ui'
import { getVaccineTypeMemo, getCurrentDate, getDiagnosisTypeMemo, getInitialDiagnosisMemo, doSubscription} from '../../../util/tool'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './caseUpdate.scss'
import Httpclient from '../../../../httpclient/http'
import Config from '../../../config/globalConfig.json'

export default class CaseUpdate extends Component {

  constructor(props) {
    super(props)
    this.state = {
      caseDetail: {},
      diagnosisTypeSelector: ['疾病', '体检'],
      diagnosisTypeSelectorChecked: '',
      diagnosisAddress: '',
      diagnosisDate: getCurrentDate(),
      diagnosisDateSel: getCurrentDate(),
      weight: '',
      age: '',
      isInitialSelector: ['初诊', '复诊'],
      isInitialSelectorChecked: '',
      preDiagnosisSelector: [],
      preDiagnosisSelectorChecked: '',
      symptom: '',
      diagnosisResult: '',
      therapy: '',
      medication: '',
      doctor: '',
      revisit: getCurrentDate(),
      revisitSel: getCurrentDate(),
      changed: false,
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
    this.setState({
      changed: false
    })
    // 获取宠物详情
    Httpclient.get(
      Config.request_host + '/pet/case?ID=' + getCurrentInstance().router.params.caseID)
      .then(res => {
        console.log('病历详情')
        console.log(res.Data)
        this.setState({
          caseDetail: res.Data,
          diagnosisTypeSelectorChecked: getDiagnosisTypeMemo(res.Data.diagnosisType),
          diagnosisAddress: res.Data.diagnosisAddress,
          diagnosisDate: res.Data.diagnosisDate,
          diagnosisDateSel: res.Data.diagnosisDate,
          weight: res.Data.weight,
          age: res.Data.age,
          isInitialSelectorChecked: getInitialDiagnosisMemo(res.Data.isInitial),
          symptom: res.Data.symptom,
          diagnosisResult: res.Data.diagnosisResult,
          therapy: res.Data.therapy,
          medication: res.Data.medication,
          doctor: res.Data.doctor,
          revisit: res.Data.revisit,
          revisitSel: res.Data.revisit
        })

        console.log(this.state.diagnosisDate)
        //  获取之前的病历
        Httpclient.get(
          Config.request_host + '/pet/case/history?petID=' + getCurrentInstance().router.params.petID + '&targetTime=' + this.state.diagnosisDate)
          .then(res => {
            console.log('历史病历')
            console.log(res.Data)
            if (res.Data.count > 0) {
              let preDiagnosisList = []
              let preDiagnosis = ''
              res.Data.petCaseList.forEach((item) => {
                  preDiagnosisList.push(item.diagnosisDate.replace(/-/g, '') + '_' + item.diagnosisAddress + '_' + item.id)

                if (item.id === this.state.caseDetail.preID) {
                  preDiagnosis = item.diagnosisDate.replace(/-/g, '') + '_' + item.diagnosisAddress + '_' + item.id
                }
              })
              var preDiagnosisStatus = res.Data.isInitial != 1 && preDiagnosisList.length > 0
              this.setState({
                preDiagnosisSelector: preDiagnosisList,
                preDiagnosisSelectorChecked: preDiagnosisStatus ? preDiagnosis : '',
                hasPreDiagnosis: preDiagnosisStatus
              })
            }
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

  onDiagnosisTypeChange = (e) => {
    console.log(e.detail.value)
    let diagnosisType = Number(e.detail.value) + 1
    let caseDetail = this.state.caseDetail
    let preDiagnosisType = Number(caseDetail.diagnosisType)
    if (diagnosisType === preDiagnosisType) {
      console.log('修改前后没有变化')
      return
    }
    
    caseDetail.diagnosisType = diagnosisType
    this.setState({
      caseDetail: caseDetail,
      diagnosisTypeSelectorChecked: getDiagnosisTypeMemo(diagnosisType),
      changed: true
    })
  }

  onInitialChange = (e) => {
    console.log(e.detail.value)
    let initial = Number(e.detail.value) + 1
    let caseDetail = this.state.caseDetail
    let preInitial = Number(caseDetail.isInitial)
    if (initial === preInitial) {
      console.log('修改前后没有变化')
      return
    }
    
    caseDetail.isInitial = initial
    this.setState({
      caseDetail: caseDetail,
      isInitialSelectorChecked: getInitialDiagnosisMemo(initial),
      changed: true
    })

    console.log('是否是初诊' + initial)
    if (initial === 1) {
      this.setState({
        preDiagnosisSelectorChecked: '',
        hasPreDiagnosis: false
      })
    } else {
      this.setState({
        // preDiagnosisSelectorChecked: '',
        hasPreDiagnosis: true
      })
    }
  }

  onPreDiagnosisChange = (e) => {
    console.log(e.detail.value)
    let content = this.state.preDiagnosisSelector[e.detail.value]
    let contentArr = content.split('-')
    let currentPreID = contentArr[contentArr.length - 1]
    let caseDetail = this.state.caseDetail
    let preID = caseDetail.preID

    if (currentPreID === preID) {
      console.log('修改前后没有变化')
      return
    }

    caseDetail.preID = currentPreID
    this.setState({
      caseDetail: caseDetail,
      preDiagnosisSelectorChecked: content,
      changed: true
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
      let caseDetail = this.state.caseDetail
      caseDetail.diagnosisAddress = value
      this.setState({
        diagnosisAddress: value,
        caseDetail: caseDetail,
        changed: true
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
      let caseDetail = this.state.caseDetail
      caseDetail.weight = value
      this.setState({
        weight: value,
        caseDetail: caseDetail,
        changed: true
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
      let caseDetail = this.state.caseDetail
      caseDetail.age = value
      this.setState({
        age: value,
        caseDetail: caseDetail,
        changed: true
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
      let caseDetail = this.state.caseDetail
      caseDetail.symptom = value
      this.setState({
        symptom: value,
        caseDetail: caseDetail,
        changed: true
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
      let caseDetail = this.state.caseDetail
      caseDetail.diagnosisResult = value
      this.setState({
        diagnosisResult: value,
        caseDetail: caseDetail,
        changed: true
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
      let caseDetail = this.state.caseDetail
      caseDetail.therapy = value
      this.setState({
        therapy: value,
        caseDetail: caseDetail,
        changed: true
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
      let caseDetail = this.state.caseDetail
      caseDetail.medication = value
      this.setState({
        medication: value,
        caseDetail: caseDetail,
        changed: true
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
      let caseDetail = this.state.caseDetail
      caseDetail.doctor = value
      this.setState({
        doctor: value,
        caseDetail: caseDetail,
        changed: true
      })
      errMsgMap.delete('doctor')
    }

    return value
  }

  onDiagnosisDateChange = (e) => {
    console.log(e.detail.value)
    let diagnosisDate = e.detail.value
    let caseDetail = this.state.caseDetail
    let preDiagnosisDate = caseDetail.diagnosisDate
    if (diagnosisDate === preDiagnosisDate) {
      console.log('修改前后没有变化')
      return
    }
    
    caseDetail.diagnosisDate = diagnosisDate
    this.setState({
      caseDetail: caseDetail,
      diagnosisDate: diagnosisDate,
      diagnosisDateSel: diagnosisDate,
      changed: true
    })
  }

  onRevisitChange = (e) => {
    console.log(e.detail.value)
    let revisitDate = e.detail.value
    let caseDetail = this.state.caseDetail
    let preRevisitDate = caseDetail.revisit
    if (revisitDate === preRevisitDate) {
      console.log('修改前后没有变化')
      return
    }

    caseDetail.revisit = revisitDate
    this.setState({
      caseDetail: caseDetail,
      revisit: revisitDate,
      revisitSel: revisitDate,
      changed: true
    })
  }

  commit = (e) =>{
    console.log('提交')
    console.log(this.state.errMsgMap)
    console.log(this.state.caseDetail)
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
      // TODO 查看是否已经接受消息推送
      doSubscription(this.requestCaseUpdate)
      // var needRequestSubscription = true
      // Taro.getSetting({
      //   withSubscriptions: true,
      //   success: (res) => {
      //     console.log(res.subscriptionsSetting)
      //     if (res.subscriptionsSetting.mainSwitch) {
      //       console.log(res.subscriptionsSetting)
      //       if (res.subscriptionsSetting.itemSettings != nil && res.subscriptionsSetting.itemSettings[Config.msgTmpId] == Config.msgTmpId) {
      //         needRequestSubscription = false
      //       }
      //     } else {
      //       needRequestSubscription = false
      //     }
      //   },
      //   fail: () => {
      //     console.log('获取用户权限失败')
      //   }
      // })

      // if (needRequestSubscription) {
      //   var remind = 0
      //   Taro.requestSubscribeMessage({
      //     tmplIds: [Config.msgTmpId],
      //     success: (res) => {
      //       console.log('用户授权成功')
      //       if (res[Config.msgTmpId] == 'accept') {
      //         console.log('同意订阅')
      //         remind = 1
      //       } else {
      //         console.log('订阅失败')
      //       }
      //       this.requestCaseUpdate(remind)
      //     },
      //     fail: (e) => {
      //       console.log('用户授权失败[' + e.errCode + '],' + e.errMsg)
      //       console.log('订阅失败')
      //       this.requestCaseUpdate(remind)
      //     }
      //   })
      // }
    }
  }

  requestCaseUpdate = (remind) => {
    var requestBody = {
      ID: this.state.caseDetail.id,
      PetID: this.state.caseDetail.petID,
      PreID: this.state.caseDetail.preID,
      Age: Number(this.state.caseDetail.age), 
      DiagnosisAddress: this.state.caseDetail.diagnosisAddress,
      DiagnosisDate: this.state.caseDetail.diagnosisDate,
      DiagnosisResult: this.state.caseDetail.diagnosisResult,
      DiagnosisType: this.state.caseDetail.diagnosisType, 
      IsInitial: this.state.caseDetail.isInitial,
      Weight: Number(this.state.caseDetail.weight),
      Medication: this.state.caseDetail.medication,
      Revisit: this.state.caseDetail.revisit, 
      Symptom: this.state.caseDetail.symptom, 
      Revisit: this.state.caseDetail.revisit, 
      Therapy: this.state.caseDetail.therapy,
      Remind: remind,
      RemindTime: this.state.caseDetail.remindTime,
      Doctor: this.state.caseDetail.doctor
    }

    console.log(requestBody)
    Httpclient.post(
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

  goback = () => {
    if (!this.state.changed) {
      return
    }
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

          <Picker class='picker' mode='date' value={this.state.caseDetail.diagnosisDate} onChange={this.onDiagnosisDateChange.bind(this)}>
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
          
          <Picker class='picker' mode='date' value={this.state.caseDetail.revisit} onChange={this.onRevisitChange.bind(this)}>
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

