import React, { useState, useEffect } from 'react';
import { List } from 'antd-mobile';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Page from '@/components/Page';
import { getUserInfo } from '@/api/common';
import styles from './index.module.scss';
import DefaultAvatar from '@/assets/common/morentouxiang@3x.png';
import PatientIcon from '@/assets/common/jiuzhenrenguanli@3x.png';
import RecordIcon from '@/assets/common/wodejiuzhenjilu@3x.png';
import RecipeIcon from '@/assets/common/wodechufang@3x.png';
import OrderIcon from '@/assets/common/wodeyaopingdingdan@3x.png';
import Underline from '@/components/Underline';
import { get } from 'lodash';
import { IuserInfo } from '@/types/api/patientManage';
import { getMyDrugOrder } from '@/api/patient';
import DoctorIcon from '@/assets/common/doctor.png';
import HelpIcon from '@/assets/common/help.png';

const My: React.FC<RouteComponentProps> = (props) => {
  const { history } = props;
  const { Item } = List;
  const [user, setUser] = useState<IuserInfo>();
  const [drugOrderUrl, setDrugOrderUrl] = useState<string>();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const { data } = await getUserInfo();
        setUser(data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchDrugOrders = async () => {
      try {
        const { data } = await getMyDrugOrder();
        setDrugOrderUrl(get(data, 'url'));
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserInfo();
    fetchDrugOrders();
  }, []);

  return (
    <Page title="我的" loading={!user}>
      <div className={styles.pageWrapper}>
        <div className={styles.userSection}>
          <img className={styles.avatar} src={get(user, 'avatar') || DefaultAvatar} alt="" />
          <span className={styles.name}>{get(user, 'userName')}</span>
        </div>
        <div className={styles.listWrapper}>
          <div className={styles.list}>
            <List>
              <Item thumb={PatientIcon} arrow="horizontal" onClick={() => history.push('/my-patient')}>
                就诊人管理
              </Item>
              <Underline className={styles.underlineFix} />
              <Item thumb={RecordIcon} arrow="horizontal" onClick={() => history.push('/my-record')}>
                我的就诊记录
              </Item>
              <Underline className={styles.underlineFix} />
              <Item thumb={RecipeIcon} arrow="horizontal" onClick={() => history.push('/my-recipe')}>
                我的处方
              </Item>
              <Underline className={styles.underlineFix} />
              <Item
                thumb={OrderIcon}
                arrow="horizontal"
                onClick={() => drugOrderUrl && (window.location.href = drugOrderUrl)}>
                我的药品订单
              </Item>
              <Underline className={styles.underlineFix} />
              {/* <Item thumb={DoctorIcon} arrow="horizontal" onClick={() => history.push('/my-doctor')}>
                我的医生
              </Item>
              <Underline className={styles.underlineFix} /> */}
              <Item thumb={HelpIcon} arrow="horizontal" onClick={() => history.push('/helpCenter')}>
                帮助中心
              </Item>
            </List>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default withRouter(My);
