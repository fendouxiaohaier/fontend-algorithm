export interface IhomeSourceProps {
  banners: IhomeBannerSource[];
  sections: IhomeSectionSource[];
}

export interface IhomeBannerSource {
  image: string;
}

export interface IhomeSectionSource {
  avatar: string;
  id: number;
  name: string;
  statusDec: string;
  webHospitalId: number;
}
export interface IhospitalSource {
  type: string;
  id: number;
  name: string;
  phone?: string;
  worktime?: {
    amStart: number;
    amEnd: number;
    pmStart: number;
    pmEnd: number;
  };
}
export interface IdoctorListResponseProps {
  data: {
    list: IdoctorResponseProps[];
    more: boolean;
  };
  errcode: number;
  errmsg: string;
}

export interface IdoctorResponseProps {
  name: string;
  intro: string;
  sectionId: number;
  titleId: number;
  sectionName: string;
  imgSwitch?: number;
  imgPrice: number;
  avatar: string;
  hospitalName?: string;
  audioSwitch?: number;
  audioPrice: number;
  videoSwitch?: number;
  videoPrice: number;
  titleName: string;
  id: number;
  isFollow: boolean;
  professionalTechnicalJobTypeText?: string;
  statusText?: string;
  star: string;
  // 问诊量
  serviceCount: number;
}

export interface Irecord {
  id: number;
  appointmentText: {
    date: string;
    hour: string;
  };
  appointmentTime: number;
  createdAt: number;
  doctorName: string;
  hospitalName: string;
  orderType: string;
  orderTypeText: number;
  sectionName: string;
  status: number;
  statusText: string;
}

export interface Idoctor {
  name: string;
  intro: string;
  sectionId: number;
  titleId: number;
  sectionName: number;
  imgSwitch?: number;
  imgPrice?: number;
  audioSwitch?: number;
  audioPrice?: number;
  videoSwitch?: number;
  videoPrice?: number;
  titleName: string;
}

export interface ImyDoctorResProps {
  id: number;
  name: string;
  avatar: string;
  sectionName: string;
  titleId: number;
  hospitalName: string;
  titleName: string;
  statusText: string;
  professionalTechnicalJobTypeText: string;
}

export interface IinquiryDetailResProps {
  appointmentText: { date: string; hour: string };
  date: string;
  hour: string;
  appointmentTime: number;
  clinicNumber: string;
  closed: number;
  createdAt: number;
  doctorId: number;
  doctorName: string;
  file: {
    url: string;
  }[];
  hospitalName: string;
  id: number;
  imId: string;
  orderType: number;
  orderTypeText: string;
  patientName: string;
  question: string;
  realPrice: number;
  sectionName: string;
  status: number;
  statusText: string;
  payTimeLeft: number;
}
