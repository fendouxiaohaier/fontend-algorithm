import React, { useState, useEffect } from 'react';
import Page from '@/components/Page';
import styles from './index.module.scss';
import { withRouter } from 'react-router-dom';
import { requestGetAppealDetail } from '@/api/feedback';
import moment from 'moment';
import { List } from 'antd-mobile';
import { Brief } from 'antd-mobile/lib/list/ListItem';

function FeedbackDetail() {
  const [detailInfo, setDetailInfo] = useState();
  useEffect(() => {
    async function getFeedbackDetail() {
      const { data: newData } = await requestGetAppealDetail({ appealId: parseInt(window.location.href.split('/feedback/')[1], 10) });
      setDetailInfo(newData);
    }
    getFeedbackDetail();
  }, [])
  return (
    <Page title='反馈详情' loading={false} >
      <div className={styles.content}>
        {
          detailInfo && <div style={{ padding: '15px' }}>
            <List>
              <List.Item
                key={Math.random()}
              >
                投诉人：<Brief>{detailInfo.patientName}</Brief>
              </List.Item>
              <List.Item
                key={Math.random()}
              >
                投诉时间：<Brief>{moment.unix(detailInfo.createdAt).format('YYYY-MM-DD')}</Brief>
              </List.Item>
              <List.Item
                key={Math.random()}
                multipleLine
              >
                投诉内容<Brief>{detailInfo.appealContent}</Brief>
              </List.Item>
              <List.Item
                key={Math.random()}
                multipleLine
              >
                调查结果<Brief>{detailInfo.finding || '暂无'}</Brief>
              </List.Item>
              <List.Item
                key={Math.random()}
                multipleLine
              >
                处理结果<Brief>{detailInfo.dealResult || '暂无'}</Brief>
              </List.Item>
              <List.Item
                key={Math.random()}
              >
                当前状态<Brief>{detailInfo.statusText}</Brief>
              </List.Item>
            </List>
          </div>
        }
      </div>
    </Page >
  );
}

export default withRouter(FeedbackDetail);
