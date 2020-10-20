export enum GENDER {
  MALE = 1,
  FEMALE = 2,
}

export enum RECIPE_STATUS {
  CHECKING = 1,
  CHECKED,
  REJECTED,
  USED,
  INVALID,
}

export enum SERVICE_PANEL {
  TU_WEN_ZI_XUN = 1,
  YU_YIN_ZI_XUN,
  SHI_PIN_ZI_XUN,
}

export enum INQUIRY_ORDER_STATUS {
  WAITING_FOR_PAY = 1,
  WAITING_FOR_INQUIRY,//等待问诊
  IN_PROGRESS,//进行中
  FINISHED,
  QUITTED,
}

export enum IM_DESC_CUSTOM_TYPE {
  INQUIRY_FINISH = 'inquiryFinish',
  VIDEO_ROOM = 'videoRoom',
  RECIPE = 'recipe',
}
