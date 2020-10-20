import React, { useState, useEffect } from 'react';
import { getQiniuUploadToken } from '@/api/common';
import { ImagePicker, Toast, ActivityIndicator } from 'antd-mobile';
import differenceBy from 'lodash/differenceBy';
import * as qiniu from 'qiniu-js';
interface IimageUpload {
  onChange?: (files: any) => void;
  files: any[];
  length?: any;
  selectable?: any;
  disableDelete?: any;
}

interface IimageFiles {
  file: {
    lastModified: number,
    lastModifiedDate: Date,
    name: string,
    path: string,
    type: string,
    size: number,
  },
  orientation: number,
  url: string,
}

const ImageUpload: React.FC<IimageUpload> = (props) => {
  const { onChange: onPropsChange = () => { }, files } = props;
  const [imgUploadArray, setImgUploadArray] = useState<IimageFiles[]>([]);
  const [token, setToken] = useState<string>('');
  const [domain, setDomain] = useState<string>('');
  const [batchImage, setBatchImage] = useState<IimageFiles | null>(null);
  const [animating, setAnimating] = useState<boolean>(false);

  const fetchQiniuToken = async () => {
    try {
      const { token, domain } = await getQiniuUploadToken() as unknown as { token: string, domain: string };
      setToken(token);
      setDomain(domain);
    } catch (error) {
      console.log(error);
    }

  };

  useEffect(() => {
    if (files.length > 0) {
      setImgUploadArray(files);
    }
    fetchQiniuToken();
  }, []);

  useEffect(() => {
    if (batchImage) {
      const newArray = [...imgUploadArray, batchImage];
      setImgUploadArray(newArray);
      onPropsChange(newArray);
      setBatchImage(null);
    }
  }, [batchImage]);

  useEffect(() => {
    onPropsChange([...imgUploadArray]);
  }, [imgUploadArray]);

  const uploadImage = (file: any) => {
    const observable = qiniu.upload(file.file, file.file.name, token, {}, {});
    const observer = {
      next() {
        //...
      },
      error() {
        setAnimating(false);
        Toast.info('上传失败，请重新上传');
      },
      complete(res: any) {
        setAnimating(false);
        setBatchImage({ ...file, url: domain + res.key });
      },
    };
    observable.subscribe(observer);
  };
  const onChange: (files: {}[], type: string, index?: number) => void = (files: {}[], type: string, index?: number) => {
    if (type === 'add') {
      setAnimating(true);
      const diff = differenceBy(files, imgUploadArray, 'url');
      diff.forEach(uploadImage);
    } else if (type === 'remove') {
      imgUploadArray.splice(index as number, 1);
      setImgUploadArray([...imgUploadArray]);
    }
  };

  return (
    <>
      <ActivityIndicator animating={animating} toast text="正在上传图片" />
      <ImagePicker {...props} files={imgUploadArray} onChange={onChange} multiple />
    </>
  );
};

export default ImageUpload;
