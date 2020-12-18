import React, { Component } from 'react'
import { View, Text, Picker } from '@tarojs/components'
import { AtList, AtListItem, AtFab, AtSearchBar} from 'taro-ui'
import Taro, {getCurrentInstance} from '@tarojs/taro'
import "taro-ui/dist/style/components/button.scss" // 按需引入
import './diary.scss'
import DiaryItem from '../../components/diaryItem/diaryItem'
import Httpclient from '../../../httpclient/http'

export default class Diary extends Component {

  constructor(props) {
    super(props)
    this.state = {
      userID: '1000000002',
      condition: '',
      conditionDate: '',
      conditionDateSel: '',
      pageNum: 1,
      diaryList: []
    }

  }

  componentDidShow = () => {
    // 获取用户日记列表
    Httpclient.get('http://localhost:9669/diary/list?userID=' + this.state.userID + '&pageNum=' + this.state.pageNum + '&keyword=' + this.state.condition)
    .then(res => {
      console.log(res.Data)
      if (res.Data.count > 0) {
        this.setState({
          diaryList: res.Data.diaryList
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

  onReachBottom = () => {
    console.log('hahah')
    let pageNum = this.state.pageNum
    this.setState({
      pageNum: pageNum + 1
    })

    this.search()
  }

  search = function() {

    if (this.state.condition == null && this.state.condition == "") {
      this.setState({
        pageNum: 1
      })
    }
    Httpclient.get('http://localhost:9669//diary/list?userID=' + this.state.userID + '&pageNum=' + this.state.pageNum + '&keyword=' + this.state.condition)
    .then(res => {
      console.log(res.Data)
      if (res.Data.count > 0) {
        let list = this.state.diaryList
        list.push(res.Data.diaryList)
        this.setState({
          diaryList: list
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

  onConditionDateChange = (e) => {
    console.log(e.detail.value)
    let conditionDate = e.detail.value
    
    this.setState({
      conditionDate: conditionDate,
      conditionDateSel: conditionDate
    })

    this.search()
  }

  onChange = (e) => {
    // console.log(e)
    this.setState({
      condition: e
    })
  }

  onActionClick = (e) => {
    console.log(this.state.condition)
    this.setState({
      pageNum: 1
    })
    Httpclient.get('http://localhost:9669//diary/list?userID=' + this.state.userID + '&pageNum=' + this.state.pageNum + '&keyword=' + this.state.condition)
    .then(res => {
      console.log(res.Data)
      this.setState({
        diaryList: res.Data.diaryList
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

  onButtonClick = () => {
    // 跳转到新增日记页面
    Taro.navigateTo({
      url: '/pages/diaryAdd/diaryAdd?userID=' + this.state.userID
    })
  }

 

  render () {
    // console.log(this.state.diaryList.length)
    return (
      <View className='diary'>
        <AtSearchBar placeholder="请输入要搜索的日记内容关键词" fixed={true} showActionButton={false} inputType='number' value={this.state.condition} onChange={this.onChange.bind(this)} onActionClick={this.onActionClick.bind(this)} />
        {/* <Picker class='picker' mode='date' value={this.state.conditionDate} onChange={this.onConditionDateChange.bind(this)} fields='month'>
          <AtList hasBorder={false}>
            <AtListItem title='点击选择日期 > ' hasBorder={false} extraText={this.state.conditionDateSel} />
          </AtList>
        </Picker> */}
        <View className='list'>
          {
            (this.state.diaryList != null && this.state.diaryList.length > 0) ? (
              this.state.diaryList.map((item) => {
                return (
                  <DiaryItem info={item} />
                )
              })
            ) : (<View /> )
          }
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
