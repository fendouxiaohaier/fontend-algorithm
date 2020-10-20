import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { encryptObj } from '@/utils';
import { SERVICE_PANEL } from '@/utils/enums';
import styles from './index.module.scss';
import ZhiNeng from '@/assets/common/zhinengdaozhen@3x.png';
import TuWen from '@/assets/common/tuwenwenzhen@3x.png';
import YuYin from '@/assets/common/yuyinwenzhen@3x.png';
import ShiPin from '@/assets/common/shipinwenzhen@3x.png';
import { WhiteSpace, WingBlank } from 'antd-mobile';
interface IsectionProps {
  title: string;
  content: string;
  style: object;
  image: string;
  handleOnclick: () => void;
}

const SectionPanel: React.FC<RouteComponentProps> = (props) => {
  const { history } = props;

  const handleSectionClick = (type: number) =>
    history.push('/online-clinic?section=' + encryptObj({ inquiryType: type }));

  const SectionPanelSource = [
    {
      title: '智能辅导',
      image: ZhiNeng,
      content: '挂号咨询引导',
      style: {
        background: '#EBF3FF',
        borderRadius: '8px 0 0 0',
        color: '#4585F5',
      },
      handleOnclick: () => {
        window.location.href = '//fz.baidu.com/view.html?id=1DFDXPXKB';
      },
    },
    {
      title: '图文咨询',
      image: TuWen,
      content: '快速挂号 网上就诊',
      style: {
        background: '#EDEBFE',
        borderRadius: '0 8px 0 0',
        color: '#795FE6',
      },
      handleOnclick: () => handleSectionClick(SERVICE_PANEL.TU_WEN_ZI_XUN),
    },
    {
      title: '语音咨询',
      image: YuYin,
      content: '快速沟通 保障隐私',
      style: {
        background: '#E5FCF7',
        borderRadius: '0 0 0 8px',
        color: '#28B099',
      },
      handleOnclick: () => handleSectionClick(SERVICE_PANEL.YU_YIN_ZI_XUN),
    },
    {
      title: '视频咨询',
      image: ShiPin,
      content: '视频就诊 方便快捷',
      style: {
        background: '#FEF4E0',
        borderRadius: '0 0 8px 0',
        color: '#F28E45',
      },
      handleOnclick: () => handleSectionClick(SERVICE_PANEL.SHI_PIN_ZI_XUN),
    },
  ];

  return (
    <div className={styles.sectionPanel}>
      <WingBlank>
        <WhiteSpace />
        <div className={styles.sectionWrapper}>
          {SectionPanelSource.map((item: IsectionProps, index: number) => (
            <div key={index} style={item.style} className={styles.section} onClick={item.handleOnclick}>
              <img className={styles.icon} src={item.image} alt="" />
              <div className={styles.sectionText}>
                <span className={styles.sectionTitle}>{item.title}</span>
                <span className={styles.sectionContent}>{item.content}</span>
              </div>
            </div>
          ))}
        </div>
        <WhiteSpace />
      </WingBlank>
    </div>
  );
};

export default withRouter(SectionPanel);
