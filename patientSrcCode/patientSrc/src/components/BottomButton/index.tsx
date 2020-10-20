import React from 'react';
import classnames from 'classnames/bind';
import styles from './index.module.scss';

interface IBottomButton {
  content: string;
  className?: string;
  disable?: boolean;
  onClick: () => void;
}

const cx = classnames.bind(styles);

const BottomButton: React.FC<IBottomButton> = (props) => {
  const { content, disable = false, onClick: propsClick, className = '' } = props;

  const onClick = () => {
    if (disable) return;
    propsClick();
  };

  const buttonCls = cx({
    button: true,
    [className]: !!className,
  });

  return (
    <div className={buttonCls} onClick={onClick}>
      {content}
    </div>
  );
};

export default BottomButton;
