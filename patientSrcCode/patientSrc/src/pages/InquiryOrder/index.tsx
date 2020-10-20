import React, { useState, useEffect } from 'react';
import { TextareaItem, List, Picker, Toast, WhiteSpace } from 'antd-mobile';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Page from '@/components/Page';
import { getAppointTime } from '@/api/patient';
import MenuList from '@/components/MenuList';
import styles from './index.module.scss';
import { getDoctorDetail } from '@/api/doctor';
import { IdoctorResponseProps, IhospitalSource } from '@/types/api/doctorManage';
import { getUrlParam, appointmentTransformer, getPrice } from '@/utils';
import Underline from '@/components/Underline';
import { createInquiryOrder, createFreeInquiryOrder } from '@/api/common';
import ImageUpload from '@/components/ImageUpload';
import { SERVICE_PANEL } from '@/utils/enums';
import BottomPayButton from '@/components/BottomPayButton';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { getHospitalSource } from '@/store/models/hospital';

interface IinquiryOrder extends RouteComponentProps {
  hospitalSource: IhospitalSource;
  getHospitalSource: () => void;
}

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

const InquiryOrder: React.FC<IinquiryOrder> = (props) => {
  const serviceList = [
    { label: '图文咨询', value: SERVICE_PANEL.TU_WEN_ZI_XUN },
    { label: '语音咨询', value: SERVICE_PANEL.YU_YIN_ZI_XUN },
    { label: '视频咨询', value: SERVICE_PANEL.SHI_PIN_ZI_XUN },
  ];
  const {
    match: { params },
    history,
    hospitalSource: { id: HOSPITALID },
    getHospitalSource,
  } = props;
  const [imgUploadArray, setImgUploadArray] = useState<{ url: string }[]>([]);
  const [currentPatientId, setCurrentPatientId] = useState<number>();
  const [doctor, setDoctor] = useState<IdoctorResponseProps>();
  const [service, setService] = useState([Number(getUrlParam('type'))]);
  const [appointmentRange, setAppointmentRange] = useState<{ value: any; label: string }[]>([]);
  const [appointment, setAppointment] = useState([0]);
  const [question, setQuestion] = useState('');
  const [price, setPrice] = useState();
  const [buttonState, setButtonState] = useState<boolean>(false);

  const checkData = [{ value: 2, label: '否' }, { value: 1, label: '是' }];
  const [checkItem, setCheckItem] = useState(0);

  const changeCheck = (value: number) => {
    setCheckItem(value);
  };

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const { data } = await getDoctorDetail(get(params, 'id'));
        setDoctor(data);
      } catch (error) {
        Toast.info(error.message);
      }
    };
    fetchDoctor();
    if (!HOSPITALID) {
      getHospitalSource();
    }
  }, []);

  useEffect(() => {
    const fetchAppointmentRange = async () => {
      try {
        const { data } = await getAppointTime(get(doctor, 'id') as number);
        const formattedData = appointmentTransformer(data);
        setAppointmentRange(formattedData);
      } catch (error) {
        console.log(error);
      }
    };
    if (get(doctor, 'id')) {
      fetchAppointmentRange();
    }
  }, [doctor]);

  useEffect(() => {
    const currentService = service[0];
    switch (currentService) {
      case SERVICE_PANEL.TU_WEN_ZI_XUN:
        setPrice(get(doctor, 'imgPrice'));
        break;
      case SERVICE_PANEL.YU_YIN_ZI_XUN:
        setPrice(get(doctor, 'audioPrice'));
        break;
      case SERVICE_PANEL.SHI_PIN_ZI_XUN:
        setPrice(get(doctor, 'videoPrice'));
        break;
      default:
        Toast.info('该医生未开通当前服务');
        break;
    }
  }, [doctor, service]);

  const handlePatientChange = (patientId: number) => {
    setCurrentPatientId(patientId);
  };

  const handleUploadImage = (files: any) => {
    setImgUploadArray(files);
  };

  const verify = () => {
    if (!currentPatientId) {
      Toast.info('请选择就诊人');
      return false;
    }
    if (!checkItem) {
      Toast.info('请选择是否为复诊患者');
      return false;
    }
    if (!question) {
      Toast.info('请输入病情描述或问题');
      return false;
    }
    if (!appointment[0]) {
      Toast.info('请选择预约时间');
      return false;
    }
    if (2 === checkItem && !!price) {
      Toast.info('抱歉，该项服务只对复诊患者开放');
      return false;
    }
    return true;
  };

  const handlePaymentClick = async () => {
    if (!verify()) {
      return;
    }
    const params = {
      patientId: currentPatientId as number,
      question,
      price,
      orderType: service[0],
      webHospitalId: HOSPITALID,
      doctorId: get(doctor, 'id') as number,
      appointmentTime: appointment[0],
      sectionId: get(doctor, 'sectionId') as number,
      isRevisit: checkItem,
      files: imgUploadArray.map((v: any) => {
        return v.url;
      }),
    };
    try {
      setButtonState(true);
      const {
        data: { id },
      } = await createInquiryOrder(params);
      if (!price) {
        const {
          data
        } = await createFreeInquiryOrder({inquiryId: id});
        if (data) {
          history.push(`/im/${get(doctor, 'id') as number}?inquiryId=${id}`);  
        }
      } else {
        history.push(`/my-record/detail/${id}`);
      }
    } catch (error) {
      setButtonState(false);
      Toast.info(error.message);
    }
  };
  return (
    <Page title="提交订单" loading={!doctor}>
      <div className={styles.inquiryOrderWrapper}>
        <WhiteSpace />
        <MenuList onChange={handlePatientChange} />
        <WhiteSpace />
        <div className={styles.content}>
          <div className={styles.title}>
            疾病描述
            <p className={styles.checkBox}>
              是否复诊患者:
              {checkData.map((item) => (
                <label key={item.label}>
                  <input
                    type="radio"
                    name="checkBox"
                    checked={item.value === checkItem}
                    value={item.value}
                    onChange={() => changeCheck(item.value)}
                  />
                  {item.label}
                </label>
              ))}
            </p>
          </div>
          <List className={styles.area}>
            <TextareaItem
              placeholder="请填写您的症状、问题等，至少填写10个字"
              rows={5}
              onChange={(val: any) => setQuestion(val)}
            />
          </List>
          <div className={styles.title}>请上传病例、化验单、检查报告、患处照片等</div>
          <div className={styles.imgContainer}>
            <ImageUpload length={4} onChange={handleUploadImage} files={imgUploadArray} />
          </div>
        </div>
        <WhiteSpace />
        <List>
          <List.Item
            extra={`${get(doctor, 'name') || ''} | ${get(doctor, 'sectionName') || ''} | ${get(
              doctor,
              'hospitalName'
            ) || ''}`}>
            预约医生
          </List.Item>
          <Underline />
          <Picker
            value={appointment}
            data={appointmentRange}
            cols={1}
            title="预约时间"
            extra="请选择预约时间"
            onChange={(v: any) => {
              setAppointment(v);
            }}>
            <List.Item arrow="horizontal">预约时间</List.Item>
          </Picker>
          <Underline />
          <Picker
            value={service}
            data={serviceList}
            cols={1}
            title="预约服务"
            extra="请选择预约服务"
            onChange={(v: any) => {
              setService(v);
            }}>
            <List.Item arrow="horizontal">预约服务</List.Item>
          </Picker>
        </List>
        <BottomPayButton
          price={getPrice(price)}
          disable={buttonState}
          onClick={handlePaymentClick}
          buttonText="去支付"
        />
        <WhiteSpace />
      </div>
    </Page>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(InquiryOrder));
