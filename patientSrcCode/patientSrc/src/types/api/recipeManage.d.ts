export interface IrecipeListResProps extends ResponseData {
  data: IrecipeCaseProps[];
}

export interface IrecipeListCaseProps {
  doctorAvatar: string;
  doctorName: string;
  id: number;
  medication: ImedicationListCaseProps[];
  status: number;
  statusText: string;
  tranNo: string;
}

export interface ImedicationListCaseProps {
  name: string;
  prescriptionId: number;
  quantity: number;
  specification: string;
}

export interface IrecipeDetailCaseProps extends ResponseData {
  data: IrecipeDetailCaseProps;
}

export interface IrecipeDetailCaseProps {
  hospitalName: string;
  hospitalStamp: string;
  status: number;
  createdAt: string;
  sectionName: string;
  prescription: string;
  transNo: string;
  patientName: string;
  patientGender: number;
  patientAge: number;
  doctorName: string;
  dispensing: string;
  pharmacist: string;
  statusText: string;
  payType: string;
  doctorSignImg: string;
  prescriptionTypeText: string;
  medication: ImedicationDetailCaseProps[];
}

export interface ImedicationDetailCaseProps {
  name: string;
  specification: string;
  quantity: number;
  perUseDose: string;
  frequencyName: string;
  useMethodName: string;
  usage: string;
  packUnit: string;
}
