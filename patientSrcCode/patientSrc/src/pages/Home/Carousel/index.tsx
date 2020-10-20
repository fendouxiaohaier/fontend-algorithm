import React from 'react';
import { Carousel } from 'antd-mobile';
import { IhomeBannerSource, IhomeSourceProps } from '@/types/api/doctorManage';
import styles from './index.module.scss';
import { get } from 'lodash';

interface IcarouselPanelProps {
  dataSource: IhomeSourceProps['banners']
}

const CarouselPanel: React.FC<IcarouselPanelProps> = (props) => {
  const { dataSource } = props;

  return (
    <Carousel autoplay infinite dots={dataSource.length > 1}>
      {dataSource.map((item: IhomeBannerSource, index: number) => {
        return (
          <img
            key={index}
            src={get(item, 'image')}
            alt=""
            className={styles.image}
            onLoad={() => {
              window.dispatchEvent(new Event('resize'));
            }}
          />
        );
      })}
    </Carousel>
  );
}

export default CarouselPanel