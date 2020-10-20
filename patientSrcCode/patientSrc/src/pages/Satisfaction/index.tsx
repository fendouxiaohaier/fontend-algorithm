import React, { useState, useEffect } from 'react';
import Page from '@/components/Page';
import styles from './index.module.scss';
import { WingBlank, TextareaItem, Checkbox, Toast } from 'antd-mobile';
import { withRouter } from 'react-router-dom';
import xin from '@/assets/common/Start.png';
import noxin from '@/assets/common/NoStart.png';
import { getInit, getSatisAdd } from '@/api/satisfaction';
import { RouteComponentProps } from 'react-router';
import { GetInitParams, GetSatisAddParams } from '@/api/satisfaction/typing';
import { get } from 'lodash';

interface DataItem {
  id: string;
  value: string;
  checkd: boolean;
}

function Packet(props: RouteComponentProps) {
  const {
    match: { params },
    history,
  } = props;
  const [star, setStar] = useState(5);
  const [Loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState('');
  const clinicNumber = get(params, 'clinicNumber');
  const [praise, setPraise] = useState<DataItem[]>([]);
  const [criticism, setCriticism] = useState<DataItem[]>([]);
  const [readOnly, setReadOnly] = useState(true);

  const onChange = (num: number) => {
    if (readOnly) {
      return false;
    }
    setStar(num);
  };

  const handlePraise = (value: any, id: string) => {
    if (readOnly) {
      return;
    }
    const List: DataItem[] = [];
    praise.forEach((item) => {
      const Item = JSON.parse(JSON.stringify(item));
      if (Item.id === id) {
        Item.checkd = value.target.checked;
      }
      List.push(Item);
    });
    setPraise(List);
  };

  const handleCriticism = (value: boolean, id: string) => {
    if (readOnly) {
      return;
    }
    const List: DataItem[] = [];
    criticism.forEach((item) => {
      const Item = JSON.parse(JSON.stringify(item));
      if (Item.id === id) {
        Item.checkd = value;
      }
      List.push(Item);
    });
    setCriticism(List);
  };

  useEffect(() => {
    const Init = async () => {
      setLoading(true);
      try {
        const params: GetInitParams = { clinicNumber };
        const { data } = await getInit(params);
        if (data && data.question) {
          const { question, answer } = data;
          const { praise, criticism } = question;
          setReadOnly(!!answer);
          const praises: DataItem[] = [];
          const criticisms: DataItem[] = [];
          if (praise) {
            let answerPraise = '';
            if (answer && answer.praise) {
              answerPraise = answer.praise;
            }
            for (const item in praise) {
              const Item: DataItem = {
                id: item,
                value: praise[item],
                checkd: answerPraise.indexOf(item) >= 0,
              };
              praises.push(Item);
            }
          }

          if (criticism) {
            let answerCriticism = '';
            if (answer && answer.criticism) {
              answerCriticism = answer.criticism;
            }
            for (const item in criticism) {
              const Item: DataItem = {
                id: item,
                value: criticism[item],
                checkd: answerCriticism.indexOf(item) >= 0,
              };
              criticisms.push(Item);
            }
          }
          setPraise(praises);
          setCriticism(criticisms);

          if (answer) {
            setStar(answer.star);
            setAdvice(answer.advice);
          }
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    Init();
  }, [clinicNumber]);

  const images = Array.from(Array(5), (val, index) => (
    <img
      src={index + 1 <= star ? xin : noxin}
      key={index}
      className={styles.xin}
      alt="图片"
      onClick={() => {
        onChange(index + 1);
      }}
    />
  ));

  // ，拼接字符串
  const getStr = (str: string, addStr: string) => {
    if (str) {
      return `${str},${addStr}`;
    }
    return addStr;
  };

  // 获取接口入参字符串
  const getPStr = (List: DataItem[]) => {
    let str = '';
    List.map((item: DataItem) => {
      if (item.checkd) {
        str = getStr(str, item.id);
      }
    });
    return str;
  };

  const handleCommit = async () => {
    setLoading(true);
    const params: GetSatisAddParams = {
      star,
      clinicNumber,
      praise: getPStr(praise),
      criticism: getPStr(criticism),
      advice,
    };
    try {
      const { data, errmsg } = await getSatisAdd(params);
      if (data) {
        history.goBack();
      } else {
        Toast.info(errmsg);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Toast.info(error);
    }
  };

  return (
    <Page title="满意度调查" loading={Loading}>
      <div className={styles.content}>
        <WingBlank>
          <div className={styles.starBox}>
            <h1>评分:</h1>
            {images}
          </div>
          <WingBlank>
            <div className={styles.txtBox}>
              <div className={styles.praiseBox}>
                <p>本次就诊中以下服务内容做到请打勾:</p>
                <ul className={styles.ul}>
                  {praise.map((item: DataItem) => (
                    <li key={item.id}>
                      <p>
                        {item.value}
                        <Checkbox
                          className={styles.checkbox}
                          checked={item.checkd}
                          onChange={(value) => handlePraise(value, item.id)}
                        />
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <p>在本次就诊中你最不满意的服务环节请点击标注:</p>
              <p className={styles.criticismBox}>
                {criticism.map((item: DataItem) => (
                  <span
                    onClick={() => handleCriticism(!item.checkd, item.id)}
                    className={item.checkd ? styles.critCheck : styles.crit}
                    key={item.id}>
                    {item.value}
                  </span>
                ))}
              </p>
            </div>

            <p>您的其他意见或者建议:</p>
            <div className={styles.textarea}>
              <TextareaItem
                placeholder="您的其他意见或者建议"
                rows={3}
                count={300}
                value={advice}
                disabled={readOnly}
                onChange={(value) => setAdvice(value || '')}
              />
            </div>
            {!readOnly && (
              <button className={styles.commit} onClick={() => handleCommit()}>
                提交
              </button>
            )}
          </WingBlank>
        </WingBlank>
      </div>
    </Page>
  );
}

export default withRouter(Packet);
