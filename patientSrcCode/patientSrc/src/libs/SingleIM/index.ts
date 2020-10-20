import { IM_DESC_CUSTOM_TYPE } from '@/utils/enums';
import TIM from 'tim-js-sdk';
// 发送图片、文件等消息需要的 COS SDK
import COS from 'cos-js-sdk-v5';
import { getQiniuUploadToken } from '@/api/common';
import * as qiniu from 'qiniu-js';
import { Toast } from 'antd-mobile';

export interface ImProps {
  imAccount: string;
  userSig: string;
  doctorImAccount?: string;
  onReceiveMessage?: (msg: any) => void;
  getList?: (msg: any) => void;
  fetchSurplus?: (value: number) => void;
}

// 推送消息数据处理
const createIm = (props: ImProps) => {
  const loginCase = {
    imAccount: props.imAccount,
    userSig: props.userSig,
    doctorImAccount: props.doctorImAccount,
    onReceiveMessage: props.onReceiveMessage,
    getList: props.getList,
    loginStatus: false,
    fetchSurplus: props.fetchSurplus,
  };
  const options = {
    SDKAppID: process.env.REACT_APP_IMSDKAPPID, // 接入时需要将0替换为您的即时通信应用的 SDKAppID
  };
  // 创建 SDK 实例，TIM.create() 方法对于同一个 SDKAppID 只会返回同一份实例
  let tim = TIM.create(options); // SDK 实例通常用 tim 表示

  // 注册 COS SDK 插件
  tim.registerPlugin({ 'cos-js-sdk': COS });

  const parseMsg = (msg: any) => {
    let preMsg = {
      content: {}, //消息内容
      id: msg.ID, //消息id作为索引值
      isSelf: msg.flow === 'out' ? 1 : 0, //是发送的消息还是接收的消息
      msgSeq: msg.sequence,
      msgType: '', //消息的类型
      subMsgType: (msg: any) => {},
    };

    const type = msg.elements[0].type;
    const content = msg.elements[0].content;

    switch (type) {
      case TIM.TYPES.MSG_TEXT:
        preMsg.msgType = 'text';
        preMsg.content = content.text;
        break;
      case TIM.TYPES.MSG_CUSTOM:
        if (content.data === 'image') {
          preMsg.msgType = 'image';
          preMsg.content = JSON.parse(content.description);
        }
        if (content.data === IM_DESC_CUSTOM_TYPE.INQUIRY_FINISH) {
          preMsg.msgType = IM_DESC_CUSTOM_TYPE.INQUIRY_FINISH;
          preMsg.content = IM_DESC_CUSTOM_TYPE.INQUIRY_FINISH;
        } else if (content.data === IM_DESC_CUSTOM_TYPE.VIDEO_ROOM) {
          preMsg.msgType = IM_DESC_CUSTOM_TYPE.VIDEO_ROOM;
          preMsg.subMsgType = JSON.parse(content.description).type;
          preMsg.content = JSON.parse(content.description).qrcodeUrl;
        } else if (content.data === IM_DESC_CUSTOM_TYPE.RECIPE) {
          preMsg.msgType = IM_DESC_CUSTOM_TYPE.RECIPE;
          preMsg.content = JSON.parse(content.description);
        }
        break;
      default:
        //webim.Log.error('未知消息元素类型: elemType=' + type);
        console.log('未知消息元素类型' + type);
        break;
    }
    return preMsg;
  };

  // 2. 发送消息
  const sendMessage = function(
    type: string,
    value: any,
    resolve: (result: any) => void,
    reject: (result: any) => void
  ) {
    console.log('sendMessage', value);
    switch (type) {
      case 'text':
        const message = tim.createTextMessage({
          to: loginCase.doctorImAccount,
          conversationType: TIM.TYPES.CONV_C2C,
          payload: {
            text: value,
          },
        });
        const promise = tim.sendMessage(message);
        promise
          .then((result: any) => {
            const {
              code,
              data: { message },
            } = result;
            if (code === 0 && loginCase.onReceiveMessage) {
              const parsedMsg = parseMsg(message);
              loginCase.onReceiveMessage(parsedMsg);
            }
            resolve(result);
          })
          .catch((error: string) => {
            console.warn('sendMessage error:', error);
            reject(error);
          });
        break;
      case 'image':
        const imageUpLoad = async () => {
          try {
            Toast.loading('上传中...', 0);
            const { token, domain } = ((await getQiniuUploadToken()) as unknown) as { token: string; domain: string };
            const observable = qiniu.upload(
              value,
              loginCase.imAccount + new Date().getTime().toString(),
              token,
              {},
              {}
            );
            observable.subscribe({
              next(response) {
                // console.log('234234234234',response);
                // ...
              },
              error(err) {
                console.log('七牛云生成图片方法报错', err);
              },
              complete(res: any) {
                Toast.loading('发送中...', 0);
                const message = tim.createCustomMessage({
                  to: loginCase.doctorImAccount,
                  conversationType: TIM.TYPES.CONV_C2C,
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
                    const {
                      code,
                      data: { message },
                    } = result;
                    if (code === 0 && loginCase.onReceiveMessage) {
                      const parsedMsg = parseMsg(message);
                      loginCase.onReceiveMessage(parsedMsg);
                    }
                    resolve(result);
                  })
                  .catch((error: string) => {
                    Toast.hide();
                    console.warn('sendMessage error:', error);
                    reject(error);
                  });
              },
            });
          } catch (error) {
            Toast.info('上传失败,请先拍照后再上传');
          }
        };
        imageUpLoad();
        break;
      case IM_DESC_CUSTOM_TYPE.RECIPE:
        const description = JSON.stringify(value);
        const RECIPE = tim.createCustomMessage({
          to: loginCase.doctorImAccount,
          conversationType: TIM.TYPES.CONV_C2C,
          payload: {
            data: IM_DESC_CUSTOM_TYPE.RECIPE,
            description,
            extension: '',
          },
        });
        const promiseR = tim.sendMessage(RECIPE);
        promiseR
          .then((result: any) => {
            const {
              code,
              data: { message },
            } = result;
            if (code === 0 && loginCase.onReceiveMessage) {
              const parsedMsg = parseMsg(message);
              loginCase.onReceiveMessage(parsedMsg);
            }
            resolve(result);
          })
          .catch((error: string) => {
            console.warn('sendMessage error:', error);
            reject(error);
          });
        break;
      default:
        break;
    }
  };

  //接收消息
  const messageReceived = (props: any) => {
    if (loginCase.onReceiveMessage) {
      loginCase.onReceiveMessage(parseMsg(props));
    }
  };

  // 必须在点击列表的时候发送
  const setMessageRead = (doctorImAccount: string, callback?: any) => {
    if (doctorImAccount) {
      try {
        // 将某会话下所有未读消息已读上报
        tim
          .setMessageRead({ conversationID: `C2C${doctorImAccount}` })
          .then(function(imResponse: any) {
            const { code } = imResponse;
            if (code === 0) {
              window.console.warn('已读上报' + `C2C${doctorImAccount}`);
            }
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
    }
  };

  // 接收消息
  const onMessageReceived = function(event: any) {
    // event.data - 存储 Message 对象的数组 - [Message]
    for (const value of event.data) {
      // 单聊，医生发送，患者接收
      if (
        Object.is(value.conversationType, TIM.TYPES.CONV_C2C) &&
        Object.is(value.to, loginCase.imAccount) &&
        Object.is(value.from, loginCase.doctorImAccount)
      ) {
        messageReceived(value);
        // 设置当前消息已读
        if (loginCase.doctorImAccount) {
          setMessageRead(loginCase.doctorImAccount);
        }
        // 收到消息后获取剩余回合数
        if (loginCase.fetchSurplus) {
          loginCase.fetchSurplus(0);
        }
      }
    }
  };

  //会话列表更新
  const onConversationListUpdated = (event: any) => {
    // 包含 Conversation 实例的数组
    const { data } = event;
    if (data && loginCase.getList) {
      loginCase.getList(data);
    }
  };

  const onError = (even: any) => {
    window.console.warn(even.data);
  };

  const timOn = () => {
    if (loginCase.onReceiveMessage) {
      tim.on(TIM.EVENT.MESSAGE_RECEIVED, onMessageReceived);
    }

    if (loginCase.getList) {
      // 会话列表更新
      tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, onConversationListUpdated);
    }

    tim.on(TIM.EVENT.ERROR, onError);
    loginCase.loginStatus = true;
  };

  const timOff = () => {
    tim.off(TIM.EVENT.MESSAGE_RECEIVED, onMessageReceived);

    // 会话列表更新
    tim.off(TIM.EVENT.CONVERSATION_LIST_UPDATED, onConversationListUpdated);

    tim.off(TIM.EVENT.ERROR, onError);
    loginCase.loginStatus = true;
  };

  //登录
  tim
    .login({ userID: loginCase.imAccount, userSig: loginCase.userSig })
    .then(function(data: any) {
      const { code } = data;
      if (code === 0) {
        timOn();
      }
    })
    .catch(function(imError: any) {
      window.console.warn('login error:', imError);
    });

  const logout = (callback?: any) => {
    if (loginCase.loginStatus) {
      timOff();
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
    } else {
      if (callback) {
        callback();
      }
    }
  };

  return {
    loginCase,
    sendMessage,
    logout,
    setMessageRead,
  };
};

export default createIm;
