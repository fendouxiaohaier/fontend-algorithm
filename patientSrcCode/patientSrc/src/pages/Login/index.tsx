import React, { useState, useEffect } from 'react';
import { connect, Connect, MapDispatchToPropsParam } from 'react-redux';
import { List, InputItem, Checkbox, Toast } from 'antd-mobile';
import { requestLogin } from '@/api/common';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Page from '@/components/Page';
import styles from './index.module.scss';
import Underline from '@/components/Underline';
import BottomButton from '@/components/BottomButton';
import { Timer } from '@/components/Timer';
import { getUrlParam } from '@/utils';
import { getOpenId, getAuthUrl } from '@/api/authorization';
import { get } from 'lodash';
import { Modal } from 'antd-mobile';
import Agreement from './Agreement/index';
import Secrit from './Secrit/index';
import { getHospitalSource } from '@/store/models/hospital';
import { IhospitalSource } from '@/types/api/doctorManage';
import { requestErrorHandler } from '@/services/request';

interface IloginProps extends RouteComponentProps {
  hospitalSource: IhospitalSource,
  getHospitalSource: () => void
}
const mapStateToProps = (state: any) => {
  return { hospitalSource: get(state, 'hospitalSource') };
}
const mapDispatchToProps = (dispatch: any) => {
  return { getHospitalSource: () => { dispatch(getHospitalSource()) } };
}

const Login: React.FC<IloginProps> = (props) => {
  const { hospitalSource: { id: HOSPITALID, name: HOSPITALNAME }, getHospitalSource, history } = props;
  const [phone, setPhone] = useState<string>('');
  const [code, setCode] = useState('');
  const [arrowState, setArrowState] = useState(false);
  const [openId, setOpenId] = useState<{ [index: string]: string }>({});
  const [authData, setAuthData] = useState<{ name: string, url: string }[]>([]);
  const [disable, setDisable] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      if (authData.length === 0) {
        const fetchAuthUrl = async () => {
          try {
            const { data } = await getAuthUrl({ hospitalId: HOSPITALID, url: encodeURIComponent(window.location.origin + '/' + window.location.hash) });
            setAuthData(data);
          } catch (error) {
            Toast.info('请求错误,请退出页面重新打开.')
          }
        }
        fetchAuthUrl();
      } else {
        let openIdSource = get(localStorage, ['openId']) ? JSON.parse(get(localStorage, ['openId'])) : {};
        setOpenId(openIdSource);
        for (let i = 0; i < authData.length; i++) {
          const item = authData[i];
          const name = get(item, 'name');
          const id = get(openIdSource, [name]);
          if (!id) {
            localStorage.setItem('openId', JSON.stringify({ ...openIdSource, [name]: '-1' }));
            openIdSource = { ...openIdSource, [name]: '-1' };
            window.location.href = get(item, 'url');
            return;
          }
          if (id === '-1') {
            const fetchGetOpenId = async () => {
              const search = window.location.search;
              try {
                const { data } = await getOpenId(name, search);
                localStorage.setItem('openId', JSON.stringify({ ...openIdSource, [name]: get(data, 'openId') }));
                setOpenId({ ...openIdSource, [name]: get(data, 'openId') });
              } catch (error) {
                requestErrorHandler(error, {
                  business: (code, message: any) => {
                    if (code) {
                      localStorage.removeItem('openId');
                      setOpenId({});
                      Toast.info(message);
                    }
                  },
                });
              }
            }
            if (window.location.href.includes('code=')) {
              fetchGetOpenId();
            } else {
              localStorage.removeItem('openId');
              setOpenId({});
              history.go(0);
            }
          }
        }
      }
    };
    if (HOSPITALID) {
      fetchData();
    } else {
      getHospitalSource();
    }
  }, [HOSPITALID, authData]);

  const checkBackUrl = () => {
    const backUrl = getUrlParam('backUrl');
    if (backUrl) {
      window.location.href = decodeURIComponent(backUrl);
    } else {
      history.replace('/home');
    }
  };

  const handleLogin = async () => {
    if (!phone) {
      Toast.info('请输入手机号');
      return false;
    } else if (!/^1\d{10}$/.test(phone)) {
      Toast.info('请输入正确的手机号');
      return false;
    }

    if (!code) {
      Toast.info('请输入验证码');
      return false;
    }

    if (!arrowState) {
      Toast.info('请阅读协议并勾选');
      return;
    }
    try {
      setDisable(true);
      await requestLogin({ phone, code, hospitalId: HOSPITALID }, openId);
      checkBackUrl();
    } catch (error) {
      setDisable(false);
      Toast.info(error.message);
    }
  };

  const handleShowSecrit = () => {
    Modal.alert(<Secrit></Secrit>, null, [
      {
        text: '我已阅读',
        onPress: () => {
          setArrowState(true);
        },
        style: { color: '#ff6b00' },
      },
    ]);
  };

  const handleShowAgreement = () => {
    Modal.alert(<Agreement name={HOSPITALNAME}></Agreement>, null, [
      {
        text: '我已阅读',
        onPress: () => {
          setArrowState(true);
        },
        style: { color: '#ff6b00' },
      },
    ]);
  };
  return (
    <Page title="登录" loading={!HOSPITALID}>
      <div className={styles.loginWrapper}>
        <div className={styles.title}>{HOSPITALNAME}</div>
        <List className={styles.list}>
          <InputItem className={styles.phone} placeholder="输入您的手机号" onChange={(val) => setPhone(val)} />
          <Underline />
          <InputItem
            placeholder="短信验证码"
            className={styles.code}
            onChange={(val) => setCode(val)}
            extra={<Timer phone={phone} />}
          />
          <Underline />
          <div className={styles.agreement}>
            <Checkbox
              className={styles.checkbox}
              checked={arrowState}
              onChange={(value) => {
                setArrowState(value.target.checked);
              }}
            />
            <span className={styles.agreementText}>
              &nbsp;&nbsp;我已阅读
              <span className={styles.protocol} onClick={handleShowSecrit}>
                《隐私保护政策》
              </span>
              <br />
              <span className={styles.protocol} onClick={handleShowAgreement}>
                《乌鲁木齐市第四人民医院医联互联网医院患者门诊服务协议》
              </span>
            </span>
          </div>
        </List>
      </div>
      <BottomButton content="登录" disable={disable} onClick={handleLogin} />
    </Page>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Login));
