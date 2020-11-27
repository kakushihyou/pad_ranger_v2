import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton, AtIcon, AtFloatLayout } from 'taro-ui'
import Taro from '@tarojs/taro'
import {getInitialDiagnosisMemo, getDiagnosisTypeMemo} from '../../util/tool'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './diaryItem.scss'

export default class PetCaseDetail extends Component {

  constructor(props) {
    super(props)

  }

  render () {

    // id bigint NOT NULL DEFAULT nextval('"t_user_diary_Id_seq"'::regclass),
    // user_id bigint NOT NULL,
    // title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    // diary_time timestamp without time zone NOT NULL,
    // weather character varying(255) COLLATE pg_catalog."default",
    // mood smallint,
    // content character varying(255) COLLATE pg_catalog."default",
    // status smallint DEFAULT 1,
    // insert_by character varying(50) COLLATE pg_catalog."default" NOT NULL,
    // update_by character varying(50) COLLATE pg_catalog."default",
    // insert_time timestamp without time zone NOT NULL,
    // update_time timestamp without time zone,
    // memo character varying(255) COLLATE pg_catalog."default",
    // images character varying COLLATE pg_catalog."default",
    let diaryDetail = this.props.info
    return (
      
      <View className='tips'>
        <View>{diaryDetail.diaryTime}</View>
        <View className='icons'>
          <View>{diaryDetail.weather}</View>
          <View>{diaryDetaiil.moodIcon}</View>  {/* 心情分数，满分100，越大表示心情越好 */}
        </View>
        <View className='content'>{diaryDetail.content}</View>
      </View>
    )
  }
}