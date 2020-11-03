import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton, AtAvatar } from 'taro-ui'
import Taro from '@tarojs/taro'
import {getDefaultHeadImg, jsGetAge, getGenderStr} from '../../util/tool'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './singlePetResume.scss'


export default class SinglePetResume extends Component {

  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    console.log('进入详情页面')
    
    Taro.navigateTo({
      url:'/pages/petDetail/petDetail'
    })
  }

  render () {
    let petResume = this.props.petResume
    // console.log('获取到宠物概要' + JSON.stringify(petResume))
    return (
      <View className='singlePet' onClick={this.handleClick}>
        <View className='photo'>
          <AtAvatar circle size='small' image={petResume.headImg === '' ? getDefaultHeadImg(petResume.species) : petResume.headImg}></AtAvatar>
        </View>
        <View className='petResume' >
          <Text>昵称：{petResume.nickName}</Text>
          <Text>年龄：{jsGetAge(petResume.birthday)} 岁</Text>
          <Text>性别：{getGenderStr(petResume.gender)}</Text>
        </View>

        {/* <AtButton className='modify' type='primary' size='small' circle>修改</AtButton>
        <AtButton className='delete' type='primary' size='small' circle>删除</AtButton> */}
      </View>
    )
  }
}

// 获取性别
// function getGenderStr(gender) {
//   let genderStr
//   switch (gender) {
//     case 0:
//       genderStr = '母'
//       break;
  
//     case 1:
//       genderStr = '公'
//       break

//     default:
//       genderStr = '未知'
//       break;
//   }

//   return genderStr
// }

// 获取默认头像
// function getDefaultHeadImg(species) {
//   let headImg 
//   switch (species) {
//     case 1:
//       headImg = DefaultCatHeadImg
//       break
//     case 2:
//       headImg = DefaultDogHeadImg
//       break
//     default:
//       break
//   }

//   return headImg
// }

// 根据字符串生日计算年龄
// function jsGetAge(strBirthday)
// {       
//     var returnAge;
//     var strBirthdayArr=strBirthday.split(" ")[0].split("-");
//     var birthYear = strBirthdayArr[0];
//     // console.log("year: " + birthYear)
//     var birthMonth = strBirthdayArr[1];
//     // console.log("month: " + birthMonth)
//     var birthDay = strBirthdayArr[2];
//     // console.log("day: " + birthDay)
    
//     var d = new Date();
//     var nowYear = d.getFullYear();
//     // console.log("当前年：" + nowYear)
//     var nowMonth = d.getMonth() + 1;
//     // console.log("当前月：" + nowMonth)
//     var nowDay = d.getDate();
//     // console.log("当前日：" + nowDay) 
    
//     if(nowYear == birthYear)
//     {
//         returnAge = 0;//同年 则为0岁
//     }
//     else
//     {
//         var ageDiff = nowYear - birthYear ; //年之差
//         if(ageDiff > 0)
//         {
//             if(nowMonth == birthMonth)
//             {
//                 var dayDiff = nowDay - birthDay;//日之差
//                 if(dayDiff < 0)
//                 {
//                     returnAge = ageDiff - 1;
//                 }
//                 else
//                 {
//                     returnAge = ageDiff ;
//                 }
//             }
//             else
//             {
//                 var monthDiff = nowMonth - birthMonth;//月之差
//                 if(monthDiff < 0)
//                 {
//                     returnAge = ageDiff - 1;
//                 }
//                 else
//                 {
//                     returnAge = ageDiff ;
//                 }
//             }
//         }
//         else
//         {
//             returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
//         }
//     }
    
//     return returnAge;//返回周岁年龄
    
// }