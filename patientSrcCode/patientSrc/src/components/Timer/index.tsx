import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import { getSMSCode } from '@/api/common';
import { Toast } from 'antd-mobile';
interface Itimer {
  phone: string;
}

const TIMER = 60;

let TIMERID: NodeJS.Timeout;

export function Timer(props: Itimer) {
  const { phone } = props;
  const [timerOn, setTimerOn] = useState(false);
  const [count, setCount] = useState(TIMER);
  const [text, setText] = useState('获取验证码');
  const getCode = async () => {
    if (timerOn) return;

    if (!phone) {
      Toast.info('请输入手机号');
      return false;
    } else if (!/^1\d{10}$/.test(phone)) {
      Toast.info('请输入正确的手机号');
      return false;
    }
    try {
      await getSMSCode({ phone });
    } catch (error) {
      Toast.info(error.message);
    }

    if (!timerOn) setTimerOn(true);

    TIMERID = setInterval(() => {
      setCount((count) => {
        if (!count) {
          clearInterval(TIMERID);
          setTimerOn(false);
          return TIMER;
        }
        return --count;
      });
    }, 1000);
  };

  useEffect(() => {
    setText(timerOn ? `${count}S` : '获取验证码');
  });

  return (
    <span className={styles.getCode} onClick={() => getCode()}>
      {text}
    </span>
  );
}
