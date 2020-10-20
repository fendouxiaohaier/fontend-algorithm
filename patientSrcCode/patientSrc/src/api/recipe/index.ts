import service from '@/services/request';

export function getRecipeList(patientId: number, doctorId?: number, source?: number) {
  return service.get('/patient/pres', {
    params: { patientId, doctorId, source },
  });
}

export function getRecipeDetail(presId: number) {
  return service.get('/patient/pres-detail', {
    params: { presId },
  });
}

export function jumpToMedStore(presId: number) {
  return service.get('/jump-to-med-store', {
    params: { presId },
  });
}
