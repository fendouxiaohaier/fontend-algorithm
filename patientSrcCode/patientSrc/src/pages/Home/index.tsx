import React, { useEffect, useState } from 'react';
import Page from '@/components/Page';
import Carousel from '@/pages/Home/Carousel';
import SectionPanel from '@/pages/Home/SectionPanel';
import Department from '@/pages/Home/Department';
import { ListView, Toast, WhiteSpace, WingBlank } from 'antd-mobile';
import { getHomeData, getHomeDoctors } from '@/api/home';
import DoctorPanel from '@/components/DoctorPanel';
import { IdoctorResponseProps, IhomeSourceProps } from '@/types/api/doctorManage';
import { get } from 'lodash';
import styles from './index.module.scss';
import { connect } from 'react-redux';
import { getHospitalSource } from '@/store/models/hospital';
import Aside from '@/pages/Home/Aside';

const mapStateToProps = (state: any) => {
  return { hospitalSource: state.hospitalSource };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    getHospitalSource: () => {
      dispatch(getHospitalSource());
    },
  };
};

const Home: React.FC = (props: any) => {
  const {
    hospitalSource: { id: HOSPITALID, name: HOSPITALNAME },
    getHospitalSource,
    history,
  } = props;
  const initSource = new ListView.DataSource({
    rowHasChanged: (row1: any, row2: any) => {
      return row1 !== row2;
    },
  });
  const [carouselSource, setCarouselSource] = useState<IhomeSourceProps['banners']>([]);
  const [departmentSource, setDepartmentSource] = useState<IhomeSourceProps['sections']>([]);
  const [pageSize, setPageSize] = useState<number>(1);
  const [doctorList, setDoctorList] = useState<IdoctorResponseProps[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(true);
  const [more, setMore] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState(initSource);

  useEffect(() => {
    const getInitHomeData = async () => {
      try {
        const { data } = await getHomeData(HOSPITALID);
        setCarouselSource(get(data, 'banners'));
        setDepartmentSource(get(data, 'sections'));
      } catch (error) {
        Toast.info(error.message);
      }
    };
    const getDoctorList = async () => {
      try {
        const { data } = await getHomeDoctors(HOSPITALID, pageSize);
        setDoctorList(data.list);
        setDataSource(dataSource.cloneWithRows(data.list));
        setMore(data.more);
      } catch (error) {
        Toast.info(error.message);
      }
    };

    if (HOSPITALID) {
      getInitHomeData();
      getDoctorList();
    } else {
      getHospitalSource();
    }
  }, [HOSPITALID]);

  const renderRow = (rowData: IdoctorResponseProps, sectionID: string | number, rowID: string | number) => {
    return (
      <WingBlank key={rowID}>
        <DoctorPanel doctor={rowData}></DoctorPanel>
      </WingBlank>
    );
  };
  const handleOnRefresh = () => {
    if (more) {
      setRefreshing(true);
      const getDoctorList = async () => {
        try {
          const { data } = await getHomeDoctors(HOSPITALID, pageSize + 1);
          setPageSize(pageSize + 1);
          setRefreshing(false);
          setMore(data.more);
          setDataSource(dataSource.cloneWithRows([...doctorList, ...data.list]));
          setDoctorList([...doctorList, ...data.list]);
        } catch (error) {
          console.log(error);
        }
      };
      getDoctorList();
    }
  };

  const separator = (sectionID: string | number, rowID: string | number) => (
    <WhiteSpace key={`${sectionID}-${rowID}`}></WhiteSpace>
  );

  const renderHeader = () => (
    <>
      <Carousel dataSource={carouselSource} />
      <SectionPanel />
      <div style={{ fontSize: '18px', color: '#00CCCC', padding: '15px 15px', lineHeight: '45px' }}>
        抗击疫情,实时救助
        <div style={{ backgroundColor: '#00CCCC',boxSizing: 'border-box', float: 'right', color: '#fff', border: '2px solid #00CCCC', padding: '0 12px', borderRadius: '8px' }}
          onClick={() => history.push('/online-clinic')}
        >免费咨询</div>
      </div>
      <Department dataSource={departmentSource}/>
      <WingBlank>
        <WhiteSpace />
        <div className={styles.doctorTitle}>推荐医生</div>
        <WhiteSpace />
      </WingBlank>
    </>
  );

  const renderFooter = () => (
    <div className={styles.doctorFooter}>{more ? (refreshing ? '正在加载' : '加载完成') : '没有数据了'}</div>
  );

  return (
    <Page title={HOSPITALNAME} loading={!(carouselSource.length || doctorList.length)}>
      <Aside />
      <ListView
        dataSource={dataSource}
        renderRow={renderRow}
        renderHeader={renderHeader}
        renderFooter={renderFooter}
        renderSeparator={separator}
        onEndReachedThreshold={20}
        onEndReached={handleOnRefresh}
        useBodyScroll={false}
        className={styles.listVewBox}
        scrollRenderAheadDistance={100}
        scrollEventThrottle={50}
      />
    </Page>
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
