import React from 'react';
import styles from './index.module.scss';

interface IBottomPayButton {
  price: number | string;
  onClick: () => void;
  buttonText: string;
  disable?: boolean;
}

const BottomPayButton: React.FC<IBottomPayButton> = (props) => {
  const { price, onClick, buttonText, disable = false } = props;

  const handleOnclick = () => {
    if (disable) {
      return false;
    }
    onClick();
  }

  return (
    <div className={styles.bottomPayButton}>
      <span className={styles.payText}>
        支付金额: <span className={styles.price}>￥{price}</span>
      </span>
      <div className={styles.payButton} onClick={handleOnclick}>
        {buttonText}
      </div>
    </div>
  );
};

export default BottomPayButton;
