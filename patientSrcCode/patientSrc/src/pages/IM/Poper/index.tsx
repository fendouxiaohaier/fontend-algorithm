import React from 'react';
import classnames from 'classnames/bind';
import styles from './index.module.scss';
import DefaultAvatar from '@/assets/common/morentouxiang@3x.png';
interface Props {
  //children: React.ReactElement | React.ReactElement[];
  mode: 'self' | 'target';
  data: {
    avatar: string;
    name: string;
  };
  content: any
}

const cx = classnames.bind(styles);

function Poper(props: Props) {
  const {
    mode = 'target',
    data: { avatar, name },
  } = props;

  const poperCls = cx({
    poper: mode === 'target',
    poperRight: mode === 'self',
  });
  const containerCls = cx({
    poperContainer: true,
    right: mode === 'self',
  });
  const wrapperCls = cx({
    poperContentWrapper: true,
    right: mode === 'self',
  });
  const nameCls = cx({
    name: true,
    right: mode === 'self',
  });
  return (
    <div className={containerCls}>
      <p className={styles.avatar} style={{ backgroundImage: `url(${avatar || DefaultAvatar})` }}></p>
      <div className={wrapperCls}>
        <div className={nameCls}>{name}</div>
        <div className={poperCls}>{props.content}</div>
      </div>
    </div>
  );
}

export default Poper;
