declare module 'tim-js-sdk';
declare module 'cos-js-sdk-v5';
declare module 'weixin-js-sdk';
declare module 'react-wx-images-viewer';



interface ResponseData<T = any> {
  errcode: number;
  data: T;
  errmsg: string;
}

interface ListReqProps {
  page: number;
  limit: number;
}