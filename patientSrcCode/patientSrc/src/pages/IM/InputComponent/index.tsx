import React, { useState, useRef } from 'react';
import SendImage from '@/assets/common/imgupload.png';
import styles from './index.module.scss';
import { set } from 'lodash';
interface Props {
  onSend: (value: string) => void;
  onUpload: (value: any) => void;
  onBlur: () => void;
  onFocus: () => void;
}

function InputComponent(props: Props) {
  const { onSend, onUpload: onPropsUpload, onBlur, onFocus } = props;

  const [inputValue, setInputValue] = useState<string>('');
  const inputFileRef = useRef(null);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    //@ts-ignore
    onPropsUpload(e.target.files[0]);
    set(inputFileRef.current!, 'value', '')
  };

  return (
    <div className={styles.inputComponent}>
      <input ref={inputFileRef} onChange={onUpload} type="file" accept="image/*" className={styles.inputFile} />
      <img
        className={styles.uploadIcon}
        src={SendImage}
        onClick={() => {
          //@ts-ignore
          inputFileRef.current && inputFileRef.current!.click();
        }}
      />
      <input
        type="text"
        value={inputValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange(e)}
        className={styles.input}
        onBlur={onBlur}
        onFocus={onFocus}
      />
      <div
        className={styles.btn}
        onClick={() => {
          onSend(inputValue);
          setInputValue('');
        }}>
        发送
      </div>
    </div>
  );
}

export default InputComponent;
