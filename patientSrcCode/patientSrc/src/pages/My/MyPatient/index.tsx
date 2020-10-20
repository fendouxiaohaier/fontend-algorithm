import React, { useEffect, useState } from 'react';
import Page from '@/components/Page';
import PatientPanel from '@/pages/My/MyPatient/PatientPanel';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styles from './index.module.scss';
import BottomButton from '@/components/BottomButton';
import { getMyPatients } from '@/api/patient';
import { Ipatient } from '@/types/api/patientManage';
import { WingBlank, ListView, WhiteSpace } from 'antd-mobile';

const MyPatient: React.FC<RouteComponentProps> = (props) => {
  const { history } = props;
  const initSource = new ListView.DataSource({
    rowHasChanged: (row1: any, row2: any) => { return row1 !== row2 },
  })
  const [patientSource, setPatientSource] = useState(initSource);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMyPatient = async () => {
      try {
        const { data } = await getMyPatients();
        setPatientSource(patientSource.cloneWithRows(data))
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMyPatient();
  }, []);

  const handleAddPatientClick = () => {
    history.push('/my-patient/add');
  };


  const renderRow = (rowData: Ipatient, sectionID: string | number, rowID: string | number) => {
    return (
      <PatientPanel key={rowID} patientSource={rowData} />
    )
  }
  return (
    <Page title="就诊人列表" loading={loading}>
      <WingBlank>
        <ListView
          dataSource={patientSource}
          renderRow={renderRow}
          initialListSize={3}
          useBodyScroll={true}
          className={styles.patientList}
        />
        <WhiteSpace />
      </WingBlank>
      <BottomButton content="新增就诊人" onClick={handleAddPatientClick} />
    </Page>
  );
}

export default withRouter(MyPatient);
