import service from '@/services/request';

export function getAuthUrl(data: { hospitalId: number, url: string }) {
  return service.get('/get-auth-url', { params: data });
}

export function getOpenId(name: string, search: string) {
  return service.get(`/get-open-id${search}&name=${name}`);
}
