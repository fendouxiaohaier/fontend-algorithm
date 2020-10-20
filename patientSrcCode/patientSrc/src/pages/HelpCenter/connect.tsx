import React, { useEffect } from 'react';
import Page from '@/components/Page';
import styles from './index.module.scss';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { IhospitalSource } from '@/types/api/doctorManage';
import { getHospitalSource } from '@/store/models/hospital';
import moment from 'moment';
import { connect } from 'react-redux';
import { get } from 'lodash';


interface IloginProps extends RouteComponentProps {
  hospitalInfo: IhospitalSource,
  getHospitalSource: () => void
}

const mapStateToProps = (state: any) => {
  return { hospitalInfo: get(state, 'hospitalSource') };
}
const mapDispatchToProps = (dispatch: any) => {
  return { getHospitalSource: () => { dispatch(getHospitalSource()) } };
}

const HelpCenterConnect: React.FC<IloginProps> = (props) => {
  const { hospitalInfo, getHospitalSource } = props;
  useEffect(() => {
    getHospitalSource();
  }, []);
  return (
    <Page title="联系客服" loading={false} >
      <div className={styles.content} style={{ padding: '15px' }}>
        <h2 style={{ lineHeight: '100px' }}>客服电话：{hospitalInfo.phone}</h2>
        {
          hospitalInfo.worktime
          && <p style={{ lineHeight: '2' }}>工作日：{moment.unix(hospitalInfo.worktime.amStart).format('HH:MM')}-{moment.unix(hospitalInfo.worktime.amEnd).format('HH:MM')} {moment.unix(hospitalInfo.worktime.pmStart).format('HH:MM')}-{moment.unix(hospitalInfo.worktime.pmEnd).format('HH:MM')}</p>
        }<p style={{ lineHeight: '2' }}>节假日休息</p>
        <a href={`tel:${hospitalInfo.phone}`}>
          <div style={{
            marginTop: '100px',
            width: '100%',
            height: '45px',
            background: '#40a9ff',
            color: '#fff',
            textAlign: 'center',
            lineHeight: '44px',
            borderRadius: '8px',
          }}>呼叫</div>
        </a>
      </div>
    </Page >
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(HelpCenterConnect));
