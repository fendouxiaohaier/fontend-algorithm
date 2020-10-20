import React, { useState, useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Picker, List } from 'antd-mobile';
import styles from './index.module.scss';
import { getMyPatients } from '@/api/patient';
import { get } from 'lodash';
import { stringEncryptWithSnow } from '@/utils';
import { Ipatient } from '@/types/api/patientManage';

interface IMenuListProps extends RouteComponentProps {
  onChange: (patientId: number) => void;
}

interface Isource {
  value: number;
  label: string;
}

function MenuList(props: IMenuListProps) {
  const { onChange, history } = props;
  const [source, setSource] = useState<Isource[]>([]);
  const [currentPatientId, setCurrentPatientId] = useState<number>();

  useEffect(() => {
    const fetchMyPatient = async () => {
      try {
        const { data } = await getMyPatients();
        const source = data.map((item: Ipatient) => {
          return {
            value: item.id,
            label: `${item.name} ${stringEncryptWithSnow(item.cardId)}`,
          };
        });

        setSource(source);
        setCurrentPatientId(get(data, [0, 'id']));
      } catch (error) {
        console.log(error);
      }
    };
    fetchMyPatient();
  }, []);

  const initformat = (value: any) => {
    if (value.length > 0) {
      onChange(currentPatientId as number);
      return value.join(',').split(' ')[0];
    }
  };
  const handleChange = (value: any) => {
    setCurrentPatientId(Number(value.join(',')));
  };

  const handleAddpatient = () => {
    history.push('/my-patient/add');
  };

  const AddPatient = () => (
    <div className={styles.addPatient} onClick={handleAddpatient}>
      +选择就诊人
    </div>
  );
  const SelectPatient = () => (
    <List>
      <Picker data={source} value={[currentPatientId as number]} format={initformat} cols={1} onChange={handleChange}>
        <List.Item arrow="horizontal">选择就诊人</List.Item>
      </Picker>
    </List>
  );
  return <div className={styles.menuListWrapper}>{currentPatientId ? <SelectPatient /> : <AddPatient />}</div>;
}

export default withRouter(MenuList);
