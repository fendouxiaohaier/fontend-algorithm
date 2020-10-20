import React from 'react';
import styles from './index.module.scss';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { IhomeSourceProps, IhomeSectionSource } from '@/types/api/doctorManage';
import { WingBlank, WhiteSpace } from 'antd-mobile';
import { get } from 'lodash';
import { encryptObj } from '@/utils';

interface IdepartmentProps extends RouteComponentProps {
  dataSource: IhomeSourceProps['sections'];
}

const Department: React.FC<IdepartmentProps> = (props) => {
  const { dataSource, history } = props;

  const handleSectionClick = (id: number) => {
    history.push('/online-clinic?section=' + encryptObj({ section: id }));
  };

  return (
    <div className={styles.departmentWrapper} style={{paddingTop: '15px'}}>
      <WingBlank className={styles.wingBlank}>
        {dataSource.map((item: IhomeSectionSource, index: number) => (
          <div key={index} onClick={() => handleSectionClick(item.id)} className={styles.departmentItem}>
            <img className={styles.departmentImage} src={get(item, 'avatar')} alt="" />
            <span className={styles.title}>{get(item, 'name')}</span>
          </div>
        ))}
      </WingBlank>
      <WhiteSpace />
    </div>
  );
};

export default withRouter(Department);
