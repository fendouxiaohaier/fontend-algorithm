import React from 'react';
import styles from './index.module.scss';
import { Ipatient } from '@/types/api/patientManage';
import { get } from 'lodash';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { WhiteSpace, List, SwipeAction } from 'antd-mobile';
import Underline from '@/components/Underline';
import {requestDeletePatient} from '@/api/common';
interface IpatientPanel extends RouteComponentProps {
  patientSource: Ipatient;
}


const PatientPanel: React.FC<IpatientPanel> = (props) => {
  const { patientSource, history } = props;

  const handleToEditClick = (id: number) => {
    history.push(`/my-patient/add?id=${id}`);
  };

  return (
    <>
      <WhiteSpace />
      <div className={styles.patientPanel}>
        <List>
        <SwipeAction
          style={{ backgroundColor: 'gray' }}
          autoClose
          right={[
            {
              text: ' 删 除 ',
              onPress: async () => {
                const res = await requestDeletePatient({patientId: get(patientSource, 'id')});
                if (res && res.errcode === 0) {
                  history.go(0);
                }
              },
              style: { backgroundColor: '#F4333C', color: 'white' },
            },
          ]}
        >
            <List.Item extra={get(patientSource, 'name')}  onClick={() => handleToEditClick(get(patientSource, 'id'))}>姓名</List.Item>
            <Underline />
            <List.Item extra={get(patientSource, 'cardId')} onClick={() => handleToEditClick(get(patientSource, 'id'))}>证件号</List.Item>
            <Underline />
            <List.Item extra={get(patientSource, 'phone')} onClick={() => handleToEditClick(get(patientSource, 'id'))}>电话</List.Item>
          </SwipeAction>
        </List>
      </div>
    </>
  );
}

export default withRouter(PatientPanel);
