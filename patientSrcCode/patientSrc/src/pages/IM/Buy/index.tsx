import React, { useState, useEffect, useRef } from 'react';
import styles from './index.module.scss';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { getUserInfo, getUserSig } from '@/api/common';
import Page from '@/components/Page';
import InputComponent from '@/pages/IM/InputComponent/index';
import Poper from '@/pages/IM/Poper/index';
import createIm, { ImProps } from '@/libs/SingleIM';
import { getUrlParam, parseIMHistoryMessage } from '@/utils';
import { When } from 'react-if';
import { IM_DESC_CUSTOM_TYPE } from '@/utils/enums';
import { getSurplus, getHistorySingleIMMessage } from '@/api/patient/index';
import { GetSurplusParams, GetSurplusData, GetHistorySIMMParams } from '@/api/patient/typing';
import classnames from 'classnames/bind';
import { get } from 'lodash';
import { Modal } from 'antd-mobile';
import Alert from './Components/questionAlert';
//@ts-ignore
import WxImageViewer from 'react-wx-images-viewer';

type Props = {} & RouteComponentProps;

//@ts-ignore
let im: {
  loginCase: object;
  sendMessage: (type: string, msg: any, resolve: any, reject: any) => void;
  logout: () => void;
} = {
  loginCase: {},
  sendMessage: () => {},
  logout: () => {},
};

let isNewMsg = true;
let lastIMScrollHeight: any;

const cx = classnames.bind(styles);
const ModalAlert = Modal.alert;

