import React from 'react';
import { List, WhiteSpace } from 'antd-mobile';
import { Irecord } from '@/types/api/doctorManage';
import { timeConversion } from '@/utils';
import { get } from 'lodash';
import Underline from '@/components/Underline';
import styles from './index.module.scss';
import { withRouter, RouteComponentProps } from 'react-router-dom';
interface ImedicalRecord extends RouteComponentProps {
  record: Irecord;
}

const MedicalRecord: React.FC<ImedicalRecord> = (props) => {
  const { record, history } = props;

  const handleOnclick = (id: number) => {
    history.push(`/my-record/detail/${id}`);
  };

  const handleSat = (even: any) => {
    even.stopPropagation();
    history.push(`/Satisfaction/${get(record, 'clinicNumber')}`);
  };

  const getSatisfaction = (sat: boolean) => {
    return (
      <button onClick={(even) => handleSat(even)} className={styles.btn}>
        {sat ? '查看满意度' : '满意度调查'}
      </button>
    );
  };

  return (
    <>
      <WhiteSpace />
      <div className={styles.medicalRecord} onClick={() => handleOnclick(record.id)}>
        <List>
          <List.Item className={styles.recordItem}>
            <span className={styles.text}>{timeConversion(get(record, 'createdAt'))}</span>
            {get(record, 'status') === 4 && getSatisfaction(get(record, 'satisfaction', false))}
            <span className={styles.status}>{get(record, 'statusText')}</span>
          </List.Item>
          <Underline className={styles.underline} />
          <List.Item
            extra={`${get(record, 'doctorName', '')} | ${get(record, 'sectionName', '')} | ${get(
              record,
              'hospitalName',
              ''
            )}`}>
            预约医生
          </List.Item>
          <Underline />
          <List.Item
            extra={`${timeConversion(record.appointmentTime, 'YYYY-MM-DD')} ${get(record, [
              'appointmentText',
              'hour',
            ])}`}>
            预约时间
          </List.Item>
          <Underline />
          <List.Item extra={get(record, 'orderTypeText')}>预约服务</List.Item>
        </List>
      </div>
    </>
  );
};

export default withRouter(MedicalRecord);
