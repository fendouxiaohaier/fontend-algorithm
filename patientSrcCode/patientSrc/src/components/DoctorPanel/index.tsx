import React from 'react';
import TuWen from '@/assets/common/tuwenwenzhen@3x.png';
import TuWenDisable from '@/assets/common/tuwenwenzhen-zhihui@3x.png';
import ShiPin from '@/assets/common/shipinwenzhen@3x.png';
import ShiPinDisable from '@/assets/common/shipinzixun-zhihui@3x.png';
import YuYin from '@/assets/common/yuyinwenzhen@3x.png';
import YuYinDisable from '@/assets/common/dianhuazixun-zhihui@3x.png';
import styles from './index.module.scss';
import { IdoctorResponseProps } from '@/types/api/doctorManage';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import xin from '@/assets/common/Start.png';
import { getPrice } from '@/utils';

interface IdoctorPanelProps extends RouteComponentProps {
  doctor: IdoctorResponseProps;
}

interface ItagProps {
  img: string;
  price: number;
  enable: boolean;
}

const DoctorPanel: React.FC<IdoctorPanelProps> = (props) => {
  const { doctor, history } = props;
  const tagData = [
    {
      img: !!doctor.imgSwitch ? TuWen : TuWenDisable,
      price: doctor.imgPrice || 0,
      enable: !!doctor.imgSwitch,
    },
    {
      img: !!doctor.audioSwitch ? YuYin : YuYinDisable,
      price: doctor.audioPrice || 0,
      enable: !!doctor.audioSwitch,
    },
    {
      img: !!doctor.videoSwitch ? ShiPin : ShiPinDisable,
      price: doctor.videoPrice || 0,
      enable: !!doctor.videoSwitch,
    },
  ];

  const Tag: React.FC<ItagProps> = (props) => {
    const { img, price, enable } = props;
    return (
      <div className={styles.tag}>
        <img className={styles.tagImg} src={img} />
        {enable ? (
          <span className={styles.tagPrice}>{getPrice(price)}元/次</span>
        ) : (
          <span className={styles.disableTag}>未开通</span>
        )}
      </div>
    );
  };

  const handleDoctorPanelClick = (id: number) => {
    history.push(`/doctor-home/${id}`);
  };

  return (
    <div className={styles.doctorPanel} onClick={() => handleDoctorPanelClick(doctor.id)}>
      <div className={styles.doctorMessage}>
        <p className={styles.avatar} style={{ backgroundImage: `url(${doctor.avatar})` }}></p>
        <div className={styles.content}>
          <div className={styles.nameAndDep}>
            <span className={styles.name}>{doctor.name}</span>
            <span className={styles.dep}>
              {doctor.sectionName} | {doctor.titleName}
            </span>
          </div>
          <div className={styles.skill}>
            <div className={styles.xinBox}>
              <img src={xin} className={styles.xin} alt="图片" />
              <p>{doctor.star}</p>
              <p>问诊量: {doctor.serviceCount}</p>
            </div>
            擅长:
            {doctor.intro}
          </div>
        </div>
      </div>
      <div className={styles.line} />
      <div className={styles.tagWrapper}>
        {tagData.map((tag: ItagProps, index: number) => (
          <Tag key={index} img={tag.img} price={tag.price} enable={tag.enable} />
        ))}
      </div>
    </div>
  );
};

export default withRouter(DoctorPanel);
