import service from '@/services/request';
import { GetInitParams, GetSatisAddParams } from '@/api/satisfaction/typing';
import qs from 'qs';

/*
 *
 *满意度调查--初始化数据
 *http://yapi.int.medlinker.com/project/171/interface/api/5285
 *
 */
export function getInit(params: GetInitParams) {
  return service.get('/satis/detail', {
    params,
  });
}

/*
 *
 *满意度调查--新增
 *http://yapi.int.medlinker.com/project/171/interface/api/5288
 *
 */
export function getSatisAdd(params: GetSatisAddParams) {
  return service.post('/satis/add', qs.stringify(params), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
