import DefaultCatHeadImg from "../assets/headimg/cat_default.png";
import DefaultDogHeadImg from "../assets/headimg/dog_default.png";
import Httpclient from '../../httpclient/http'
import Config from '../config/globalConfig.json'
import CosAuth from '../../cos/cos-auth'
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
    var nowMonthStr = String(nowMonth)
    console.log(nowDay)
    if (nowMonth < 10) {
      nowMonthStr = '0' + nowMonthStr
    }
    if (nowDay < 10) {
      
      nowDayStr = '0' + nowDayStr
    }
    return nowYear + '-' + nowMonthStr + '-' + nowDayStr
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

const getAgeSD = (strBirthday, strDate) =>{       
  var returnAge;
  var strBirthdayArr=strBirthday.split(" ")[0].split("-");
  var birthYear = strBirthdayArr[0];
  // console.log("year: " + birthYear)
  var birthMonth = strBirthdayArr[1];
  // console.log("month: " + birthMonth)
  var birthDay = strBirthdayArr[2];
  // console.log("day: " + birthDay)
  
  var strDateArr = strDate.split(" ")[0].split("-");
  var nowYear = strDateArr[0];
  // console.log("当前年：" + nowYear)
  var nowMonth = strDateArr[1];
  // console.log("当前月：" + nowMonth)
  var nowDay = strDateArr[2];
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

const getInitialDiagnosisMemo = (initial) => {
  let initialMemo
  switch (initial) {
    case 1:
      initialMemo = '初诊'
      break;
  
    default:
      initialMemo = '复诊'
      break;
  }

  return initialMemo
}

const getDiagnosisTypeMemo = (diagnosisType) => {
  let diagnosisTypeMemo
  switch (diagnosisType) {
    case 1:
      diagnosisTypeMemo = '疾病'
      break;
  
    default:
      diagnosisTypeMemo = '体检'
      break;
  }

  return diagnosisTypeMemo
}

const getWeekdayMemo = (weekday) => {
  let weekdayMemo
  switch (weekday) {
    case 1:
      weekdayMemo = '星期一'
      break;
    case 2:
      weekdayMemo = '星期二'
      break;
    case 3:
      weekdayMemo = '星期三'
      break;
    case 4:
      weekdayMemo = '星期四'
      break;
    case 5:
      weekdayMemo = '星期五'
      break;
    case 6:
      weekdayMemo = '星期六'
      break;
    case 0:
      weekdayMemo = '星期日'
      break;
    default:
      weekdayMemo = ''
      break;
  }

  return weekdayMemo
}

const uploadFile = (filePath, callback) => {
  let url
  let fileName = filePath.substr(filePath.lastIndexOf('/') + 1);
  let secretId
  let secretKey
  let sessionToken
  Httpclient.get(
    Config.request_host + '/cos/credential?fileName=' + fileName)
    .then(res => {
      console.log('请求密钥结束')
      console.log(res)
      if(res.Success) {
        secretId = res.Data.Credentials.TmpSecretId
        secretKey = res.Data.Credentials.TmpSecretKey
        sessionToken = res.Data.Credentials.Token

        let prefix = 'https://' + Config.Bucket + '.cos.' + Config.Region + '.myqcloud.com/'
        let staticPrefix = 'https://' + Config.Bucket + '.cos-website.' + Config.Region + '.myqcloud.com/'
        let AuthData = {
              XCosSecurityToken: sessionToken,
              Authorization: CosAuth({
                  SecretId: secretId,
                  SecretKey: secretKey,
                  Method: 'POST',
                  Pathname: '/',
              })
            }
        console.log(AuthData)
        let camSafeName = encodeURIComponent(fileName)
                          .replace(/!/g, '%21')
                          .replace(/'/g, '%27')
                          .replace(/\(/g, '%28')
                          .replace(/\)/g, '%29')
                          .replace(/\*/g, '%2A')
                          .replace(/%2F/g, '/');

        console.log('Key是' + camSafeName)
        console.log('filePath是' + filePath)
        console.log('Url是' + prefix)
        Taro.uploadFile({
          url: prefix,
          name: 'file',
          filePath: filePath,
          header: {
            'Content-Type': 'multipart/form-data'
          },  
          formData: {
            'key': camSafeName,
            'success_action_status': 200,
            'Signature': AuthData.Authorization,
            'x-cos-security-token': AuthData.XCosSecurityToken,
            'Content-Type': '',
            'method': 'POST'
          },
          success: (res) => {
            console.log(res)
            url = staticPrefix + camSafeName;
            if (res.statusCode === 200) {
              Taro.atMessage({
                message: '头像上传成功',
                type: 'success',
                duration: 3000
              })
            } else {
              Taro.atMessage({
                message: '头像上传失败',
                type: 'error',
                duration: 3000
              })
              return false
            }
            console.log('上传完毕')
            console.log(res.statusCode);
            console.log(url);
            callback(url)
          }
        })
      }
    })
}

export {getDefaultHeadImg, jsGetAge, getAgeSD, getGenderStr, getSpeciesMemo, getSterilizationMemo, 
  getInoculationMemo, getCurrentDate, getDewormingTypeMemo, getVaccineTypeMemo, getInitialDiagnosisMemo,
  getDiagnosisTypeMemo, getWeekdayMemo, uploadFile}