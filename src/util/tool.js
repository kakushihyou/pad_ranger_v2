import DefaultCatHeadImg from "../assets/headimg/cat_default.png";
import DefaultDogHeadImg from "../assets/headimg/dog_default.png";
import Taro from '@tarojs/taro'

const getDefaultHeadImg = (species) => {
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

const getCurrentDate = () => {
    var d = new Date();
    var nowYear = d.getFullYear();
    // console.log("当前年：" + nowYear)
    var nowMonth = d.getMonth() + 1;
    // console.log("当前月：" + nowMonth)
    var nowDay = d.getDate();
    var nowDayStr = String(nowDay)
    console.log(nowDay)
    if (nowDay < 10) {
      
      nowDayStr = '0' + nowDayStr
    }
    return nowYear + '-' + nowMonth + '-' + nowDayStr
}

const jsGetAge = (strBirthday) =>{       
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

// 获取性别
const getGenderStr = (gender) => {
  let genderStr
  switch (gender) {
    case 0:
      genderStr = '母'
      break
  
    case 1:
      genderStr = '公'
      break

    default:
      genderStr = '未知'
  }

  return genderStr
}

const getSpeciesMemo = (species) => {
  let speciesMemo
  switch(species) {
    case 1:
      speciesMemo = '猫'
      break
    case 2:
      speciesMemo = '狗'
      break
    default:
      speciesMemo = '未知'
      break
  }

  return speciesMemo
}

const getSterilizationMemo = (sterilizationFlag) => {
  let sterilizationMemo
  switch(sterilizationFlag) {
    case 1:
      sterilizationMemo = '已绝育'
      break
    default:
      sterilizationMemo = '未绝育'
      break
  }

  return sterilizationMemo
}

const getInoculationMemo = (inoculationFlag) => {
  let inoculationMemo
  switch(inoculationFlag) {
    case 1:
      inoculationMemo = '已接种'
      break
    default:
      inoculationMemo = '未接种'
      break
  }

  return inoculationMemo
}

const getDewormingTypeMemo = (dewormingType) => {
  let getDewormingTypeMemo
  switch(dewormingType) {
    case 1:
      getDewormingTypeMemo = '体内'
      break
    default:
      getDewormingTypeMemo = '体外'
      break
  }

  return getDewormingTypeMemo
}

const getVaccineTypeMemo = (vaccineType) => {
  let vaccineTypeMemo
  switch (vaccineType) {
    case 1:
      vaccineTypeMemo = '核心疫苗'
      break;
  
    default:
      vaccineTypeMemo = '非核心疫苗'
      break;
  }

  return vaccineTypeMemo
}

export {getDefaultHeadImg, jsGetAge, getGenderStr, getSpeciesMemo, getSterilizationMemo, getInoculationMemo, getCurrentDate, getDewormingTypeMemo, getVaccineTypeMemo}