export default {
  pages: [
    'pages/index/index',
    'pages/medicalTreatment/medicalTreatment',
    'pages/diary/diary',
    'pages/mine/mine',
    'pages/wxLogin/wxLogin'
  ],
  subpackages: [
    {
      root: "case",
      pages: [
        'pages/situationDetail/situationDetail',
        'pages/dewormingUpdate/dewormingUpdate',
        'pages/dewormingAdd/dewormingAdd',
        'pages/inoculationAdd/inoculationAdd',
        'pages/inoculationUpdate/inoculationUpdate',
        'pages/caseUpdate/caseUpdate',
        'pages/caseAdd/caseAdd'
      ]
    },
    {
      root: "diary",
      pages: [
        'pages/diaryDetail/diaryDetail',
        'pages/diaryUpdate/diaryUpdate',
        'pages/diaryAdd/diaryAdd'
      ]
    },
    {
      root: "pet",
      pages: [
        'pages/petDetail/petDetail',
        'pages/petUpdate/petUpdate',
        'pages/petAdd/petAdd'
      ]
    }
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
        text: '病历'
      },
      {
        pagePath: 'pages/diary/diary',
        iconPath: 'assets/icon/pet_diary.png',
        selectedIconPath: 'assets/icon/pet_diary.png',
        text: '屎记'
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
    backgroundColor: '#f7f7f7',
    borderStyle: 'black',
    position: 'bottom'
  },
  debug: true
}
