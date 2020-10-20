import React, { useState, useEffect } from 'react';
import Page from '@/components/Page';
import styles from './index.module.scss';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import gouxuan from '@/assets/common/gouxuan@3x.png';
import weigouxuan from '@/assets/common/weigouxuan@3x.png';
import { getRecipeList } from '@/api/recipe';
import { get } from 'lodash';
import { PresListItem } from '@/api/patient/typing';
import moment from 'moment';

type Props = {} & RouteComponentProps;

function Continuation(props: Props) {
  const {
    match: { params },
    history,
  } = props;
  const [checked, SetChecked] = useState<Map<number, boolean>>(new Map<number, boolean>());
  const [List, setList] = useState<PresListItem[]>([]);
  const [getData, setGetData] = useState(false);

  const getList = async () => {
    const { data } = await getRecipeList(get(params, 'patientId'), get(params, 'doctorId'), 1);
    setList(data);
    setGetData(true);
  };

  useEffect(() => {
    getList();
  }, []);

  const handleChange = (id: number) => {
    const changeCheck = new Map<number, boolean>();
    for (const key of checked.keys()) {
      changeCheck.set(key, checked.get(key) as boolean);
    }
    changeCheck.set(id, !checked.get(id));
    SetChecked(changeCheck);
  };

  const handleGoDetail = (id: number) => {
    history.push(`/recipe-detail/${id}`);
  };

  const handleSend = () => {
    const changeList: PresListItem[] = [];
    List.map((item) => {
      if (checked.get(item.id)) {
        changeList.push(item);
      }
    });
    sessionStorage.setItem('PresList', JSON.stringify(changeList));
    history.goBack();
  };

  return (
    <Page title="复诊续方" loading={!getData}>
      <div className={styles.content}>
        {List && List.length !== 0 && (
          <div className={styles.listBox}>
            <div className={styles.list}>
              {List.map((item) => (
                <div key={item.id} className={styles.itemBox}>
                  <div className={styles.item}>
                    <div className={styles.box}>
                      <label className={styles.checkboxLabel}>
                        <span className={styles.checkbox}>
                          <input type="checkbox" onChange={() => handleChange(item.id)} />
                          <img src={checked.get(item.id) ? gouxuan : weigouxuan} alt="" />
                        </span>
                      </label>
                      <div className={styles.chuf}>
                        <p>
                          {moment(item.createdAt * 1000).format('YYYY/MM/DD')}
                          <span className={styles.red}>处方编号:{item.tranNo}</span>
                        </p>
                        <p>处方签</p>
                        <p className={styles.gray}>诊断: {item.prescription}</p>
                      </div>
                    </div>
                    {item.medication.map((mItem) => (
                      <div key={item.id + mItem.name} className={styles.rpBox}>
                        <div className={styles.rp}>rp</div>
                        <div>
                          <p>药品名称:{mItem.name}</p>
                          <p>
                            规格:{mItem.specification} 数量:{mItem.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                    <p className={styles.see} onClick={() => handleGoDetail(item.id)}>
                      查看处方详情
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.send}>
              <button onClick={handleSend}>发送申请</button>
            </div>
          </div>
        )}
        {List && List.length === 0 && getData && <div className={styles.no}>暂无复诊续方</div>}
      </div>
    </Page>
  );
}

export default withRouter(Continuation);
