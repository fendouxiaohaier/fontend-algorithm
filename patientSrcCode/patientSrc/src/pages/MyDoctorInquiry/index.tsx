import React, { useEffect, useState } from 'react';
import Page from '@/components/Page';
import styles from './index.module.scss';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { getInquiryListe } from '@/api/patient';
import { GetInquiryListeItem } from '@/api/patient/typing';
import moment from 'moment';
import createIm, { ImProps } from '@/libs/IM';
import { getUserInfo, getUserSig } from '@/api/common';

type Props = {} & RouteComponentProps;

interface ConversationItem {
  conversationID: string;
  unreadCount: number;
}

interface IimProps {
  setMessageRead: (groupId: string, callback: any) => void;
  logout: () => void;
}

let im: IimProps;

function DoctorInfoInquiry(props: Props) {
  const { history } = props;
  const [List, setList] = useState<GetInquiryListeItem[]>([]);
  const [Loading, setLoading] = useState(true);
  const [checkMap, setCheckMap] = useState<Map<string, number>>(new Map<string, number>());
  const handleGetList = (list: ConversationItem[]) => {
    const checkMap = new Map<string, number>();
    for (const data of list) {
      checkMap.set(data.conversationID, data.unreadCount);
    }
    setCheckMap(checkMap);
  };

  useEffect(() => {
    // 请求医生列表
    const getSource = async () => {
      try {
        setLoading(true);
        const { data } = await getInquiryListe();
        setLoading(false);
        if (data) {
          setList((prevList) => prevList.concat(data));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getSource();
    // 请求用户信息
    const fetchUser = async () => {
      const { data } = await getUserInfo();
      const { data: userSig } = await getUserSig(data.imAccount);
      const props: ImProps = {
        imAccount: data.imAccount,
        userSig,
        getList: handleGetList,
      };
      //@ts-ignore
      im = createIm(props);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    return () => {
      im.logout();
    };
  }, []);

  const handerGoIm = (item: GetInquiryListeItem) => {
    im.setMessageRead(item.groupId, history.push(`/im/${item.doctorId}?inquiryId=${item.inquiryId}`));
  };

  const getTime = (num: number) => {
    if (num) {
      return moment(Number(num) * 1000).format('MM/DD hh:mm');
    }
    return '-';
  };

  const getNum = (groupId: string) => {
    const num = checkMap.get(`GROUP${groupId}`);
    if (num) {
      return num;
    }
    return ' ';
  };

  return (
    <Page title="问诊消息列表" loading={Loading}>
      <div className={styles.content}>
        {List.map((item) => (
          <div key={item.doctorId} className={styles.itemBox}>
            <div className={styles.item} onClick={() => handerGoIm(item)}>
              <p className={styles.avatar} style={{ backgroundImage: `url(${item.doctorFacePicUrl})` }}></p>
              <div className={styles.detail}>
                <p className={styles.info}>
                  <span className={styles.name}>{item.doctorName}</span>
                  <span className={styles.section}>{`${item.sectionName}  ${item.titleName}`}</span>
                </p>
                <p className={styles.position}>{item.hospitalName}</p>
              </div>
              <div className={styles.end}>
                <p className={styles.num}>{getNum(item.groupId)}</p>
                <p className={styles.time}>{getTime(item.chatTime)}</p>
              </div>
            </div>
          </div>
        ))}
        {List.length === 0 && !Loading && <div className={styles.no}>暂无问诊消息</div>}
      </div>
    </Page>
  );
}

export default withRouter(DoctorInfoInquiry);
