import React, { useState, useEffect } from 'react';
import Page from '@/components/Page';
import { Picker, List, InputItem, DatePicker, Toast, Modal, WhiteSpace } from 'antd-mobile';
import styles from './index.module.scss';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import BottomButton from '@/components/BottomButton';
import Underline from '@/components/Underline';
import { Timer } from '@/components/Timer';
import { calculateAge, getUrlParam, stringEncryptWithSnow } from '@/utils';
import { When } from 'react-if';
import { get } from 'lodash';
import { getPatientDetail } from '@/api/patient';
import moment from 'moment';
import { getCardType, requestEditPatient, requestAddPatient, getNationType } from '@/api/common';
import { requestErrorHandler } from '@/services/request';

const AddPatient: React.FC<RouteComponentProps> = (props) => {
  const { history } = props;
  const gender = [{ label: '男', value: 1 }, { label: '女', value: 2 }];
  const [editId, setEditId] = useState(-1);
  const [patient, setPatient] = useState({} as any);
  const [watcher, setWatcher] = useState({} as any);
  const [age, setAge] = useState<number>(-1);
  const [cardType, setCardType] = useState();
  const [nationType, setNationType] = useState();
  const [buttonState, setButtonState] = useState<boolean>(false);
  const checkData = [{ value: 2, label: '否' }, { value: 1, label: '是' }];
  const [checkItem, setCheckItem] = useState(0);

  const changeCheck = (value: number) => {
    setCheckItem(value);
  };

  useEffect(() => {
    const patientId = getUrlParam('id');
    if (patientId) {
      setEditId(parseInt(patientId));
    }
    const cardType = async () => {
      try {
        const { data } = await getCardType();
        const formattedCardType = data.map((cardType: { id: number; name: string }) => ({
          value: cardType.id,
          label: cardType.name,
        }));
        setCardType(formattedCardType);
      } catch (error) {
        Toast.info(error.message);
      }
    };
    const nationType = async () => {
      try {
        const { data } = await getNationType();
        const formattedNationType = data.map((item: { id: number; name: string }) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        setNationType(formattedNationType);
      } catch (error) {
        console.log(error);
      }
    };
    cardType();
    nationType();
  }, []);

  useEffect(() => {
    const fetchPatientDetail = async (id: number) => {
      try {
        const { data } = await getPatientDetail(id);
        const patient = {
          id: data.id,
          name: data.name,
          nationType: [data.race],
          gender: [data.gender],
          birthday: moment(data.birthday, 'YYYY-MM-DD').toDate(),
          idCard: data.cardId,
          cardType: [data.cardType],
          phone: data.phone,
        };
        setCheckItem(data.isSignDoctor);
        const watcher = {
          name: data.guardianName,
          idCard: data.guardianCardId,
          cardType: [Number(data.guardiancardType)],
        };
        setPatient(patient);
        setWatcher(watcher);
      } catch (error) {
        console.log(error);
      }
    };
    if (editId > 0) {
      fetchPatientDetail(editId);
    }
  }, [editId]);

  useEffect(() => {
    if (patient.birthday) {
      const age = calculateAge(patient.birthday, new Date());
      setAge(age);
    }
  }, [patient['birthday']]);

  useEffect(() => {
    if (patient['idCard'] && patient['idCard'].length === 18 && get(patient['cardType'], '0') === 1 && editId < 0) {
      const id = patient['idCard'][16];
      let time = patient['idCard'].slice(6, 14);

      if (moment(time, 'YYYY-MM-DD').isValid()) {
        time = moment(time, 'YYYY-MM-DD').toDate();
      } else {
        Toast.info('请输入正确的身份证号');
        return;
      }
      let gender = id % 2 === 0 ? 2 : 1;
      setPatient({ ...patient, birthday: time, gender: [gender] });
    }
  }, [patient['idCard'], patient['cardType']]);

  const setWatcherData = (key: string, value: any) => {
    const newWatcher = { ...watcher, [key]: value };
    setWatcher(newWatcher);
  };

  const verify = () => {
    if (!patient.name) {
      Toast.info('姓名不能为空');
      return false;
    }

    if (!patient.nationType) {
      Toast.info('请选择民族');
      return false;
    }

    if (!patient.idCard) {
      Toast.info('证件号码不能为空');
      return false;
    }

    if (get(patient['cardType'], '0') === 1 && patient.idCard) {
      if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(patient.idCard)) {
        Toast.info('请输入正确的身份证号');
        return false;
      }
    }

    if (!patient.gender) {
      Toast.info('性别不能为空');
      return false;
    }

    if (!patient.birthday) {
      Toast.info('出生日期不能为空');
      return false;
    }
    if (!checkItem) {
      Toast.info('请选择是否签约家庭医生');
      return false;
    }
    if (!patient.phone) {
      Toast.info('联系电话不能为空');
      return false;
    }
    if (!/^1\d{10}$/.test(patient.phone)) {
      Toast.info('请输入正确的电话号码');
      return false;
    }
    if (editId < 0) {
      if (!patient.code) {
        Toast.info('验证码不能为空');
        return false;
      }
    }
    if (0 <= age && age < 6) {
      if (!watcher.name) {
        Toast.info('监护人姓名不能为空');
        return false;
      }
      if (!watcher.idCard) {
        Toast.info('监护人证件号不能为空');
        return false;
      }
    }
    return true;
  };

  const handleAddPatient = () => {
    if (verify()) {
      const params = { patient, watcher, id: editId };
      if (editId > 0) {
        params.id = editId;
      }

      const requestPatient = async (payload: any) => {
        const { patient, watcher, id } = payload;
        const params = {
          patientId: 0,
          name: patient.name,
          race: patient.nationType ? patient.nationType[0] : 1,
          cardType: patient.cardType ? patient.cardType[0] : 1, // 身份证
          cardId: patient.idCard,
          gender: patient.gender[0],
          birthday: moment(patient.birthday).format('YYYY-MM-DD'),
          phone: patient.phone,
          guardianName: watcher.name,
          guardianCardType: watcher.cardType ? watcher.cardType[0] : 1, // 身份证
          guardianCardId: watcher.idCard,
          code: patient.code,
          isSignDoctor: checkItem,
        };

        if (id !== -1) {
          params.patientId = id;
        }

        try {
          setButtonState(true);
          let requestProps: any;
          if (id !== -1) {
            requestProps = await requestEditPatient(params);
          } else {
            requestProps = await requestAddPatient(params);
          }
          //return Promise.resolve(requestProps);
          if (get(requestProps, 'errcode') === 0) {
            Toast.info(editId > 0 ? '修改成功' : '添加成功');
            if (window.localStorage.getItem('hasNoPatient') === 'true') {
              setTimeout(() => {
                history.go(-2);
              }, 2000);
            } else {
              setTimeout(() => {
                history.goBack();
              }, 2000);
            }

          }
        } catch (error) {
          requestErrorHandler(error, {
            business: (code, message: any) => {
              if (code === 810002) {
                const { patientPhone, hospitalPhone } = JSON.parse(message);
                Modal.alert(
                  <div style={{ color: '#48505A', wordBreak: 'break-all', textAlign: 'justify' }}>
                    此证件号{stringEncryptWithSnow(params.cardId)}已注册，请用手机号码{patientPhone}
                    进行验证，如需更换号码，请联系医院进行更改
                  </div>,
                  null,
                  [
                    {
                      text: '联系医院',
                      onPress: () => {
                        window.location.href = `tel://${hospitalPhone}`;
                      },
                      style: { color: '#FF6B00' },
                    },
                    { text: '取消', style: { color: '#000' } },
                  ]
                );
              } else {
                Toast.info(message);
              }
            },
          });
        } finally {
          setButtonState(false);
        }
      };
      requestPatient(params);
    }
  };

  const setPatientData = (key: string, value: any) => {
    const newPatient = { ...patient, [key]: value };
    setPatient(newPatient);
  };

  return (
    <Page title="就诊人管理" loading={!cardType}>
      <WhiteSpace />
      <div className={styles.listWrapper}>
        <List>
          <InputItem
            type="text"
            placeholder="请输入姓名"
            clear
            onChange={(v) => {
              setPatientData('name', v);
            }}
            value={patient.name}>
            姓名
          </InputItem>
          <Underline />
          <Picker
            value={patient.nationType}
            data={nationType}
            title="民族"
            cols={1}
            extra="请选择民族"
            onChange={(v) => {
              setPatientData('nationType', v);
            }}>
            <List.Item arrow="horizontal">民族</List.Item>
          </Picker>
          <Underline />
          <Picker
            value={patient.cardType}
            data={cardType}
            title="证件类型"
            cols={1}
            extra="请选择证件"
            disabled={editId > 0 ? true : false}
            onChange={(v) => {
              setPatientData('cardType', v);
            }}>
            <List.Item arrow="horizontal">证件类型</List.Item>
          </Picker>
          <Underline />
          <InputItem
            type="text"
            placeholder="请输入证件号码"
            clear
            value={patient.idCard}
            disabled={editId > 0 ? true : false}
            onChange={(v) => {
              setPatientData('idCard', v);
            }}>
            证件号
          </InputItem>
          <Underline />
          <Picker
            value={patient.gender}
            data={gender}
            title="性别"
            cols={1}
            extra="请选择性别"
            onChange={(v) => {
              setPatientData('gender', v);
            }}>
            <List.Item arrow="horizontal">性别</List.Item>
          </Picker>
          <Underline />
          <DatePicker
            mode="date"
            title="出生日期"
            minDate={new Date(1900, 1, 1)}
            maxDate={new Date()}
            extra="请选择出生日期"
            value={patient.birthday}
            onChange={(date) => {
              setPatientData('birthday', date);
            }}>
            <List.Item arrow="horizontal">出生日期</List.Item>
          </DatePicker>
          <Underline />
          <List.Item arrow="horizontal">
            是否签约家庭医生:
            <p className={styles.checkBox}>
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
          </List.Item>
          <Underline />
          <InputItem
            type="phone"
            value={patient.phone}
            onChange={(v) => setPatientData('phone', v.replace(/\s+/g, ''))}
            placeholder="请输入联系电话">
            联系电话
          </InputItem>
          <Underline />
          <When condition={editId < 0}>
            <List.Item
              extra={
                <div className={styles.codePanel}>
                  <InputItem
                    type="number"
                    placeholder="请输入验证码"
                    clear
                    value={patient.code}
                    onChange={(v) => {
                      setPatientData('code', v);
                    }}
                  />
                  <span className={styles.gap} />
                  <span className={styles.codeButton}>
                    <Timer phone={patient.phone} />
                  </span>
                </div>
              }>
              验证码
            </List.Item>
          </When>
          <When condition={0 <= age && age < 6}>
            <WhiteSpace />
            <List.Item>监护人信息</List.Item>
            <Underline />
            <InputItem
              type="text"
              placeholder="请输入监护人姓名"
              clear
              value={watcher.name}
              onChange={(v) => {
                setWatcherData('name', v);
              }}>
              姓名
            </InputItem>
            <Underline />
            <Picker
              data={cardType}
              title="证件类型"
              cols={1}
              extra="居民身份证"
              value={watcher.cardType}
              onChange={(v) => {
                setWatcherData('cardType', v);
              }}>
              <List.Item arrow="horizontal">证件类型</List.Item>
            </Picker>
            <Underline />
            <InputItem
              type="text"
              placeholder="请输入证件号码"
              clear
              value={watcher.idCard}
              onChange={(v) => {
                setWatcherData('idCard', v);
              }}>
              证件号
            </InputItem>
            <WhiteSpace />
          </When>
        </List>
      </div>
      <BottomButton disable={buttonState} content="确认" onClick={handleAddPatient} />
    </Page>
  );
};

export default withRouter(AddPatient);
