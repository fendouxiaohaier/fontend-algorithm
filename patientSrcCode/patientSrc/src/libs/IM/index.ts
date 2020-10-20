import { IM_DESC_CUSTOM_TYPE } from '@/utils/enums';
import TIM from 'tim-js-sdk';
// 发送图片、文件等消息需要的 COS SDK
import COS from 'cos-js-sdk-v5';
import { getQiniuUploadToken, getHistoryIMMessage } from '@/api/common';
import { GetInquiryListeItem } from '@/api/patient/typing';
import * as qiniu from 'qiniu-js';
import { Toast } from 'antd-mobile';
import { reverse, get } from 'lodash';

interface ItextMsgContent {
  text: string;
}

interface IcustomMsgContent {
  data: string;
  description: string;
  extension: string;
  sound: string;
}

interface ImessageProps {
  fromAccount: string;
  isPlaceMsg: number;
  msgBody: {
    msgContent: IcustomMsgContent | ItextMsgContent;
    msgType: IM_DESC_CUSTOM_TYPE | string;
  }[];
  msgPriority: number;
  msgRandom: number;
  msgSeq: number;
  msgTimeStamp: number;
}

interface Imessage {
  id: number;
  isSelf?: boolean;
  msgSeq: number;
  subMsgType?: string;
  msgType: string | IM_DESC_CUSTOM_TYPE;
}

export interface ImProps {
  imAccount: string;
  userSig: string;
  groupId?: string;
  clinicNumber?: string;
  DoctorList?: GetInquiryListeItem[];
  handleMessage?: (msg: any) => void;
  getHistoryMessage?: (message: any, nextReqMessageID: number) => void;
  handleShowModal?: (clinicNumber: string) => void;
  getList?: (msg: any, DoctorList?: GetInquiryListeItem[]) => void;
}

