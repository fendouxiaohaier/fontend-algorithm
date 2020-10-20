import service from '@/services/request';
import { SERVICE_PANEL } from '@/utils/enums';
import qs from 'qs';

export function getSMSCode({ phone }: { phone: string }) {
  return service.get('/get-sms-code', {
    params: { phone },
  });
}

export function requestLogin(
  data: { phone: string; code: string; hospitalId: number },
  openId: { [index: string]: string }
) {
  return service.post('/login', { ...data, ...openId });
}

export function getCardType() {
  return service.get('/get-card-type');
}

export function getNationType() {
  return service.get('/get-race-list');
}

export function requestAddPatient(payload: {
  name: string;
  cardType: number;
  cardId: string;
  gender: number;
  birthday: string;
  phone: string;
  guardianName: string;
  guardianCardType: number;
  guardianCardId: string;
  code: string;
}) {
  return service.post('/create-patient', payload);
}

export function requestEditPatient(payload: {
  patientId: number;
  name: string;
  cardType: number;
  cardId: string;
  gender: number;
  birthday: string;
  phone: string;
  guardianName: string;
  guardianCardType: number;
  guardianCardId: string;
  code: string;
}) {
  return service.post('/edit-patient', payload);
}

export function getDoctorListFilter(payload: { hospitalId: number }) {
  return service.get('/doctor-list-filter', {
    params: payload,
  });
}

export function getDoctorList(payload: {
  hospitalId: number;
  sectionId?: number;
  titleId?: number;
  inquiryTypeId?: number;
  page: number;
  limit: number;
}) {
  return service.get('/doctor-list', {
    params: payload,
  });
}

export function getQiniuUploadToken() {
  return service.get('/get-upload-token');
}

export function getUserSig(imAccount: string) {
  return service.get('/get-sig', {
    params: { user: imAccount },
  });
}

export function getUserInfo() {
  return service.get('/get-login-user-info');
}

export function createGroup(inquiryId: number) {
  return service.get('/create-im-group-for-inquiry', {
    params: { inquiryId },
  });
}

export function getHistoryIMMessage(groupId: string, lastSequence?: number) {
  return service.get('/get-group-msg', {
    params: { groupId, reqMsgSeq: lastSequence },
  });
}

export function createInquiryOrder(params: {
  patientId: number;
  question: string;
  price: number;
  orderType: SERVICE_PANEL;
  webHospitalId: number;
  doctorId: number;
  appointmentTime: number;
  sectionId: number;
}) {
  return service.post('/create-inquiry', qs.stringify(params), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export interface CreatePrePayParams {
  inquiryId?: number;
  business: string;
  doctorId?: number;
}

export function createPrePayInquiryOrder(params: CreatePrePayParams) {
  return service.get('/create-pre-order', {
    params,
  });
}

export function createFreeInquiryOrder(params: {inquiryId: number}) {
  return service.get('/free-order', {params,});
}

export interface OrderPaySuccess {
  inquiryId?: number;
  business: string;
  followId?: number;
}

export function inquiryOrderPaySuccess(params: OrderPaySuccess) {
  return service.get('/order-pay-success', {
    params,
  });
}

export function cancelInquiry(inquiryId: number) {
  return service.get('/patient/cancel-inquiry', {
    params: { inquiryId },
  });
}

export function cancelPay(inquiryId: number) {
  return service.get('/patient/cancel-pay', {
    params: { inquiryId },
  });
}

export function requestDeletePatient(payload: {
  patientId: number;
}) {
  return service.post('/delete-patient', payload);
}

