import React, { useState, useEffect } from 'react';
import MenuList from '@/components/MenuList';
import Page from '@/components/Page';
import { getMyInquiries } from '@/api/patient';
import MedicalRecord from '@/pages/My/MyRecord/MedicalRecord';
import { Irecord } from '@/types/api/doctorManage';
import { WingBlank, WhiteSpace, ListView } from 'antd-mobile';
import styles from './index.module.scss'

const MyRecord: React.FC = () => {
  const initSource = new ListView.DataSource({
    rowHasChanged: (row1: any, row2: any) => { return row1 !== row2 },
  })
  const [recordSource, setRecordSource] = useState(initSource);
  const [currentPatientId, setCurrentPatientId] = useState<number>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMyRecord = async (id: number) => {
      try {
        setLoading(true);
        const { data } = await getMyInquiries(id);
        setRecordSource(recordSource.cloneWithRows(data));
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    if (currentPatientId) {
      fetchMyRecord(currentPatientId);
    } else {
      setLoading(false);
    }
  }, [currentPatientId])

  const handlePatientChange = (patientId: number) => {
    setCurrentPatientId(patientId);
  };

  const renderRow = (rowData: Irecord, sectionID: string | number, rowID: string | number) => {
    return (
      <MedicalRecord key={rowID} record={rowData} />
    )
  }

  return (
    <Page title="我的就诊记录" loading={loading}>
      <WhiteSpace />
      <MenuList onChange={handlePatientChange} />
      <WingBlank>
        <ListView
          dataSource={recordSource}
          renderRow={renderRow}
          initialListSize={3}
          useBodyScroll={true}
          className={styles.recordList}
        />
        <WhiteSpace />
      </WingBlank>
    </Page>
  );
}

export default MyRecord;
