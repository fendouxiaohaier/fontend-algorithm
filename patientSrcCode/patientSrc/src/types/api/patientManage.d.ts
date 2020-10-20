export interface Ipatient {
  id: number;
  name: string;
  phone: string;
  cardId: string;
  cardTypeText: string
  guardianCardTypeText: string
}

export interface IuserInfo {
  avatar: string
  id: number
  imAccount: string
  phone: string
  userName: string
  webHospitalId: number
}
