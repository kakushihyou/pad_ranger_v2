export default {
  pages: [
    'pages/index/index',
    'pages/petDetail/petDetail',
    'pages/petUpdate/petUpdate',
    'pages/petAdd/petAdd',
    'pages/medicalTreatment/medicalTreatment',
    'pages/situationDetail/situationDetail',
    'pages/dewormingUpdate/dewormingUpdate',
    'pages/dewormingAdd/dewormingAdd',
    'pages/inoculationAdd/inoculationAdd',
    'pages/inoculationUpdate/inoculationUpdate',
    'pages/diary/diary',
    'pages/mine/mine'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    list: [
      {
        pagePath: 'pages/index/index',
        iconPath: 'assets/icon/cat_pad.png',
        selectedIconPath: 'assets/icon/cat_pad.png',
        text: '主子'
      },
      {
        pagePath: 'pages/medicalTreatment/medicalTreatment',
        iconPath: 'assets/icon/pet_case.png',
        selectedIconPath: 'assets/icon/pet_case.png',
        text: '病例'
      },
      {
        pagePath: 'pages/diary/diary',
        iconPath: 'assets/icon/pet_diary.png',
        selectedIconPath: 'assets/icon/pet_diary.png',
        text: '日记'
      },
      {
        pagePath: 'pages/mine/mine',
        iconPath: 'assets/icon/mine.png',
        selectedIconPath: 'assets/icon/mine.png',
        text: '铲屎官'
      }
    ],
    color: '#bbc0ca',
    selectedColor: '1f83e1',
    backgroundColor: '#feffff',
    borderStyle: 'white',
    position: 'bottom'
  }
}
