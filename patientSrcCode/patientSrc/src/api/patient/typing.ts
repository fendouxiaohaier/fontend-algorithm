export interface GetMyDoctorItem {
  // 医生id
  id: number;
  // 医生姓名
  name: string;
  // 头像
  avatar: string;
  // 科室名称
  sectionName: string;
  // 医生职称id
  titleId: number;
  // 医院名
  hospitalName: string;
  // 职称文本
  titleName: string;
  // 最近一次聊天时间
  lastChatTime: number;
  // 医生的im账号，发单聊消息时使用
  doctorImAccount: string;
  statusText: string;
  professionalTechnicalJobTypeText: string;
}

export interface GetSurplusParams {
  // 接收消息的医生id
  doctorId: number;
  // 是否发送消息 默认0-不发送 1-发送
  isSendMsg: number;
  // 发送处方时要处方id
  prescriptionIds?: number;
  // 发送处方时要处方图片
  prImg?: string;
}

export interface GetSurplusData {
  // 剩余回合数 -99为无限
  surplusBout: number;
  // 随诊包回合数 surplusBout为0时才有此值
  followBoutNum?: number;
  // 随诊包价格 单位分 surplusBout为0时才有此值
  followPackagePrice?: number;
}

// 单聊历史入参
export interface GetHistorySIMMParams {
  // 医生id
  doctorId: number;
  // 分页参数
  reqMsgSeq?: number;
  // 每次拉取的消息条数 默认10 最大100
  limit?: number;
}

export interface MsgContent {
  text?: string;
  data?: string;
  sound?: string;
  description?: string;
  extension?: string;
}

export interface MsgBody {
  msgContent: MsgContent;
  msgType: string;
}

export interface MessageItem {
  // 发送用户
  fromAccount: string;
  convertId: string;
  // 接收用户
  toAccount: string;
  // 操作用户
  operatorAccount: string;
  msgBody: MsgBody;
  msgRandom: number;
  msgSeq: number;
  msgTimeStamp: number;
}

export interface GetHistorySIMMData {
  messageList: MessageItem[];
  // 下一次拉取时的reqMsgSeq值
  nextReqMessageID?: number;
  // 是否拉取完成 0-否 1-是
  isCompleted?: number;
}

export interface PresListItem {
  createdAt: number;
  id: number;
  tranNo: string;
  doctorName: string;
  doctorAvatar: string;
  status: number;
  statusText: string;
  medication: MedicationItem[];
  prescription: string;
  checked: boolean;
}

export interface MedicationItem {
  name: string;
  specification: string;
  quantity: number;
  prescriptionId: number;
}

export interface GetInquiryListeItem {
  // 医生名
  doctorName: string;
  // 科室名
  sectionName: string;
  // 医生头像
  doctorFacePicUrl: string;
  // 医院名
  hospitalName: string;
  orderTypeText: string;
  statusText: string;
  appointmentText: string;
  // 职称名
  titleName: string;
  // 最近聊天时间
  chatTime: number;
  inquiryId: number;
  doctorId: number;
  groupId: string;
}
