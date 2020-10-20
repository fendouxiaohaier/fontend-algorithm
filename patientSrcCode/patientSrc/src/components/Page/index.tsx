import React, { useEffect, RefObject } from 'react';
import { generateTitle, resetPagePosition } from '@/utils';
import styles from './index.module.scss';
import { TabBar, Toast } from 'antd-mobile';
import { If, Else } from 'react-if';
import HospitalIconActive from '@/assets/common/yiyuan@3x.png';
import HospitalIcon from '@/assets/common/yiyuan2@3x.png';
import MyActive from '@/assets/common/wode@3x.png';
import My from '@/assets/common/wode2@3x.png';
import { withRouter, RouteComponentProps } from 'react-router-dom';
interface IpageProps extends RouteComponentProps {
  loading: boolean;
  title: string | undefined;
  children: any;
  pageRef?: RefObject<HTMLDivElement> | null;
}

const Page: React.FC<IpageProps> = (props) => {
  const {
    title = '',
    loading = false,
    children,
    location: { pathname },
    history,
  } = props;

  const tabBarArray = [
    {
      key: 'hospital',
      url: '/home',
      title: '医院',
      initIcon: HospitalIcon,
      selectedIcon: HospitalIconActive,
    },
    {
      key: 'my',
      url: '/my',
      title: '我的',
      initIcon: My,
      selectedIcon: MyActive,
    },
  ];
  let tabBarUrlArray = [];
  for (const item of tabBarArray) {
    tabBarUrlArray.push(item.url);
  }

  const handleHistory = (url: string) => {
    history.push(url);
  };

  useEffect(() => {
    generateTitle(title);
    return function reset() {
      resetPagePosition();
    };
  }, [title]);

  useEffect(() => {
    if (loading) {
      Toast.loading('页面加载中', 0);
    } else {
      Toast.hide();
    }
  }, [loading]);

  return (
    <div ref={props.pageRef} className={styles.wrapper}>
      <If condition={tabBarUrlArray.includes(pathname)}>
        <div className={styles.tabBarWrapper}>
          <TabBar tintColor="#888888">
            {tabBarArray.map((item: any) => (
              <TabBar.Item
                title={item.title}
                key={item.key}
                onPress={() => handleHistory(item.url)}
                selected={pathname === item.url ? true : false}
                selectedIcon={
                  <div className={styles.iconWrapper}>
                    <img className={styles.icon} src={item.selectedIcon} alt="" />
                  </div>
                }
                icon={
                  <div className={styles.iconWrapper}>
                    <img className={styles.icon} src={item.initIcon} alt="" />
                  </div>
                }>
                {pathname === item.url && children}
              </TabBar.Item>
            ))}
          </TabBar>
        </div>
        <Else>{children}</Else>
      </If>
    </div>
  );
};

export default withRouter(Page);
