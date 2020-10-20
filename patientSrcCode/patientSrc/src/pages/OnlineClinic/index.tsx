import React, { useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Page from '@/components/Page';
import styles from './index.module.scss';
import DoctorPanel from '@/components/DoctorPanel';
import MultiSelectorList from '@/pages/OnlineClinic/MultiSelectorList';
import { ListView } from 'antd-mobile';
import { getDoctorList } from '@/api/common';
import { IdoctorResponseProps, IhospitalSource } from '@/types/api/doctorManage';
import { set } from 'lodash';
import { connect } from 'react-redux';
import { getHospitalSource } from '@/store/models/hospital';

const mapStateToProps = (state: any) => {
  return { hospitalSource: state.hospitalSource };
}
const mapDispatchToProps = (dispatch: any) => {
  return { getHospitalSource: () => { dispatch(getHospitalSource()) } };
}

interface IonlineClinic extends RouteComponentProps {
  hospitalSource: IhospitalSource,
  getHospitalSource: () => void
}

const OnlineClinic: React.FC<IonlineClinic> = (props) => {
  const { hospitalSource: { id: HOSPITALID }, getHospitalSource } = props;
  const limit = 10;
  const initSource = new ListView.DataSource({
    rowHasChanged: (row1: any, row2: any) => { return row1 !== row2 },
  })
  const [dataSource, setDataSource] = useState(initSource);
  const [pageSize, setPageSize] = useState<number>(1);
  const [doctorList, setDoctorList] = useState<IdoctorResponseProps[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [more, setMore] = useState<boolean>(true);
  const [parameter, setParameter] = useState<{ sectionId?: number; titleId?: number; inquiryTypeId?: number; }>();
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {

    const getSource = async () => {
      try {
        setLoading(true);
        const { data } = await getDoctorList({ hospitalId: HOSPITALID, page: 1, limit: limit, ...parameter })
        setDoctorList(data.list);
        setDataSource(dataSource.cloneWithRows([...data.list]));
        setMore(data.more);
        setPageSize(2);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    if (parameter !== undefined) {
      if (HOSPITALID) {
        getSource();
      } else {
        getHospitalSource();
      }
    }
  }, [parameter, HOSPITALID])

  const handleChange = (data: any) => {
    let conditions = {};
    Object.keys(data).map((key: string) => {
      if (data[key].selectValue > 0) {
        set(conditions, key + 'Id', data[key].selectValue);
      }
    });
    setParameter(conditions);
  };

  const renderRow = (rowData: IdoctorResponseProps, sectionID: string | number, rowID: string | number) => {
    return (
      <DoctorPanel doctor={rowData} key={rowID}></DoctorPanel>
    )
  }
  const handleOnRefresh = () => {
    setRefreshing(true);
    const getSource = async () => {
      try {
        const { data } = await getDoctorList({ hospitalId: HOSPITALID, page: pageSize, limit: limit, ...parameter })
        setDoctorList([...doctorList, ...data.list]);
        setDataSource(dataSource.cloneWithRows([...doctorList, ...data.list]));
        setMore(data.more);
        setPageSize(pageSize + 1);
      } catch (error) {
        console.log(error);
      }
      setRefreshing(false);
    }
    getSource();
  }
  const separator = (sectionID: string | number, rowID: string | number) => (
    <div
      key={`${sectionID}-${rowID}`}
      className={styles.line}
    />
  );
  return (
    <Page title="在线门诊" loading={loading}>
      <div className={styles.contentWrapper}>
        <MultiSelectorList onChange={handleChange} />
        <ListView
          dataSource={dataSource}
          renderRow={renderRow}
          useBodyScroll={true}
          renderFooter={() => (<div className={styles.doctorFooter}>
            {more ? (refreshing ? '正在加载' : '加载完成') : '没有数据了'}
          </div>)}
          renderSeparator={separator}
          onEndReachedThreshold={20}
          onEndReached={handleOnRefresh}
          className={styles.listVewBox}
          scrollRenderAheadDistance={100}
          scrollEventThrottle={50}
        />
      </div>
    </Page>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OnlineClinic));
