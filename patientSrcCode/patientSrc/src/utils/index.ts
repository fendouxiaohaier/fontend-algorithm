import { GENDER, IM_DESC_CUSTOM_TYPE } from './enums';
import moment from 'moment';
import reverse from 'lodash/reverse';

/**
 * 获取 utl 中指定 query 参数的值
 * 读取聊天历史消息
 * @param {string} name 参数名
 * @returns {string | null} 参数名对应的值或 null
 */
// TODO: 考虑是否可以用 URL.searchParams 替换此函数
export const getUrlParam = (name: string) => {
  // let str = window.location.href.split('#');
  // let strParam = '';
  // const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`); // 构造一个含有目标参数的正则表达式对象

  // if (str[0] && str[0].indexOf('?') !== -1) {
  //   strParam = str[0].split('?')[1];
  // }

  // if (str[1] && str[1].indexOf('?') !== -1) {
  //   strParam = str[1].split('?')[1];
  // }

  // const r = strParam.match(reg); // 匹配目标参数

  // if (r !== null) {
  //   return unescape(r[2]); // 返回参数值
  // } else {
  //   return '';
  // }
  let params = new URLSearchParams(window.location.hash.split('?')[1]);
  let value = params.get(name);
  if (value) {
    if (name === 'code') {
      return unescape(value);
    } else {
      return value;
    }
  }
  return '';
};

export const generateTitle = (title: string) => {
  let isIPhone = window.navigator.appVersion.match(/iphone|ipad|ipod/gi);
  // ios 需要hack才能修改title
  if (isIPhone) {
    document.title = title;
    let iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.setAttribute('src', 'about:blank');
    let d = () => {
      setTimeout(() => {
        iframe.removeEventListener('load', d);
        document.body.removeChild(iframe);
      }, 0);
    };
    iframe.addEventListener('load', d);
    document.body.appendChild(iframe);
  } else {
    document.title = title;
  }
};

export const resetPagePosition = () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
};

export function calculateAge(birthDate: Date, otherDate: Date) {
  // birthDate = new Date(birthDate);
  // otherDate = new Date(otherDate);

  var years = otherDate.getFullYear() - birthDate.getFullYear();

  if (
    otherDate.getMonth() < birthDate.getMonth() ||
    (otherDate.getMonth() === birthDate.getMonth() && otherDate.getDate() < birthDate.getDate())
  ) {
    years--;
  }

  return years;
}

export function stringEncryptWithSnow(str: string) {
  const leftStr = 4;
  const length = str.length;
  if (length > 8) {
    return str.slice(0, leftStr) + '*'.repeat(length - leftStr * 2) + str.slice(length - leftStr);
  }
  return str;
}

export function genderTransformer(gender: number) {
  switch (gender) {
    case GENDER.MALE:
      return '男';
    case GENDER.FEMALE:
      return '女';
    default:
      return '保密';
  }
}

export const title = {
  section: '全部科室',
  title: '全部职称',
  inquiryType: '全部类型',
};

export function encryptObj(obj: any) {
  return btoa(JSON.stringify(obj));
}

export function decryptObj(encObj: any) {
  return JSON.parse(atob(encObj));
}

export const appointmentTransformer = (appointArray: any[]) => {
  // const appointmentRange = [
  //   { label: "上午", value: 0 },
  //   { label: "下午", value: 1 }
  // ];
  return appointArray.map((appoint: any) => {
    return {
      label: `${appoint.dateText} ${appoint.timeText}`,
      value: appoint.stamp,
    };
  });
};

export const dayToChineseTransformer = (timeStamp: number | undefined | string): string => {
  timeStamp = Number(timeStamp);
  if (!timeStamp || timeStamp.toString().length !== (13 && 10)) {
    return '';
  }
  let day: number;
  if (timeStamp.toString().length === 13) {
    day = moment(timeStamp).day();
  } else {
    day = moment.unix(timeStamp).day();
  }
  const chineseDayTextHash = ['日', '一', '二', '三', '四', '五', '六'];
  return chineseDayTextHash[day];
};

export const timeConversion = (timeStamp: number | undefined | string, format: string = 'YYYY-MM-DD HH:mm'): string => {
  timeStamp = Number(timeStamp);
  if (!timeStamp) {
    return '';
  }
  let time: string;
  if (timeStamp.toString().length === 13) {
    time = moment(timeStamp).format(format);
  } else {
    time = moment.unix(timeStamp).format(format);
  }
  return time;
};

export const getPrice = (price: number | undefined | string) => {
  price = Number(price);
  if (price === 0) {
    return 0;
  }
  if (Object.is(price, NaN)) {
    return '';
  } else {
    return price / 100;
  }
};

export function parseIMHistoryMessage(msg: any, userId: number) {
  return reverse(
    msg.map((msgData: any) => {
      const msgType = msgData.msgBody[0].msgType;
      switch (msgType) {
        case 'TIMTextElem':
          return {
            id: msgData.msgRandom,
            isSelf: msgData.fromAccount === userId.toString(),
            content: msgData.msgBody[0].msgContent.text,
            msgSeq: msgData.msgSeq,
            msgType: 'text',
          };
        case 'TIMCustomElem':
          if (msgData.msgBody[0].msgContent.data === 'image') {
            return {
              id: msgData.msgRandom,
              isSelf: msgData.fromAccount === userId.toString(),
              content: JSON.parse(msgData.msgBody[0].msgContent.description),
              msgSeq: msgData.msgSeq,
              msgType: 'image',
            };
          } else if (msgData.msgBody[0].msgContent.data === IM_DESC_CUSTOM_TYPE.INQUIRY_FINISH) {
            return {
              id: null,
              msgSeq: msgData.msgSeq,
            };
          } else if (msgData.msgBody[0].msgContent.data === IM_DESC_CUSTOM_TYPE.VIDEO_ROOM) {
            return {
              id: msgData.msgRandom, // map key
              isSelf: msgData.fromAccount === userId.toString(), // 是否本人发送的消息
              content: JSON.parse(msgData.msgBody[0].msgContent.description).qrcodeUrl,
              msgSeq: msgData.msgSeq, //
              msgType: IM_DESC_CUSTOM_TYPE.VIDEO_ROOM,
              subMsgType: JSON.parse(msgData.msgBody[0].msgContent.description).type,
            };
          } else if (msgData.msgBody[0].msgContent.data === IM_DESC_CUSTOM_TYPE.RECIPE) {
            return {
              id: msgData.msgRandom,
              isSelf: msgData.fromAccount === userId.toString(),
              content: JSON.parse(msgData.msgBody[0].msgContent.description),
              msgSeq: msgData.msgSeq,
              msgType: IM_DESC_CUSTOM_TYPE.RECIPE,
            };
          }
        default:
          return {
            id: msgData.msgRandom,
            isSelf: msgData.fromAccount === userId.toString(),
            content: '不支持的消息类型',
            msgSeq: msgData.msgSeq,
            msgType: 'text',
          };
      }
    })
  );
}
