import React from 'react';
import Page from '@/components/Page';
import styles from './index.module.scss';
import { getUrlParam } from '@/utils';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { get } from 'lodash';

function Packet(props: RouteComponentProps) {
  const {
    match: { params },
  } = props;
  const Price = parseInt(getUrlParam('Price'));
  const num = getUrlParam('num');
  const handlePayment = () => {
    window.location.href = `${process.env.REACT_APP_PAYURL}#/orderPayment?type=follow&doctorId=${get(
      params,
      'doctorId'
    )}&goBack=2`;
  };

  return (
    <Page title="追问包详情" loading={false}>
      <div className={styles.content}>
        <p className={styles.title}>
          <span>当前剩余聊天回合数</span>
          <span>0 回合</span>
        </p>
        <div className={styles.tip}>
          <p>温馨提示</p>
          <p>
            1.每个追问包有效期为<span>一周</span>；
          </p>
          <p>2.医生可能在门诊或手术中，如无法及时回复请见谅；</p>
          <p>3.若病情危急，请直接前往医院就诊；</p>
          <p>
            4.如有疑问请致电客服电话: <a href="tel:4008157100">400-815-7100</a>;
          </p>
        </div>
        <button className={styles.payBtn} onClick={handlePayment}>
          购买{num}回合追问包 ￥{Price && Price / 100}
        </button>
      </div>
    </Page>
  );
}

export default withRouter(Packet);
