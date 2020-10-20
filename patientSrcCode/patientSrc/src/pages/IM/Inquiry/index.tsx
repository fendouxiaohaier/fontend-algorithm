import React, { useState, useEffect, useRef } from 'react';
import styles from './index.module.scss';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { getDoctorDetail } from '@/api/doctor';
import { getUserInfo, getUserSig, createGroup } from '@/api/common';
import { getPatientRecordDetail } from '@/api/patient';
import Page from '@/components/Page';
import InputComponent from '@/pages/IM/InputComponent/index';
import Poper from '@/pages/IM/Poper/index';
import createIm, { ImProps } from '@/libs/IM';
import { Modal } from 'antd-mobile';
import { getUrlParam, dayToChineseTransformer } from '@/utils';
import { When } from 'react-if';
import { INQUIRY_ORDER_STATUS, IM_DESC_CUSTOM_TYPE } from '@/utils/enums';
import HouZhen from '@/assets/common/houzhen@3x.png';
import ServicePanel from '@/components/ServicePanel';
import classnames from 'classnames/bind';
import { get, set } from 'lodash';
import RecipeMessage from '@/pages/IM/RecipeMessage';
import WxImageViewer from 'react-wx-images-viewer';

interface IimProps {
  sendMessage: (type: string, msg: any) => void;
  fetchHistoryIMMessage: (nextReqId?: number) => void;
  logout: () => void;
}

interface IhistoryMessage {
  content: any;
  id: number;
  isSelf: boolean;
  msgSeq: number;
  msgType: string;
}

let im: IimProps;
let isNewMsg = true;
let lastIMScrollHeight: any;

const cx = classnames.bind(styles);

