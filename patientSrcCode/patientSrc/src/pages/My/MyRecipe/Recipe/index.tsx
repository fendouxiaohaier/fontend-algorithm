import React from 'react';
import styles from './index.module.scss';
import { genderTransformer, timeConversion } from '@/utils';
import StampChecking from '@/assets/common/stampChecking.png';
import StampChecked from '@/assets/common/stampChecked.png';
import StampRejected from '@/assets/common/stampRejected.png';
import StampUsed from '@/assets/common/stampUsed.png';
import StampInvalid from '@/assets/common/stampInvalid.png';
import { RECIPE_STATUS } from '@/utils/enums';
import BottomButton from '@/components/BottomButton';
import { IrecipeDetailCaseProps, ImedicationDetailCaseProps } from '@/types/api/recipeManage';
import { Toast } from 'antd-mobile';
import { jumpToMedStore } from '@/api/recipe';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { get } from 'lodash';


const StampCreator = ({ status }: { status: number }) => {
  let finalStampImg: string = StampChecked;

  switch (status) {
    case RECIPE_STATUS.CHECKING:
      finalStampImg = StampChecking;
      break;
    case RECIPE_STATUS.CHECKED:
      finalStampImg = StampChecked;
      break;
    case RECIPE_STATUS.REJECTED:
      finalStampImg = StampRejected;
      break;
    case RECIPE_STATUS.USED:
      finalStampImg = StampUsed;
      break;
    case RECIPE_STATUS.INVALID:
      finalStampImg = StampInvalid;
      break;
    default:
      break;
  }

  return <img className={styles.stamp} src={finalStampImg} alt="" />;
};

type Irecipe = IrecipeDetailCaseProps & RouteComponentProps;


const Recipe: React.FC<Irecipe> = (props) => {

  const {
    match: { params },
    hospitalName,
    hospitalStamp,
    status,
    createdAt,
    sectionName,
    prescription,
    transNo,
    patientName,
    patientGender,
    patientAge,
    dispensing,
    pharmacist,
    payType,
    medication,
    doctorSignImg,
  } = props;

  const handleOnClick = () => {
    const getBuyMedUrl = async () => {
      try {
        const { data } = await jumpToMedStore(get(params, 'id'));
        window.location.href = data.url;
      } catch (error) {
        Toast.info(error.message);
      }

    }
    getBuyMedUrl();
  }


  return (
    <div className={styles.recipePanel}>
      {/* <div className={styles.stampPanel}>
        <StampCreator status={status} />
      </div> */}
      <div className={styles.type}>普通</div>
      <div className={styles.title}>{hospitalName}</div>
      <div className={styles.subtitle}>电子处方笺</div>
      <div className={styles.tagLine}>
        <span className={styles.transNo}>NO.{transNo}</span>
        <span className={styles.time}>{timeConversion(createdAt, 'YYYY-MM-DD')}</span>
      </div>
      <div className={styles.patientLineWrapper}>
        <div className={styles.patientLine}>
          <span className={styles.patientData}>姓名: {patientName}</span>
          <span className={styles.patientData}>性别: {genderTransformer(patientGender)}</span>
          <span className={styles.patientData}>年龄: {patientAge}</span>
        </div>
        <div className={styles.patientLine}>
          <span className={styles.patientData}>费别: {payType}</span>
          <span className={styles.patientData}>科别: {sectionName}</span>
        </div>
        <div className={styles.patientLine}>
          <span className={styles.patientData}>临床诊断: {prescription}</span>
        </div>
      </div>
      <div className={styles.medicationWrapper}>
        <div className={styles.rp}>Rp:</div>
        {medication && medication.map((drug: ImedicationDetailCaseProps, index: number) => (
          <div key={index} className={styles.drugPanel}>
            <div className={styles.drugTitle}>
              {index + 1}.{drug.name}
            </div>
            <div className={styles.drugIntro}>规格: {drug.specification}</div>
            <div className={styles.drugIntro}>用法用量:{drug.usage}</div>
            <div className={styles.drugIntro}>数量: {drug.quantity}{drug.packUnit}</div>
          </div>
        ))}
      </div>
      <div className={styles.checker}>
        {/* <img className={styles.hospitalStamp} src={hospitalStamp} alt="" /> */}
        <div className={styles.doctorIntro}>
          处方医师: <img className={styles.doctorSign} src={doctorSignImg} />
        </div>
        <div className={styles.doctorIntro}>
          审核药师: <img className={styles.doctorSign} src={pharmacist} />
        </div>
        <div className={styles.doctorIntro}>
          审核/调配: <span className={styles.doctorSign} />
        </div>
        <div className={styles.doctorIntro}>
          审核/发药: <span className={styles.doctorSign} />
        </div>
      </div>
      <div className={styles.notice}>
        <div>特别提示</div>
        <div className={styles.noticeText}>1、处方有效期为3天，请及时取药。</div>
        <div className={styles.noticeText}>2、本处方限于{hospitalName}使用，自行下载配药不具有处方效力。</div>
        <div className={styles.noticeText}>
          3、按照卫生部、国家中医药管理局卫医发[2002]24号文件规定：为保证患者用药安全，药品一经发出，不得退换。
        </div>
      </div>
      {status === RECIPE_STATUS.CHECKED && <BottomButton content="去购药" onClick={handleOnClick} />}
    </div>
  );
};

export default withRouter(Recipe);
