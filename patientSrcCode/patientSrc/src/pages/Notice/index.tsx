import React from 'react';
import Page from '@/components/Page';
import styles from './index.module.scss';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import notice from '@/assets/common/notice.jpg';

type Props = {} & RouteComponentProps;

function Continuation(props: Props) {
  const { history } = props;

  const handleGo = () => {
    history.push('/home');
  };

  return (
    <Page title="乌鲁木齐市第四人民医院医联互联网医院" loading={false}>
      <div className={styles.content}>
        <img className={styles.notice} src={notice} alt="图片" />
        <p>1、根据国家相关规定，乌鲁木齐市第四人民医院医联互联网医院服务仅限诊断明确、病情稳定的慢性病的我院复诊患者。初诊和急诊患者请到医院就诊。</p>
        <p>2、如遇医生特殊情况，在患者问诊后未接诊，系统将在24小时后自动退还相应费用。</p>
        <p>3、请留意医生的网络就诊邀请，未对医生发起的网络邀请进行应答，或持续超过10分钟未应答，医生有权停止本项服务。</p>
        <p>4、如需复诊续方，请确认复诊身份并提供详细病情资料；问诊结束后处方审核通过即可在线购药。</p>
        <p>5、暂不支持开具检查检验单、治疗单等服务。</p>
        <p>6、需提供患者身份证实名认证，患者需如实填写姓名、性别、年龄、身份证号、电话号码。</p>
        <div className={styles.line}></div>
        <p>最后，希望患者就医能相互信任，医生患者共同对付疾病，并祝大家早日康复！</p>
        <div style={{ height: '50px' }}></div>
        <div className={styles.send} onClick={() => handleGo()}>
          确认进入
        </div>
      </div>
    </Page>
  );
}

export default withRouter(Continuation);
