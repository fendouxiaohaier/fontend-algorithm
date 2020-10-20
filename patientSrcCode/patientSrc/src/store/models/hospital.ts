import service from '@/services/request';
import { IhospitalSource } from '@/types/api/doctorManage';
import { get } from 'lodash';
import { Toast } from 'antd-mobile';

const initHospitalSource = (
  id: number,
  name: string,
  phone: string,
  worktime?: { amStart: number; amEnd: number; pmStart: number; pmEnd: number }
) => {
  return {
    type: 'HOSPITALID',
    id: id,
    name: name,
    phone: phone,
    worktime: worktime,
  };
};

export function reduceHospitalSource(
  state: IhospitalSource = initHospitalSource(0, '', '', undefined),
  action: IhospitalSource
) {
  switch (action.type) {
    case 'HOSPITALID':
      return action;
    default:
      return state;
  }
}

export const getHospitalSource = (domain: string = get(location.host.split('-'), [0]) as string) => {
  return async function(
    dispatch: (action: {
      type: string;
      id: number;
      name: string;
      phone: string;
      worktime: { amStart: number; amEnd: number; pmStart: number; pmEnd: number } | undefined;
    }) => void
  ) {
    try {
      const { data } = await service.get('/hospital-info', { params: { domain } });
      dispatch(initHospitalSource(get(data, 'id'), get(data, 'name'), get(data, 'phone'), get(data, 'worktime')));
    } catch (error) {
      Toast.info(error.message);
    }
  };
};