const InquiryIm: React.FC<RouteComponentProps> = (props) => {
  const {
    match: { params },
    history,
  } = props;
  const imRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const [doctor, setDoctor] = useState();
  const [user, setUser] = useState();
  const [inquiryDetail, setInquiryDetail] = useState();
  const [historyMessage, setHistoryMessage] = useState<IhistoryMessage[]>([]);
  const [nextReqMessageID, setNextReqMessageID] = useState<number>(0);
  const [imageViewerState, setImageViewerState] = useState(false);
  const [wxImageViewerProps, setWxImageViewerProps] = useState<{ source: string[]; index: number }>();

  const handleMessage = (msg: IhistoryMessage) => {
    if (msg.msgType === IM_DESC_CUSTOM_TYPE.INQUIRY_FINISH) {
      setInquiryDetail({ ...inquiryDetail, status: INQUIRY_ORDER_STATUS.FINISHED });
      return;
    }
    setHistoryMessage((historyMessage: IhistoryMessage[]) => {
      return [...historyMessage, { ...msg }];
    });
  };

  const getHistoryMessage = (message: IhistoryMessage[], nextReqMessageID: number) => {
    //存储翻页id和历史消息数组
    setNextReqMessageID(nextReqMessageID);
    setHistoryMessage((historyMessage: IhistoryMessage[]) => {
      return [...message, ...historyMessage];
    });
  };

  const handleShowModal = (clinicNumber: string) => {
    Modal.alert('当前对话已结束', '请对本次就诊填写评价', [
      {
        text: '前往评价',
        onPress: () => {
          history.push(`/Satisfaction/${clinicNumber}`);
        },
        style: { color: '#ff6b00' },
      },
      {
        text: '暂不评价',
        onPress: () => {},
        style: { color: '#888888' },
      },
    ]);
  };

  useEffect(() => {
    const initFetch = async () => {
      let parameter = {};
      try {
        const { data } = await getDoctorDetail(get(params, 'id'));
        setDoctor(data);
      } catch (error) {
        console.log(error);
      }

      try {
        const { data: groupId } = await createGroup(parseInt(getUrlParam('inquiryId')));
        set(parameter, 'groupId', groupId);
      } catch (error) {
        console.log(error);
      }

      try {
        const inquiryId = Number(getUrlParam('inquiryId'));
        const { data } = await getPatientRecordDetail(inquiryId);
        setInquiryDetail(data);
        set(parameter, 'clinicNumber', data.clinicNumber);
      } catch (error) {
        console.log(error);
      }

      try {
        const { data } = await getUserInfo();
        set(parameter, 'imAccount', data.imAccount);
        const { data: userSig } = await getUserSig(data.imAccount);
        set(parameter, 'userSig', userSig);
        setUser(data);
      } catch (error) {
        console.log(error);
      }
      const props: ImProps = {
        groupId: get(parameter, 'groupId'),
        imAccount: get(parameter, 'imAccount'),
        userSig: get(parameter, 'userSig'),
        clinicNumber: get(parameter, 'clinicNumber'),
        handleMessage,
        getHistoryMessage,
        handleShowModal,
      };
      im = createIm(props);
    };
    initFetch();
    return () => {
      im.logout();
    };
  }, []);

  useEffect(() => {
    if (imRef.current) {
      if (isNewMsg) {
        imRef.current.scrollTop = imRef.current.scrollHeight;
      } else {
        imRef.current.scrollTop = imRef.current.scrollHeight - lastIMScrollHeight;
        isNewMsg = true;
      }
    }
  }, [imRef, historyMessage]);

  const handleSetSequence = () => {
    im.fetchHistoryIMMessage(nextReqMessageID);
    if (imRef.current) {
      lastIMScrollHeight = imRef.current.scrollHeight;
    }
    isNewMsg = false;
  };

  const handleSend = (value: string) => {
    im.sendMessage('text', value);
  };

  const handleUpload = (file: File) => {
    im.sendMessage('image', file);
  };

  const handleBlur = () => {
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      setTimeout(() => {
        if (imRef.current) {
          imRef.current.scrollTop = imRef.current.scrollHeight;
        }
      }, 100);
    }, 300);
  };

  const handleFocus = () => {
    if (inputRef && inputRef.current) {
      setTimeout(() => {
        document.body.scrollTop = document.body.scrollHeight;
      }, 300);
    }
  };

  const handleImageOnclick = (url: string) => {
    let source = [];
    for (const item of historyMessage) {
      if (get(item, ['content', 'url'])) {
        source.push(get(item, ['content', 'url']));
      }
    }
    const index = source.findIndex((value) => {
      return value === url;
    });
    setWxImageViewerProps({ source, index });
    setImageViewerState(true);
  };

  const imContainerCls = cx({
    imContainer: true,
    finished: get(inquiryDetail, 'status') === INQUIRY_ORDER_STATUS.FINISHED,
  });

  const ContentComponent = (item: any) => {
    if (item.msgType === IM_DESC_CUSTOM_TYPE.VIDEO_ROOM) {
      return <img src={item.content.qrcodeUrl} className={styles.imCustomImage} />;
    } else if (item.msgType === IM_DESC_CUSTOM_TYPE.RECIPE) {
      return <RecipeMessage {...item}></RecipeMessage>;
    } else if (item.msgType === IM_DESC_CUSTOM_TYPE.INQUIRY_FINISH) {
      return <p style={{ color: '#999', textAlign: 'center' }}>{item.content}</p>;
    }
    return (
      <Poper
        data={item.isSelf ? { name: user.userName, avatar: user.avatar } : doctor}
        mode={item.isSelf ? 'self' : 'target'}
        content={
          item.msgType === 'text' ? (
            <span>{item.content}</span>
          ) : (
            <img
              className={styles.poperImage}
              src={item.content.url}
              onClick={() => handleImageOnclick(item.content.url)}
            />
          )
        }
      />
    );
  };

  return (
    <Page title={get(doctor, 'name')} loading={!doctor}>
      {imageViewerState && (
        <WxImageViewer
          onClose={() => {
            setImageViewerState(false);
          }}
          urls={get(wxImageViewerProps, 'source')}
          index={get(wxImageViewerProps, 'index') || 0}
        />
      )}
      <When condition={get(inquiryDetail, 'status') === INQUIRY_ORDER_STATUS.WAITING_FOR_INQUIRY}>
        <div className={styles.maskLayer}>
          <div className={styles.waitingNotice}>
            <img src={HouZhen} className={styles.waitingIcon} />
            <span className={styles.waitingNoticeText}>候诊中</span>
            <div className={styles.waitingContent}>
              <p>门诊还未开始，医生开始接诊后</p>
              <p>将会短信通知，请注意查收。</p>
            </div>
            <span className={styles.appointmentTime}>
              预约时间: {get(inquiryDetail, ['appointmentText', 'date'])} 星期
              {dayToChineseTransformer(get(inquiryDetail, 'appointmentTime'))}{' '}
              {get(inquiryDetail, ['appointmentText', 'hour'])}
            </span>
          </div>
        </div>
      </When>
      <div className={styles.imWrapper}>
        <div className={styles.doctorPanel}>
          <p className={styles.avatar} style={{ backgroundImage: `url(${get(doctor, 'avatar')})` }}></p>
          <div className={styles.intro}>
            <span className={styles.title}>
              {get(doctor, 'name')}
              <span className={styles.subTitle}>
                {get(doctor, 'sectionName')} | {get(doctor, 'titleName')}
              </span>
            </span>
            <span className={styles.content}>{get(doctor, 'hospitalName')}</span>
          </div>
        </div>
        <div ref={imRef} className={imContainerCls}>
          <When condition={nextReqMessageID > 0}>
            <div onClick={handleSetSequence} className={styles.historyButton}>
              查看历史消息
            </div>
          </When>
          {historyMessage.map((item: any) => {
            return (
              <div key={item.id} className={styles.poperWrapper}>
                <ContentComponent {...item}></ContentComponent>
              </div>
            );
          })}
        </div>
        <When condition={get(inquiryDetail, 'status') === INQUIRY_ORDER_STATUS.IN_PROGRESS}>
          <div ref={inputRef} className={styles.inputWrapper}>
            <InputComponent
              onUpload={(file: File) => handleUpload(file)}
              onSend={(value: string) => handleSend(value)}
              onBlur={() => handleBlur()}
              onFocus={() => handleFocus()}
            />
          </div>
        </When>
        <When condition={get(inquiryDetail, 'status') === INQUIRY_ORDER_STATUS.FINISHED}>
          <div className={styles.servicePanelWrapper}>
            <div className={styles.serviceFinishedText}>本次问诊结束</div>
            <div className={styles.service}>
              <ServicePanel doctor={doctor} />
            </div>
          </div>
        </When>
      </div>
    </Page>
  );
};

export default withRouter(InquiryIm);
