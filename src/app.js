import { getApp } from '@tarojs/taro'
import { Component } from 'react'
import Taro from '@tarojs/taro'
import 'taro-ui/dist/style/index.scss'
import './app.scss'

class App extends Component {

  componentDidMount () {
    Taro.onAppShow(() => {
      const updateManager = Taro.getUpdateManager()
      updateManager.onCheckForUpdate((res) => {
        console.log('是否需要更新：' + res.hasUpdate)
        if (res.hasUpdate) {
          updateManager.onUpdateReady(() => {
            Taro.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启当前应用？',
              confirmText: '马上重启',
              confirmColor: '#9BCEFA',
              cancelText: '暂不重启',
              cancelColor: '#FFC1C1',
              success: (res) => {
                if (res.confirm){
                  console.log('重启应用')
                  updateManager.applyUpdate()
                } else {
                  console.log('暂不重启')
                }
              }
            })
          })
          // 新版本下载失败时执行
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '发现新版本',
              content: '请删除当前小程序，重新搜索打开...',
            })
          })
        }
      })
    })
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // this.props.children 是将要会渲染的页面
  render () {
    return this.props.children
  }
}

export default App
