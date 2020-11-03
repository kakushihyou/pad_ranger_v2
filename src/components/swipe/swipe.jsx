import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton, AtAvatar, AtSwipeAction } from 'taro-ui'
import Taro from '@tarojs/taro'

import "taro-ui/dist/style/components/button.scss"
import "taro-ui/dist/style/components/swipe-action.scss";
import './swipe.scss'
import Httpclient from '../../../httpclient/http'
import HeartBreak from '../../assets/icon/heart_break.png'
import HeartBroken from '../../assets/icon/heart_broken.png'


export default class Swipe extends Component {

  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e) {
    console.log(e)
    let modifyUrl = this.props.modify_url
    let petInfo = this.props.info
    if (e.text === '修改') {
      Taro.showModal({
          cancelText:'认错人了',
          cancelColor:'#FFC1C1',
          confirmText:'dei!',
          confirmColor:'#9BCEFA',
          content:'是你要修改朕(' + petInfo.nickName + ')的信息？',
          showCancel: true,  //是否显示取消按钮
          success(res)
          {
              if(res.confirm)
              {
                console.log('修改')
                Taro.navigateTo({
                  url: modifyUrl
                })
              }else if(res.cancel)
              {
                console.log('取消修改')
              }
          }
      })
    } else if (e.text === '删除') {
      Taro.showModal({
        cancelText:'好',
        cancelColor:'#FFC1C1',
        confirmText:'狠心拒绝',
        confirmColor:'#9BCEFA',
        content:'可以让' + petInfo.nickName + '继续陪着你吗？',
        showCancel: true,  //是否显示取消按钮
        success(res)
        {
            if(res.confirm)
            {
              // console.log('删除')
              // Httpclient.delete('http://localhost:9669/pet?ID=' + '100000')
              // .then(res => {
                Taro.showToast({
                  title: petInfo.accompanyDays + '天，谢谢你',
                  duration: 3200,
                  icon: "none"
                })
              // })
              // .catch(err => {
              //   console.error(err)
              //   Taro.showToast({
              //     title: '再陪你一会儿',
              //     icon: "none"
              //   })
              //   return
              // })
            }else if(res.cancel)
            {
              console.log('取消删除')
            }
        }
    })
    }
  }

  render () {
    return (
      <AtSwipeAction onClick={this.handleClick} options={[
        {
          text: '修改',
          style: {
            backgroundColor: '#9BCEFA'
          }
        },
        {
          text: '删除',
          style: {
            backgroundColor: '#FFC1C1'
          }
        }
      ]}>
        <View className='normal'>{this.props.content}</View>
      </AtSwipeAction>
    )
  }
}

// 获取性别
function getGenderStr(gender) {
  let genderStr
  switch (gender) {
    case 0:
      genderStr = '母'
      break;
  
    case 1:
      genderStr = '公'
      break

    default:
      genderStr = '未知'
      break;
  }

  return genderStr
}

// 获取默认头像
function getDefaultHeadImg(species) {
  let headImg 
  switch (species) {
    case 1:
      headImg = DefaultCatHeadImg
      break
    case 2:
      headImg = DefaultDogHeadImg
      break
    default:
      break
  }

  return headImg
}

// 根据字符串生日计算年龄
function jsGetAge(strBirthday)
{       
    var returnAge;
    var strBirthdayArr=strBirthday.split(" ")[0].split("-");
    var birthYear = strBirthdayArr[0];
    // console.log("year: " + birthYear)
    var birthMonth = strBirthdayArr[1];
    // console.log("month: " + birthMonth)
    var birthDay = strBirthdayArr[2];
    // console.log("day: " + birthDay)
    
    var d = new Date();
    var nowYear = d.getFullYear();
    // console.log("当前年：" + nowYear)
    var nowMonth = d.getMonth() + 1;
    // console.log("当前月：" + nowMonth)
    var nowDay = d.getDate();
    // console.log("当前日：" + nowDay) 
    
    if(nowYear == birthYear)
    {
        returnAge = 0;//同年 则为0岁
    }
    else
    {
        var ageDiff = nowYear - birthYear ; //年之差
        if(ageDiff > 0)
        {
            if(nowMonth == birthMonth)
            {
                var dayDiff = nowDay - birthDay;//日之差
                if(dayDiff < 0)
                {
                    returnAge = ageDiff - 1;
                }
                else
                {
                    returnAge = ageDiff ;
                }
            }
            else
            {
                var monthDiff = nowMonth - birthMonth;//月之差
                if(monthDiff < 0)
                {
                    returnAge = ageDiff - 1;
                }
                else
                {
                    returnAge = ageDiff ;
                }
            }
        }
        else
        {
            returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
        }
    }
    
    return returnAge;//返回周岁年龄
    
}