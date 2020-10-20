import React from 'react';
import Page from '@/components/Page';
import styles from './index.module.scss';
import { withRouter } from 'react-router-dom';
import Doc from './doc';

function DoctorInfo() {
  const x = parseInt(window.location.href.split('/detail/')[1].split(',')[0], 10) - 1;
  const y = parseInt(window.location.href.split('/detail/')[1].split(',')[1], 10) - 1;

  window.console.log(x)
  window.console.log(y)
  const detail = Doc[x].list[y];
  return (
    <Page title={detail.name} loading={false} >
      <div className={styles.content}>
        <h2 style={{ lineHeight: '1.5', padding: "15px", color: '#333', paddingTop: '30px' }}>
          {detail.name}?
        </h2>
        <p style={{ lineHeight: '1.8', padding: "15px" }}>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{detail.desc}
        </p>
        <p style={{ textAlign: 'center', fontSize: '12px', position: 'absolute', bottom: '30px', width: '100vw' }}>如未解决问题，请联系客服</p>
        <p style={{ textAlign: 'center', fontSize: '12px', position: 'absolute', bottom: '5px', width: '100vw' }}>021-34293243</p>
      </div>
    </Page >
  );
}

export default withRouter(DoctorInfo);
