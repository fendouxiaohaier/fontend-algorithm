import React, { useState, useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { getUserInfo, getUserSig } from '@/api/common';
import { getInquiryListe } from '@/api/patient';
import { GetInquiryListeItem } from '@/api/patient/typing';
import createIm, { ImProps } from '@/libs/IM';
import style from './index.module.scss';

interface Aside extends RouteComponentProps {
  num?: number;
}

interface ConversationItem {
  conversationID: string;
  unreadCount: number;
}

interface IimProps {
  logout: (callback?: any) => void;
}

// eslint-disable-next-line
let im: IimProps;

const Aside = (props: Aside) => {
  const { num = 0, history } = props;
  const [callBtn, setCallBtn] = useState(false);
  const [login, setLogin] = useState(false);
  const [group, setGroup] = useState(0);
  const [c2c, setC2c] = useState(0);

  const handleGo = () => {
    setCallBtn(!callBtn);
  };

  const handleMyDoctorInquiry = () => {
    im.logout(history.push('/MyDoctorInquiry'));
  };

  const handleMyDoctor = () => {
    im.logout(history.push('/my-doctor'));
  };

  const handleGetList = (list: ConversationItem[], DoctorList?: GetInquiryListeItem[]) => {
    for (const datas of list) {
      const { conversationID, unreadCount } = datas;
      if (conversationID.indexOf('GROUP') >= 0 && DoctorList) {
        // 判断仍处在会话中的未读消息数量
        for (const doctor of DoctorList) {
          if (conversationID === `GROUP${doctor.groupId}`) {
            setGroup(group + unreadCount);
            break;
          }
        }
      }
      if (conversationID.indexOf('C2C') >= 0) {
        setC2c(c2c + unreadCount);
      }
    }
  };

  useEffect(() => {
    const getData = async (imAccount: string, DoctorList: GetInquiryListeItem[]) => {
      setLogin(true);
      const { data: userSig } = await getUserSig(imAccount);
      const props: ImProps = {
        imAccount: imAccount,
        userSig,
        getList: handleGetList,
        DoctorList,
      };
      //@ts-ignore
      im = createIm(props);
    };

    // 请求当前正处在问诊的医生列表
    const getSource = async (imAccount: string) => {
      try {
        const { data } = await getInquiryListe();
        let DoctorList: GetInquiryListeItem[] = [];
        if (data) {
          DoctorList = data;
        }
        getData(imAccount, DoctorList);
      } catch (error) {
        console.log(error);
      }
    };

    const init = async () => {
      try {
        const { data } = await getUserInfo();
        if (data && data.imAccount) {
          getSource(data.imAccount);
        }
      } catch (error) {
        console.log(error.code);
      }
    };

    init();
  }, []);

  return (
    <aside role="button" tabIndex={0} className={style.aside} onClick={() => handleGo()}>
      {callBtn && (
        <div className={style.btnBox}>
          <div className={style.wen} onClick={handleMyDoctorInquiry}>
            <p>{login && <i>{group}</i>}</p>
            问诊
          </div>
          <div className={style.sui} onClick={handleMyDoctor}>
            <p>{login && <i>{c2c}</i>}</p>
            随诊
          </div>
        </div>
      )}
      <div className={style.asideImg} data-num={num > 0 ? num : ''}>
        {login && <i>{group + c2c}</i>}
        <img src={require(`@/assets/common/liaotian.png`)} alt="" />
      </div>
    </aside>
  );
};

export default withRouter(Aside);