function InquiryIm(props: Props) {
  const { history } = props;
  let getDoctor = JSON.parse(decodeURIComponent(getUrlParam('doctor')));

  const imRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const [doctor] = useState(getDoctor);
  const [user, setUser] = useState({} as any);
  const [talkData, setTalkData] = useState([] as any);
  const [userSig, setUserSig] = useState('');
  const [doctorImAccount] = useState(doctor.doctorImAccount);
  const [doctorId] = useState(doctor.id);
  const [imageViewerState, setImageViewerState] = useState(false);
  const [wxImageViewerProps, setWxImageViewerProps] = useState<{ source: string[]; index: number }>();
  const [Surplus, setSurplus] = useState<GetSurplusData>({ surplusBout: -1 });
  // 单聊历史是否拉取完全
  const [isCompleted, setIsCompleted] = useState(1);
  // 单聊历史偏移量
  const [reqMsgSeq, setReqMsgSeq] = useState(0);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [showAlert, setShowAlert] = useState(false);

  let alert = ModalAlert(null, null, []);

  const handleGo = () => {
    alert.close();
    history.push(`/QuestionPacket/${doctorId}?num=${Surplus.followBoutNum}&Price=${Surplus.followPackagePrice}`);
  };

  const handleShowAlert = () => {
    alert = ModalAlert(
      null,
      <Alert Price={Surplus.followPackagePrice} num={Surplus.followBoutNum} goNext={() => handleGo()}></Alert>,
      [
        {
          text: '知道了',
          onPress: () => {
            setShowAlert(false);
          },
          style: { color: '#ff6b00' },
        },
      ]
    );
  };

  const fetchUser = async () => {
    const { data } = await getUserInfo();
    const { data: userSig } = await getUserSig(data.imAccount);
    setUser(data);
    setUserSig(userSig);
  };

  // 获取剩余回合数
  const fetchSurplus = async (isSendMsg: number, prescriptionIds?: number, prImg?: string) => {
    const params: GetSurplusParams = {
      doctorId: doctor.id,
      isSendMsg,
      prescriptionIds,
      prImg,
    };
    const { data } = await getSurplus(params);
    if (data) {
      setSurplus(data);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchSurplus(0);
  }, []);

  useEffect(() => {
    if (imRef.current) {
      if (isNewMsg) {
        setTimeout(() => {
          try {
            //@ts-ignore
            imRef.current.scrollTop = imRef.current.scrollHeight;
          } catch (error) {}
        }, 100);
      } else {
        // @ts-ignore
        imRef.current.scrollTop =
          // @ts-ignore
          imRef.current.scrollHeight - lastIMScrollHeight;
        isNewMsg = true;
      }
    }
  }, [imRef, talkData, doctor]);

  const handleMessage = (msg: any) => {
    setTalkData((talkData: any) => {
      return [
        ...talkData,
        {
          ...msg,
        },
      ];
    });
  };

  const fetchHistoryGroupMessage = async () => {
    setHistoryLoading(true);
    const params: GetHistorySIMMParams = {
      doctorId,
      reqMsgSeq,
      limit: 20,
    };
    const { data } = await getHistorySingleIMMessage(params);
    setHistoryLoading(false);
    if (data) {
      const { messageList, nextReqMessageID, isCompleted } = data;
      setIsCompleted(isCompleted);
      setReqMsgSeq(nextReqMessageID);
      const parsedData = parseIMHistoryMessage(messageList, user.imAccount);
      setTalkData((talkData: any) => {
        return [...parsedData, ...talkData];
      });
    }
  };

  useEffect(() => {
    return () => {
      if (userSig) {
        im.logout();
      }
    };
  }, []);

  // 返回能否发送消息
  const checkIMStatusIfCanSendMsg = () => {
    if (Surplus) {
      if (Surplus.surplusBout && (Surplus.surplusBout > 0 || Surplus.surplusBout === -99)) {
        return true;
      }
      return false;
    }
    return false;
  };

  // 发送处方
  const handleSendR = (value: any) => {
    if (!checkIMStatusIfCanSendMsg()) {
      if (!showAlert) {
        setShowAlert(true);
        handleShowAlert();
        return null;
      }
      return null;
    }
    fetchSurplus(1, value.id, value.prImg);
    im.sendMessage(
      IM_DESC_CUSTOM_TYPE.RECIPE,
      value,
      (resp: any) => {
        console.log(resp);
      },
      (error: any) => {
        console.log(error);
      }
    );
  };

  useEffect(() => {
    if (user.id && userSig && doctorImAccount && doctorId) {
      const props: ImProps = {
        imAccount: user.imAccount,
        userSig,
        doctorImAccount,
        onReceiveMessage: handleMessage,
        fetchSurplus,
      };
      //@ts-ignore
      im = createIm(props);
      fetchHistoryGroupMessage();
      const PresData = sessionStorage.getItem('PresList');
      if (PresData) {
        const PresList = JSON.parse(PresData);
        if (Array.isArray(PresList) && PresList.length !== 0) {
          setTimeout(() => {
            try {
              PresList.map((item) => {
                const data = item;
                data.drugs = item.medication;
                data.transNo = item.tranNo;
                handleSendR(data);
              });
              sessionStorage.removeItem('PresList');
            } catch (error) {}
          }, 1500);
        }
      }
    }
  }, [user, userSig, doctorImAccount, doctorId]);
  const handleSend = (value: string) => {
    if (!checkIMStatusIfCanSendMsg()) {
      if (!showAlert) {
        setShowAlert(true);
        handleShowAlert();
        return null;
      }
      return null;
    }
    fetchSurplus(1);
    im.sendMessage(
      'text',
      value,
      (resp: any) => {
        console.log(resp);
      },
      (error: any) => {
        console.log(error);
      }
    );
  };

  const handleSetSequence = () => {
    fetchHistoryGroupMessage();
    // @ts-ignore
    lastIMScrollHeight = imRef.current.scrollHeight;
    isNewMsg = false;
  };

  const handleUpload = (file: File) => {
    if (!checkIMStatusIfCanSendMsg()) {
      if (!showAlert) {
        setShowAlert(true);
        handleShowAlert();
        return null;
      }
      return null;
    }
    fetchSurplus(1);
    im.sendMessage(
      'image',
      file,
      (resp: any) => {
        console.log(resp);
      },
      (error: any) => {
        console.log(error);
      }
    );
  };

  const handleBlur = () => {
    setTimeout(() => {
      try {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        setTimeout(() => {
          try {
            //@ts-ignore
            imRef.current.scrollTop = imRef.current.scrollHeight;
          } catch (error) {}
        }, 100);
      } catch (error) {}
    }, 300);
  };

  const handleFocus = () => {
    if (inputRef && inputRef.current) {
      setTimeout(() => {
        try {
          document.body.scrollTop = document.body.scrollHeight;
        } catch (error) {}
      }, 300);
    }
  };

  const imContainerCls = cx({
    imContainer: true,
    finished: !!checkIMStatusIfCanSendMsg(),
  });

  const handleImageOnclick = (url: string) => {
    let source = [];
    for (const item of talkData) {
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

  // 复诊续方
  const handleGoFuFang = () => {
    history.push(`/Continuation/${user.id}/${doctorId}`);
  };

  // 跳转处方详情
  const handlePrescription = (id: number) => {
    history.push(`/recipe-detail/${id}`);
  };

  const getContent = (item: any) => {
    if (item.msgType === 'text') {
      return <span>{item.content}</span>;
    } else if (item.msgType === 'image') {
      return (
        <img
          className={styles.poperImage}
          src={item.content.url}
          onClick={() => handleImageOnclick(item.content.url)}
        />
      );
    }
    return (
      <div className={styles.prescription}>
        <div className={styles.title}>
          <span>处方笺</span>
          <span className={styles.transNo}>处方编号:{item.content && item.content.transNo}</span>
        </div>
        <div className={styles.result}>诊断：{item.content && item.content.prescription}</div>
        <div className={styles.prescriptionList}>
          <div className={styles.tag}>RP</div>
          <div className={styles.list}>
            <ul>
              {item.content.drugs &&
                item.content.drugs.map((v: any) => (
                  <li key={v.drugId + v.name}>
                    <p className={styles.name}>
                      {v.name} {v.specification}
                    </p>
                    <p className={styles.method}>
                      {v.useMethodName},{v.frequencyRemark},{v.perUseDose}
                      {v.doseUnit}
                    </p>
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <div className={styles.details} onClick={() => handlePrescription(item.content.id)}>
          点击查看处方详情
        </div>
      </div>
    );
  };

  const ContentComponent = (item: any) => {
    if (item.msgType === IM_DESC_CUSTOM_TYPE.VIDEO_ROOM) {
      return <img src={item.content.qrcodeUrl} className={styles.imCustomImage} />;
    }

    return (
      <Poper
        data={item.isSelf ? { name: user.userName, avatar: user.avatar } : doctor}
        mode={item.isSelf ? 'self' : 'target'}
        content={getContent(item)}
      />
    );
  };

  return (
    <Page title={doctor.name} loading={!doctor.id}>
      {imageViewerState && (
        <WxImageViewer
          onClose={() => {
            setImageViewerState(false);
          }}
          urls={get(wxImageViewerProps, 'source')}
          index={get(wxImageViewerProps, 'index') || 0}
        />
      )}
      <div className={styles.imWrapper}>
        <div className={styles.doctorPanel}>
          <p className={styles.avatar} style={{ backgroundImage: `url(${doctor.avatar})` }}></p>
          <div className={styles.intro}>
            <span className={styles.title}>
              {doctor.name}
              <span className={styles.subTitle}>
                {doctor.sectionName} | {doctor.titleName}
              </span>
            </span>
            <span className={styles.content}>{doctor.hospitalName}</span>
          </div>
        </div>
        <div ref={imRef} className={imContainerCls}>
          {!isCompleted && doctorId && !historyLoading && (
            <div onClick={handleSetSequence} className={styles.historyButton}>
              查看历史消息
            </div>
          )}
          {talkData.length > 0 &&
            talkData.map((item: any) => {
              if (!item.id) return null;
              return (
                <div key={item.id} className={styles.poperWrapper}>
                  <ContentComponent {...item}></ContentComponent>
                </div>
              );
            })}
        </div>
        <div className={styles.btnBox}>
          <button onClick={handleGoFuFang} className={styles.btnL}>
            复诊续方
          </button>
          {Surplus.surplusBout > 0 && <button className={styles.btnR}>剩余回合：{Surplus.surplusBout}</button>}

          {Surplus.surplusBout === 0 && (
            <button onClick={handleShowAlert} className={styles.btnR}>
              请购买服务包
            </button>
          )}
        </div>
        <div ref={inputRef} className={styles.inputWrapper}>
          <InputComponent
            onUpload={(file: File) => handleUpload(file)}
            onSend={(value: string) => handleSend(value)}
            onBlur={() => handleBlur()}
            onFocus={() => handleFocus()}
          />
        </div>
      </div>
    </Page>
  );
}

export default withRouter(InquiryIm);
