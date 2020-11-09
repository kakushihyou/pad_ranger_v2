import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton , AtTabs, AtTabsPane, AtSegmentedControl} from 'taro-ui'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './situationDetail.scss'

export default class Case extends Component {

  constructor (props) {
    super(props)
    this.state = {
      current: 0,
    }
  }

  handleClick (value) {
    this.setState({
      current: value
    })
  }


  render () {
    const tabList = [{ title: '疫苗' }, { title: '驱虫' }, { title: '疾病' }]
    return (
      <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
        <AtTabsPane current={this.state.current} index={0} >
          <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;' >标签页一的内容</View>
        </AtTabsPane>
        <AtTabsPane current={this.state.current} index={1}>
          <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>标签页二的内容</View>
        </AtTabsPane>
        <AtTabsPane current={this.state.current} index={2}>
          <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>标签页三的内容</View>
        </AtTabsPane>
      </AtTabs>
    )
  }
}
