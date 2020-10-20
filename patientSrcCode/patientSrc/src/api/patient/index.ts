import service from '@/services/request';
import { GetSurplusParams, GetHistorySIMMParams } from './typing';

export function getMyPatients() {
  return service.get('/my-patients');
}

export function getMyInquiries(id: number) {
  return service.get('/patient/inquiry', {
    params: { patientId: id },
  });
}

export function getPatientDetail(id: number) {
  return service.get('/patient-detail', {
    params: { patientId: id },
  });
}

export function getPatientRecordDetail(id: number) {
  return service.get('/patient/inquiry-detail', {
    params: { inquiryId: id },
  });
}

export function getAppointTime(doctorId: number) {
  return service.get('/patient/get-appoint-time', {
    params: { doctorId },
  });
}

export function FollowDoctor(doctorId: number) {
  return service.get('/patient/follow-doctor', {
    params: { doctorId },
  });
}

export function UnFollowDoctor(doctorId: number) {
  return service.get('/patient/un-follow-doctor', {
    params: { doctorId },
  });
}

export function getMyDoctorList() {
  return service.get('/patient/my-doctor');
}

export function getMyDrugOrder() {
  return service.get('my-drug-order');
}

/*
 *
 *随诊-获取剩余回合数
 *http://yapi.int.medlinker.com/project/171/interface/api/4985
 *
 */
export function getSurplus(params: GetSurplusParams) {
  return service.get('/follow/surplus-chat-bout', { params });
}

/*
 *
 *随诊-获取单聊历史消息
 *http://yapi.int.medlinker.com/project/171/interface/api/4991
 *
 */
export function getHistorySingleIMMessage(params: GetHistorySIMMParams) {
  return service.get('/get-c2c-msg', { params });
}

/*
 *
 *问诊-患者问诊列表
 *http://yapi.int.medlinker.com/project/171/interface/api/5387
 *
 */
export function getInquiryListe() {
  return service.get('/patient/inquiry-list');
}
