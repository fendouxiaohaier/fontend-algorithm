import React from 'react';
import { If, Then, Else } from 'react-if';
import TuWen from '@/assets/common/tuwenwenzhen@3x.png';
import TuWenDisable from '@/assets/common/tuwenwenzhen-zhihui@3x.png';
import ShiPin from '@/assets/common/shipinwenzhen@3x.png';
import ShiPinDisable from '@/assets/common/shipinzixun-zhihui@3x.png';
import YuYin from '@/assets/common/yuyinwenzhen@3x.png';
import YuYinDisable from '@/assets/common/dianhuazixun-zhihui@3x.png';
import styles from './index.module.scss';
import classnames from 'classnames/bind';
import { IdoctorResponseProps } from '@/types/api/doctorManage';
import { SERVICE_PANEL } from '@/utils/enums';
import { get } from 'lodash';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { getPrice } from '@/utils';
interface IservicePanel extends RouteComponentProps {
  doctor?: IdoctorResponseProps;
}

const cx = classnames.bind(styles);

function ServicePanel(props: IservicePanel) {
  const { doctor, history } = props;
  const purpleCls = cx({
    serviceBlock: true,
    purple: !!get(doctor, 'imgSwitch'),
  });

  const greenCls = cx({
    serviceBlock: true,
    green: !!get(doctor, 'audioSwitch'),
  });

  const orangeCls = cx({
    serviceBlock: true,
    orange: !!get(doctor, 'videoSwitch'),
  });

  const handleServiceClick = (type: number, enable: boolean) => {

    if (enable) {
      history.push(`/inquiry-order/${get(doctor, 'id')}?type=${type}`);
    }

  };

  return (
    <>
      <div className={purpleCls} onClick={() => handleServiceClick(SERVICE_PANEL.TU_WEN_ZI_XUN, !!get(doctor, 'imgSwitch'))}>
        <If condition={!!get(doctor, 'imgSwitch')}>
          <Then>
            <img className={styles.serviceIcon} src={TuWen} alt="" />
          </Then>
          <Else>
            <img className={styles.serviceIcon} src={TuWenDisable} alt="" />
          </Else>
        </If>
        <span className={styles.serviceTitle}>图文咨询</span>
        <span className={styles.servicePrice}> {getPrice(get(doctor, 'imgPrice'))}元/次 </span>
      </div>
      <div className={greenCls} onClick={() => handleServiceClick(SERVICE_PANEL.YU_YIN_ZI_XUN, !!get(doctor, 'audioSwitch'))}>
        <If condition={!!get(doctor, 'audioSwitch')}>
          <Then>
            <img className={styles.serviceIcon} src={YuYin} alt="" />
          </Then>
          <Else>
            <img className={styles.serviceIcon} src={YuYinDisable} alt="" />
          </Else>
        </If>
        <span className={styles.serviceTitle}>语音咨询</span>
        <span className={styles.servicePrice}> {getPrice(get(doctor, 'audioPrice'))}元/次 </span>
      </div>
      <div className={orangeCls} onClick={() => handleServiceClick(SERVICE_PANEL.SHI_PIN_ZI_XUN, !!get(doctor, 'videoSwitch'))}>
        <If condition={!!get(doctor, 'videoSwitch')}>
          <Then>
            <img className={styles.serviceIcon} src={ShiPin} alt="" />
          </Then>
          <Else>
            <img className={styles.serviceIcon} src={ShiPinDisable} alt="" />
          </Else>
        </If>
        <span className={styles.serviceTitle}>视频咨询</span>
        <span className={styles.servicePrice}> {getPrice(get(doctor, 'videoPrice'))}元/次 </span>
      </div>
    </>
  );
}

export default withRouter(ServicePanel);
