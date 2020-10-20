import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import { getDoctorDetail } from '@/api/doctor';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { IdoctorResponseProps } from '@/types/api/doctorManage';
import Page from '@/components/Page';
import ServicePanel from '@/components/ServicePanel';
import Underline from '@/components/Underline';
import { get } from 'lodash';
import BottomButton from '@/components/BottomButton';
import { FollowDoctor, UnFollowDoctor } from '@/api/patient';
import { Toast } from 'antd-mobile';

function DoctorHome(props: RouteComponentProps) {
  const {
    match: { params },
    history,
  } = props;
  const id = get(params, 'id');
  const [doctor, setDoctor] = useState<IdoctorResponseProps>();
  const [followDoctorText, setFollowDoctorText] = useState<string>('关注医生');
  const [followDoctorState, setFollowDoctorState] = useState<boolean>(false);
  const [btnDisable, setBtnDisable] = useState<boolean>(false);

  useEffect(() => {
    window.localStorage.setItem('hasNoPatient', 'false');
    const fetchDoctorDetail = async () => {
      try {
        const { data } = await getDoctorDetail(id);
        setDoctor(data);
        setFollowDoctorState(data.isFollow);
      } catch (error) {
        Toast.info(error.message);
      }
    };
    fetchDoctorDetail();
  }, []);

  const handleFollowDoctor = () => {
    setBtnDisable(true);
    const follwDoctor = async () => {
      try {
        const { data } = await FollowDoctor(id);
        if (data) {
          Toast.info('关注成功');
          setFollowDoctorState(true);
        }
      } catch (error) {
        Toast.info(error.message);
        if (error.message === '尚未添加本人患者信息') {
          window.localStorage.setItem('hasNoPatient', 'true');
          setTimeout(() => {
            history.push('/my-patient');
          }, 2000);
        }
      }
      setBtnDisable(false);
    };

    const unFollowDoctor = async () => {
      try {
        const { data } = await UnFollowDoctor(get(doctor, 'id') as number);
        if (data) {
          Toast.info('取消关注成功');
          setFollowDoctorState(false);
        }
      } catch (error) {
        console.log(error);
      }
      setBtnDisable(false);
    };
    if (followDoctorState) {
      unFollowDoctor();
    } else {
      follwDoctor();
    }
  };

  useEffect(() => {
    if (followDoctorState) {
      setFollowDoctorText('取消关注');
    } else {
      setFollowDoctorText('关注医生');
    }
  }, [followDoctorState]);

  useEffect(() => {
    if (window.location.href.indexOf('autoFollow') !== -1) {
      handleFollowDoctor();
    }
  }, []);

  return (
    <Page title={get(doctor, 'name')} loading={!doctor}>
      <div className={styles.doctorHomeWrapper}>
        <div className={styles.doctorPanel}>
          <p className={styles.avatar} style={{ backgroundImage: `url(${get(doctor, 'avatar')})` }}></p>
          <div className={styles.content}>
            <div className={styles.title}>
              {get(doctor, 'name')}
              <span className={styles.subTitle}>
                {get(doctor, 'sectionName')} | {get(doctor, 'titleName')}
              </span>
            </div>
            <div className={styles.hospital}>{get(doctor, 'hospitalName')}</div>
          </div>
        </div>
        <div className={styles.service}>
          <ServicePanel doctor={doctor} />
        </div>
        <div className={styles.introWrapper}>
          <div className={styles.introPanel}>
            <div className={styles.introTitle}>医生擅长</div>
            <Underline className={styles.underlineFix} />
            <div className={styles.intro}>擅长: {get(doctor, 'intro')}</div>
          </div>
        </div>
        {/* <BottomButton content={followDoctorText} disable={btnDisable} onClick={handleFollowDoctor}></BottomButton> */}
      </div>
    </Page>
  );
}

export default withRouter(DoctorHome);
