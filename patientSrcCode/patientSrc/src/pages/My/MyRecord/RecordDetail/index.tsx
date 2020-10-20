import React, { useEffect, useState } from 'react';
import Page from '@/components/Page';
import { withRouter } from 'react-router-dom';
import { List, Toast, NoticeBar, WhiteSpace, Modal } from 'antd-mobile';
import BottomButton from '@/components/BottomButton';
import Underline from '@/components/Underline';
import { RouteComponentProps } from 'react-router';
import { getPatientRecordDetail } from '@/api/patient';
import ImageUpload from '@/components/ImageUpload';
import { INQUIRY_ORDER_STATUS } from '@/utils/enums';
import { When } from 'react-if';
import BottomPayButton from '@/components/BottomPayButton';
import { get } from 'lodash';
import { IinquiryDetailResProps } from '@/types/api/doctorManage';
import { timeConversion, getPrice } from '@/utils';
import styles from './index.module.scss';
import { cancelInquiry, cancelPay } from '@/api/common';

const RecordDetail: React.FC<RouteComponentProps> = (props) => {
  const {
    match: { params },
    history,
  } = props;
  const [recordDetail, setRecordDetail] = useState<IinquiryDetailResProps>();
  const [closeState, setCloseState] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<string>('支付');

  const [remainingTime, setRemainingTime] = useState<string>('');

  useEffect(() => {
    const fetchRecordDetail = async (id: number) => {
      try {
        const { data } = await getPatientRecordDetail(id);
        setRecordDetail(data);
        if (data.closed) {
          setCloseState(true);
          setButtonText('已关闭');
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchRecordDetail(get(params, 'id'));
  }, []);

  const handleToInquiryIm = () => {
    history.push(`/im/${get(recordDetail, 'doctorId')}?inquiryId=${get(params, 'id')}`);
  };

  const handlePaymentClick = () => {
    if (closeState) {
      Toast.info('该订单已关闭');
      return false;
    }

    const backUrl = `${window.location.origin}/#/im/${get(recordDetail, 'doctorId')}?inquiryId=${get(
      recordDetail,
      'id'
    )}`;

    window.location.href = `${process.env.REACT_APP_PAYURL}#/orderPayment?id=${get(
      recordDetail,
      'id'
    )}&type=inquiry&backUrl=${encodeURIComponent(`${backUrl}`)}`;
  };

  useEffect(() => {
    let timeLoop: NodeJS.Timeout;
    if (!closeState) {
      let timeStamp = get(recordDetail, 'payTimeLeft', 0);
      timeLoop = setInterval(() => {
        if (timeStamp > 0) {
          setRemainingTime(`订单剩余支付时间 ${timeConversion(timeStamp, 'mm:ss')}`);
          timeStamp--;
        } else {
          clearInterval(timeLoop);
          setRemainingTime('订单已关闭,请重新下单。');
          setCloseState(true);
          setButtonText('已关闭');
        }
      }, 1000);
    } else {
      setRemainingTime('订单已关闭,请重新下单。');
    }
    return () => {
      clearInterval(timeLoop);
    };
  }, [get(recordDetail, 'payTimeLeft'), closeState]);

  const handleCancelOrder = () => {
    const fetchCancelOrder = async () => {
      try {
        const { data, errmsg } = await cancelPay(get(params, 'id'));
        if (data) {
          Toast.info('取消成功', 2, () => {
            history.goBack();
          });
          setRecordDetail({ ...(recordDetail as IinquiryDetailResProps), payTimeLeft: 0 });
          setRemainingTime('订单已关闭,请重新下单.');
          setCloseState(true);
          setButtonText('已关闭');
        } else {
          Toast.info(errmsg);
        }
      } catch (error) {
        Toast.info(error.message);
      }
    };
    fetchCancelOrder();
  };

  const handleCancelWaiting = () => {
    const fetchCancelOrder = async () => {
      try {
        const { data, errmsg } = await cancelInquiry(get(params, 'id'));
        if (data) {
          Toast.info('取消成功', 2, () => {
            history.goBack();
          });
        } else {
          Toast.info(errmsg);
        }
      } catch (error) {
        Toast.info(error.message);
      }
    };

    Modal.alert('取消订单', '', [
      { text: '取消', onPress: () => console.log('cancel') },
      { text: '确定', onPress: () => fetchCancelOrder() },
    ]);
  };

  console.log('==',recordDetail)
  return (
    <Page
      title={get(recordDetail, 'status') === INQUIRY_ORDER_STATUS.FINISHED ? '就诊记录详情' : '在线门诊详情'}
      loading={!recordDetail}>
      <When condition={get(recordDetail, 'status', 1) === 0 && get(recordDetail, 'payTimeLeft', 0) === 0}>
        <NoticeBar>订单已关闭,请重新下单。</NoticeBar>
      </When>
      <When condition={get(recordDetail, 'payTimeLeft', 0) > 0}>
        <NoticeBar mode="link" onClick={handleCancelOrder} action={<span>取消订单</span>}>
          {remainingTime}
        </NoticeBar>
      </When>
      <WhiteSpace />
      <div className={styles.recordDetailWrapper}>
        <List>
          <List.Item
            extra={`${get(recordDetail, 'doctorName', '')} | ${get(recordDetail, 'sectionName', '')} | ${get(
              recordDetail,
              'hospitalName',
              ''
            )}`}>
            预约医生
          </List.Item>
          <Underline />
          <List.Item
            extra={`${get(recordDetail, ['appointmentText', 'date'], '')} ${get(
              recordDetail,
              ['appointmentText', 'hour'],
              ''
            )}`}>
            预约时间
          </List.Item>
          <Underline />
          <List.Item extra={get(recordDetail, 'orderTypeText', '')}>预约服务</List.Item>
          <WhiteSpace />
          <List.Item extra={get(recordDetail, 'patientName', '')}>就诊人</List.Item>
          <Underline />
          <div className={styles.desc}>
            <span className={styles.text}>病情描述：{get(recordDetail, 'question', '')}</span>
            <div className={styles.imgContainer}>
              <ImageUpload
                length={get(recordDetail, ['file', 'length'])}
                files={get(recordDetail, 'file', [])}
                // onChange={this.onChange}
                // onImageClick={(index, fs) => console.log(index, fs)}
                selectable={false}
                // onAddImageClick={this.onAddImageClick}
                disableDelete
              />
            </div>
          </div>
          <WhiteSpace />
          <List.Item extra={<span className={styles.status}>{get(recordDetail, 'statusText')}</span>}>
            订单状态
          </List.Item>
          <Underline />
          <List.Item extra={timeConversion(get(recordDetail, 'createdAt'))}>订单创建时间</List.Item>
          <Underline />
          <List.Item extra={`${getPrice(get(recordDetail, 'realPrice'))} 元`}>订单价格</List.Item>
          <WhiteSpace />
        </List>
      </div>
      <When condition={get(recordDetail, 'status') === INQUIRY_ORDER_STATUS.WAITING_FOR_PAY}>
        <BottomPayButton
          price={getPrice(get(recordDetail, 'realPrice'))}
          onClick={handlePaymentClick}
          buttonText={buttonText}
        />
      </When>
      <When condition={get(recordDetail, 'status') === INQUIRY_ORDER_STATUS.WAITING_FOR_INQUIRY}>
        <div className={styles.waitingForInquiry}>
          <BottomButton content="取消订单" onClick={handleCancelWaiting} />
          <BottomButton content="进入对话" onClick={handleToInquiryIm} />
        </div>
      </When>
      <When condition={get(recordDetail, 'status') === INQUIRY_ORDER_STATUS.IN_PROGRESS}>
        <BottomButton content="进入对话" onClick={handleToInquiryIm} />
      </When>
      <When condition={get(recordDetail, 'status') === INQUIRY_ORDER_STATUS.FINISHED}>
        <BottomButton content="查看记录" onClick={handleToInquiryIm} />
      </When>
    </Page>
  );
};

export default withRouter(RecordDetail);
