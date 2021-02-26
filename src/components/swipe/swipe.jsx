import React, { Component } from 'react'
import { View } from '@tarojs/components'
import { AtSwipeAction } from 'taro-ui'
import Taro, { getCurrentPages, getSystemInfo } from '@tarojs/taro'

import "taro-ui/dist/style/components/button.scss"
import "taro-ui/dist/style/components/swipe-action.scss"
import './swipe.scss'
import Httpclient from '../../../httpclient/http'
import Config from '../../config/globalConfig.json'

export default class Swipe extends Component {

  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e) {
    console.log(e)
    let petInfo = this.props.info
    if (e.text === '修改') {
      
      console.log('修改')
      Taro.navigateTo({
        url: '/pet/pages/petUpdate/petUpdate?petID=' + petInfo.id
      })
    } else if (e.text === '删除') {
      Taro.showModal({
        cancelText:'好',
        cancelColor:'#FFC1C1',
        confirmText:'狠心拒绝',
        confirmColor:'#9BCEFA',
        content: petInfo.nickName + '想继续守在你身边，可以吗？',
        showCancel: true,  //是否显示取消按钮
        success(res)
        {
            if(res.confirm)
            {
              console.log('删除')
              Httpclient.delete(Config.request_host + '/pet?ID=' + petInfo.id)
              .then(res => {
                Taro.showToast({
                  title: petInfo.accompanyDays + '天，谢谢你',
                  duration: 3200,
                  icon: "none",
                  complete: function() {
                    var page = getCurrentPages().pop()
                    console.log(page)
                    if (page == undefined || page == null) {
                      return
                    }
                    page.onShow()
                  }
                })
              })
              .catch(err => {
                console.error(err)
                Taro.showToast({
                  title: '再陪你一会儿',
                  icon: "none"
                })
                return
              })
            }else if(res.cancel)
            {
              console.log('取消删除')
            }
        }
      })
    }
  }

  render () {
    let currentAreaWidth
    Taro.getSystemInfo({
      success: function (res) {
        currentAreaWidth = res.screenWidth
      }
    })
    return (
      // <View>
        <AtSwipeAction className='withBorder' onClick={this.handleClick} areaWidth={currentAreaWidth} maxDistance={140}
        options={[
          {
            text: '修改',
            style: {
              width: 32,
              backgroundColor: '#9BCEFA'
            }
          },
          {
            text: '删除',
            style: {
              width: 32,
              backgroundColor: '#FFC1C1'
            }
          }
        ]}>
          <View className='normal'>{this.props.content}</View>
        </AtSwipeAction>
      // </View>
    )
  }
}