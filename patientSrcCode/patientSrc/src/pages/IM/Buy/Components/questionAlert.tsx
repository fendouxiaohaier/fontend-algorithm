import React from 'react';
import styles from './index.module.scss';

interface Props {
  Price?: number;
  num?: number;
  goNext: () => void;
}

export default function Alert(props: Props) {
  const { Price, num, goNext } = props;
  return (
    <div>
      <div className={styles.titleBox}>
        <div className={styles.flex}>
          <div>
            <p className={styles.title}>当前剩余对话回合数为0</p>
            <p className={styles.content}>
              <span>￥ {Price && Price / 100}</span>/{num}回合 请您先购买追问包
            </p>
          </div>
        </div>
        <button onClick={goNext}>立即购买</button>
        <div className={styles.end}>
          <p>每个追问包有效期为一周;</p>
          <p>医生根据您提供的病情资料，给出针对性回复。</p>
        </div>
      </div>
      <div className={styles.tip}>
        <p>温馨提示</p>
        <p>1.医生可能在门诊或手术中，如无法及时回复请见谅；</p>
        <p>2.若病情危急，请直接前往医院就诊；</p>
      </div>
    </div>
  );
}
