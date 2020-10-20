import service from '@/services/request';

export function getHomeData(hospitalId: number) {
  return service.get('/index', {
    params: { hospitalId },
  });
}

export function getHomeDoctors(hospitalId: number, page: number, limit: number = 10) {
  return service.get('/index-doctor', {
    params: { hospitalId, page, limit },
  });
}
