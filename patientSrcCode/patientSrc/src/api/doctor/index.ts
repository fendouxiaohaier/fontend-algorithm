import service from '@/services/request';

export function getDoctorDetail(id: number) {
  return service.get('/doctor-detail', {
    params: { doctorId: id },
  });
}