// 消息数据处理
const createIm = (props: ImProps) => {
  // 创建 SDK 实例，TIM.create() 方法对于同一个 SDKAppID 只会返回同一份实例
  let tim = TIM.create({ SDKAppID: process.env.REACT_APP_IMSDKAPPID }); // SDK 实例通常用 tim 表示

  // 注册 COS SDK 插件
  tim.registerPlugin({ 'cos-js-sdk': COS });

  //登录
  tim.login({ userID: props.imAccount, userSig: props.userSig });

  const resolveMessageFc = ({
    id,
    isSelf,
    msgSeq,
    msgType,
    msgContent,
  }: {
    id: number;
    isSelf: boolean;
    msgSeq: number;
    msgType: string | IM_DESC_CUSTOM_TYPE;
    msgContent: string;
  }) => {
    const initMessage = {
      id, //map  key
      isSelf,
      msgSeq,
      content: '不支持的消息类型', //消息内容
      msgType: 'text', //消息的类型
    };
    switch (msgType) {
      case TIM.TYPES.MSG_TEXT:
        return { ...initMessage, content: get(msgContent, 'text') };
      case TIM.TYPES.MSG_CUSTOM:
        const content = JSON.parse(get(msgContent, 'description'));
        const messageType = get(msgContent, 'data');
        if (messageType === IM_DESC_CUSTOM_TYPE.VIDEO_ROOM) {
          return { ...initMessage, content, subMsgType: get(content, 'type'), msgType: messageType };
        } else if (messageType === IM_DESC_CUSTOM_TYPE.INQUIRY_FINISH) {
          return { ...initMessage, content: '问诊已经结束', msgType: messageType };
        }
        return { ...initMessage, content, msgType: messageType };
      default:
        return initMessage;
    }
  };

  //解析接收或者发送的消息
  const resolveMessage = (message: any) => {
    const id = get(message, 'ID'); //map key
    const isSelf = get(message, 'flow') === 'out'; //接收或者发送消息
    const msgSeq = get(message, 'sequence');
    const msgType = get(message, ['elements', 0, 'type']);
    const msgContent = get(message, ['elements', 0, 'content']);
    return resolveMessageFc({ id, isSelf, msgSeq, msgType, msgContent });
  };

  //解析历史消息
  const parseIMHistoryMessage: <T extends ImessageProps>(messageList: T[], imAccount: string) => Imessage[] = <T>(
    messageList: T[],
    imAccount: string
  ): Imessage[] => {
    const message = messageList.map((item: T) => {
      const id = get(item, 'msgRandom'); //map key
      const isSelf = get(item, 'fromAccount') === imAccount; //接收或者发送
      const msgSeq = get(item, 'msgSeq'); //消息序号
      const msgType = get(item, ['msgBody', 0, 'msgType']); //消息类型
      const msgContent = get(item, ['msgBody', 0, 'msgContent']); //消息内容
      return resolveMessageFc({ id, isSelf, msgSeq, msgType, msgContent });
    });

    return reverse(message);
  };

  // 2. 发送消息
  const sendMessage = function(type: string, value: any) {
    switch (type) {
      case 'text':
        const message = tim.createTextMessage({
          to: props.groupId,
          conversationType: TIM.TYPES.CONV_GROUP,
          payload: {
            text: value,
          },
        });
        const promise = tim.sendMessage(message);
        promise
          .then((result: any) => {
            const parsedMsg = resolveMessage(result.data.message);
            props.handleMessage && props.handleMessage(parsedMsg);
          })
          .catch((error: string) => {
            console.warn('sendMessage error:', error);
          });
        break;
      case 'image':
        const imageUpLoad = async () => {
          try {
            Toast.loading('上传中...', 0);
            const { token, domain } = ((await getQiniuUploadToken()) as unknown) as { token: string; domain: string };
            const observable = qiniu.upload(value, props.imAccount + new Date().getTime().toString(), token, {}, {});
            observable.subscribe({
              next(response) {
                // ...
              },
              error(err) {
                Toast.info('上传失败,请重试');
              },
              complete(res: any) {
                Toast.loading('发送中...', 0);
                const message = tim.createCustomMessage({
                  to: props.groupId,
                  conversationType: TIM.TYPES.CONV_GROUP,
                  payload: {
                    data: 'image', // 用于标识该消息类型消息
                    description: JSON.stringify({
                      url: domain + res.key, // 获取图片url
                      width: res.w,
                      height: res.h,
                    }),
                    extension: '',
                  },
                });
                const promise = tim.sendMessage(message);
                promise
                  .then((result: any) => {
                    Toast.hide();
                    props.handleMessage && props.handleMessage(resolveMessage(result.data.message));
                  })
                  .catch((error: string) => {
                    Toast.info('发送失败,请重试');
                  });
              },
            });
          } catch (error) {
            console.log(error);
          }
        };
        imageUpLoad();
        break;
      default:
        break;
    }
  };

  const setMessageRead = (groupId: string, callback?: any) => {
    try {
      // 将某会话下所有未读消息已读上报
      tim
        .setMessageRead({ conversationID: `GROUP${groupId}` })
        .then(function(imResponse: any) {
          const { code } = imResponse;
          if (callback) {
            callback();
          }
        })
        .catch(function(imError: any) {
          window.console.warn('已读上报 error:', imError);
          if (callback) {
            callback();
          }
        });
    } catch (error) {}
  };

  //3.接收消息
  let onMessageReceived = function(event: any) {
    // event.data - 存储 Message 对象的数组 - [Message]
    for (const value of event.data) {
      if (value.elements[0].type !== TIM.TYPES.MSG_GRP_SYS_NOTICE) {
        //屏蔽群系统通知消息
        if (Object.is(get(value, 'to'), props.groupId)) {
          //二期随诊功能要改
          props.handleMessage && props.handleMessage(resolveMessage(value));
          // 收到结束的消息后弹窗去评价满意度
          const msgContent = get(value, ['elements', 0, 'content']);
          if (msgContent) {
            const messageType = get(msgContent, 'data');
            if (messageType === IM_DESC_CUSTOM_TYPE.INQUIRY_FINISH && props.clinicNumber) {
              props.handleShowModal && props.handleShowModal(props.clinicNumber);
            }
          }
          if (props.groupId) {
            setMessageRead(props.groupId);
          }
        }
      }
    }
  };

  //获取历史消息列表
  const fetchHistoryIMMessage = async (nextReqId?: number) => {
    if (props.groupId) {
      try {
        const {
          data: { messageList, nextReqMessageID },
        } = await getHistoryIMMessage(props.groupId, nextReqId);
        props.getHistoryMessage &&
          props.getHistoryMessage(parseIMHistoryMessage(messageList, props.imAccount), nextReqMessageID);
      } catch (error) {
        console.log(error);
      }
    }
  };
  if (props.groupId) {
    fetchHistoryIMMessage();
  }

  //会话列表更新
  const onConversationListUpdated = (event: any) => {
    // 包含 Conversation 实例的数组
    const { data } = event;
    if (data && props.getList) {
      props.getList(data, props.DoctorList);
    }
  };

  const timeOn = () => {
    if (props.groupId) {
      tim.on(TIM.EVENT.MESSAGE_RECEIVED, onMessageReceived);
    }

    if (props.getList) {
      // 会话列表更新
      tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, onConversationListUpdated);
    }
  };

  const timeOff = () => {
    if (props.groupId) {
      tim.off(TIM.EVENT.MESSAGE_RECEIVED, onMessageReceived);
    }

    if (props.getList) {
      // 会话列表更新
      tim.off(TIM.EVENT.CONVERSATION_LIST_UPDATED, onConversationListUpdated);
    }
  };

  timeOn();

  const logout = (callback?: any) => {
    timeOff();
    try {
      tim
        .logout()
        .then(function() {
          if (callback) {
            tim = null;
            callback();
          }
        })
        .catch(function(imError: any) {
          window.console.warn('logout error:', imError);
        });
    } catch (error) {
      window.console.warn('logout error:' + error);
    }
  };
  return { sendMessage, fetchHistoryIMMessage, logout, setMessageRead };
};

export default createIm;
