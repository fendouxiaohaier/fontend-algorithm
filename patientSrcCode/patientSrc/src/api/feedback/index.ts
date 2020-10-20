import service from '@/services/request';

export interface AddAppealParams {
  appealContent: string;
  screenshots: string;
  type: number;
}

export function getHomeData(hospitalId: number) {
  return service.get('/index', {
    params: { hospitalId },
  });
}

/**
 * 投诉与建议--列表
 * http://yapi.int.medlinker.com/project/171/interface/api/5270
 */
export function requestGetAppealList() {
  return service.get('/appeal/list');
}

/**
 * 投诉与建议--新增
 * http://yapi.int.medlinker.com/project/171/interface/api/5273
 */
export function requestAddAppeal(data: AddAppealParams) {
  return service.post('/appeal/add', data);
}

/**
 * 投诉与建议--详情
 * http://yapi.int.medlinker.com/project/171/interface/api/5276
 */
export function requestGetAppealDetail(params: { appealId: number }) {
  return service.get('/appeal/detail', {
    params,
  });
}
