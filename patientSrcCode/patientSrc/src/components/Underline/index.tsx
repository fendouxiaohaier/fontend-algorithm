import React from 'react';
import classnames from 'classnames/bind';
import styles from './index.module.scss';

interface Props {
  className?: string;
}

const cx = classnames.bind(styles);

function Underline(props: Props) {
  const { className = '' } = props;
  const lineCls = cx({
    underline: true,
    [className]: !!className,
  });
  return <div className={lineCls} />;
}

export default Underline;
