import React from 'react';
import styles from './index.module.scss';
import { withRouter, RouteComponentProps } from 'react-router-dom';

interface IrecipeProps extends RouteComponentProps {
  content: {
    clinicNumber: string;
    createdAt: string;
    dispensing: string;
    doctorId: number;
    drugs: {
      days: number;
      doseUnit: string;
      drugId: number;
      frequencyName: string;
      frequencyRemark: string;
      name: string;
      perUseDose: number;
      quantity: number;
      specification: string;
      tradeName: string;
      useMethodName: string;
    }[];
    id: number;
    inquiryId: number;
    patientAge: number;
    patientBirthday: string;
    patientGender: number;
    patientId: number;
    patientIdCertNumber: string;
    patientName: string;
    patientPhone: string;
    pharmacist: string;
    prescription: string;
    prescriptionTypeText: string;
    sectionId: number;
    status: number;
    statusText: string;
    transNo: string;
    updatedAt: string;
    webHospitalId: number;
  };
}
const RecipeMessage: React.FC<IrecipeProps> = (props) => {
  const { history, content } = props;
  const handlePrescription = (id: number) => {
    history.push(`/recipe-detail/${id}`);
  };
  return (
    <div className={styles.prescription}>
      <div className={styles.title}>
        <span>处方笺</span>
        <span className={styles.transNo}>处方编号:{content.transNo}</span>
      </div>
      <div className={styles.result}>诊断：{content.prescription}</div>
      <div className={styles.prescriptionList}>
        <div className={styles.tag}>RP</div>
        <div className={styles.list}>
          <ul>
            {content.drugs.map((v: any) => (
              <li key={v.drugId + v.name}>
                <p className={styles.name}>
                  {v.name} {v.specification}
                </p>
                <p className={styles.method}>
                  {v.useMethodName},{v.frequencyRemark},{v.perUseDose}
                  {v.doseUnit}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.details} onClick={() => handlePrescription(content.id)}>
        点击查看处方详情
      </div>
    </div>
  );
};

export default withRouter(RecipeMessage);
