import React, { useState, useEffect } from 'react';
import Page from '@/components/Page';
import styles from './index.module.scss';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { requestGetAppealList } from '@/api/feedback';
import { List, Button, ActionSheet } from 'antd-mobile';
import { Brief } from 'antd-mobile/lib/list/ListItem';
import moment from 'moment';

interface IProps extends RouteComponentProps { id: string };

const FeedbackList = (props: IProps) => {
  const { history } = props;
  const [list, setList] = useState([]);
  useEffect(() => {
    async function getFeedbackList() {
      const { data: newData } = await requestGetAppealList();
      setList(newData);
    }
    getFeedbackList();
  }, []);
  const showActionSheet = () => {
    const BUTTONS = ['投诉', '建议', '取消'];
    ActionSheet.showActionSheetWithOptions({
      options: BUTTONS,
      cancelButtonIndex: BUTTONS.length - 1,
      title: '选择你要反馈的内容',
      maskClosable: true,
    },
    (buttonIndex) => {
      if (buttonIndex === 0) {
        history.push('/helpCenter/feedback/add/1');
      } else if (buttonIndex === 1) {
        history.push('/helpCenter/feedback/add/2');
      }
    });
  }
  return (
    <Page title="投诉和建议" loading={false} >
      <div className={styles.content}>
        <List>
          {list && list.length > 0 ? list.map((item: any) => {
            return (<List.Item key={item.id} style={{ borderTop: '1px solid #f6f6f6' }} arrow="horizontal" onClick={() => history.push('/helpCenter/feedback/' + item.id)}>
              {item.typeText}
              <Brief>{item.appealContent}</Brief>
              <div style={{ position: 'absolute', top: '8px', right: '45px', fontSize: '12px', color: "#999" }}>{moment.unix(parseInt(item.createdAt, 10)).format('YYYY-MM-DD')} {item.statusText}</div>
            </List.Item>)
          })
            : <div style={{ width: '100vw', textAlign: 'center', lineHeight: '3', background: '#f6f6f6' }}>你还没提交投诉和建议</div>}
        </List>
        <div style={{ position: 'absolute', bottom: '0', height: '45px', width: '100vw' }}>
          <Button type="primary" style={{ width: '90vw', marginLeft: '5vw', bottom: '5vw' }} onClick={showActionSheet}>
            新建
          </Button>
        </div>
      </div>
    </Page >
  );
}

export default withRouter(FeedbackList);
