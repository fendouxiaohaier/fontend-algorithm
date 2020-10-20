import React, { useEffect, useState } from 'react';
import Page from '@/components/Page';
import styles from './index.module.scss';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { getMyDoctorList } from '@/api/patient';
import { GetMyDoctorItem } from '@/api/patient/typing';
import moment from 'moment';
import createIm, { ImProps } from '@/libs/SingleIM';
import { getUserInfo, getUserSig } from '@/api/common';

type Props = {} & RouteComponentProps;

interface ConversationItem {
  conversationID: string;
  unreadCount: number;
}

let im: {
  logout: (callback?: any) => void;
  loginCase: object;
  setMessageRead: (doctorImAccount: string, callback: any) => void;
} = {
  logout: (callback?: any) => {},
  loginCase: {},
  setMessageRead: (doctorImAccount: string, callback: any) => {},
};

function DoctorInfo(props: Props) {
  const { history } = props;
  const [List, setList] = useState<GetMyDoctorItem[]>([]);
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
        const { data } = await getMyDoctorList();
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
        doctorImAccount: '',
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

  const handerGoIm = (item: GetMyDoctorItem) => {
    im.setMessageRead(item.doctorImAccount, history.push(`/BuyIm?doctor=${encodeURIComponent(JSON.stringify(item))}`));
  };

  const getTime = (num: number) => {
    if (num) {
      return moment(Number(num) * 1000).format('MM/DD hh:mm');
    }
    return '-';
  };

  const getNum = (doctorImAccount: string) => {
    const num = checkMap.get(`C2C${doctorImAccount}`);
    if (num) {
      return num;
    }
    return ' ';
  };

  return (
    <Page title="我的医生" loading={Loading}>
      <div className={styles.content}>
        {List.map((item) => (
          <div key={item.id} className={styles.itemBox}>
            <div className={styles.item} onClick={() => handerGoIm(item)}>
              <p className={styles.avatar} style={{ backgroundImage: `url(${item.avatar})` }}></p>
              <div className={styles.detail}>
                <p className={styles.info}>
                  <span className={styles.name}>{`${item.name} | ${item.sectionName}`}</span>
                </p>
                <p className={styles.position}>{item.titleName}</p>
              </div>
              <div className={styles.end}>
                <p className={styles.num}>{getNum(item.doctorImAccount)}</p>
                <p className={styles.time}>{getTime(item.lastChatTime)}</p>
              </div>
            </div>
          </div>
        ))}
        {List.length === 0 && !Loading && <div className={styles.no}>暂无关注医生</div>}
      </div>
    </Page>
  );
}

export default withRouter(DoctorInfo);
