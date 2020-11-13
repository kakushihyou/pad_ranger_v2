import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton , AtTabs, AtTabsPane, AtFab} from 'taro-ui'
import Taro from '@tarojs/taro'
import "taro-ui/dist/style/components/button.scss" // 按需引入
import './situationDetail.scss'
import PetInoculationList from '../../components/petInoculationList/petInoculationList'
import PetDewormingList from '../../components/petDewormingList/petDewormingList'
import { getCurrentInstance } from '@tarojs/taro'
import Httpclient from '../../../httpclient/http'

export default class SituationDetail extends Component {

  constructor (props) {
    super(props)
    this.state = {
      current: 0,
      centerHeight: 0,
      petInoculationList: [],
      petDewormingList: [],
      petCaseList: []
    }
    this.getInoculationList = this.getInoculationList.bind(this)
    this.getDewormingList = this.getDewormingList.bind(this)
  }

  componentDidShow = () => {
    console.log('当前是详情页')
    this.switchTab()
    
  }

  switchTab = () => {
    if (this.state.current === 0) {
      console.log('疫苗')
      this.getInoculationList()
    } else if (this.state.current === 1) {
      console.log('驱虫')
      this.getDewormingList()
    } else if (this.state.current === 2) {
      console.log('疾病')
    } else {
      Taro.showToast({
        title: '别闹，朕困～',
        icon: "none"
      })
    }
  }

  getInoculationList = () => {
    // TODO 获取疫苗记录
    Httpclient.get('http://localhost:9669/pet/inoculation/list?petID=' + getCurrentInstance().router.params.petID)
    .then(res => {
      console.log(res.Data)
      if (res.Data.count > 0) {
        this.setState({
          petInoculationList: res.Data.petInoculationList
        })
      }
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

  getDewormingList = () => {
    // TODO 获取驱虫记录
    Httpclient.get('http://localhost:9669/pet/deworming/list?petID=' + getCurrentInstance().router.params.petID)
    .then(res => {
      console.log(res.Data)
      if (res.Data.count > 0) {
        this.setState({
          petDewormingList: res.Data.petDewormingList
        })
      }
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

  handleClick (value) {
    this.setState({
      current: value
    })

    this.switchTab()
  }

  onButtonClick = () => {
    switch(this.state.current) {
      case 0:
        console.log('跳转到新增疫苗记录页面')
        break
      case 1:
        console.log('跳转到新增驱虫记录页面')
        break
      case 2:
        console.log('跳转到新增病例记录页面')
        break
      default:
        Taro.showToast({
          title: '别闹，朕困～',
          icon: 'none',
          duration: 2000
        }
      )
    }
  } 

  // 获取可视区高度
  componentDidMount () {
    const info = Taro.getSystemInfoSync()
    const { windowHeight, statusBarHeight, titleBarHeight } = info
    const tempHeight = (windowHeight - 50) + 'px'
    this.setState({
      centerHeight: tempHeight
    })
  }

  render () {
    const tabList = [{ title: '疫苗' }, { title: '驱虫' }, { title: '疾病' }]
    const { centerHeight } = this.state
    const scrollStyle = {
      height: centerHeight,
      overflow: 'scroll'
    }
    // const scrollTop = 0
    // const Threshold = 20
    return (
      <View>
        <View className='tab_view'>
          <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
            <AtTabsPane current={this.state.current} index={0} >
              <View style={scrollStyle}>
                <PetInoculationList list={this.state.petInoculationList}/>
              </View>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={1}>
              <View style={scrollStyle}>
                <PetDewormingList list={this.state.petDewormingList}/>
              </View>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={2}>
              <View style={scrollStyle}>
                疾病
              </View>
            </AtTabsPane>
          </AtTabs>
        </View>
        <View className="post-button">
          <AtFab className='fabButton' onClick={this.onButtonClick.bind(this)} size='small'>
            <Text className="at-fab__icon at-icon at-icon-add"></Text>
          </AtFab>
        </View>
      </View>
      
    )
  }
}
