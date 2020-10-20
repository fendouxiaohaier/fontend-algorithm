import React, { useState } from 'react';
import Page from '@/components/Page';
import styles from './index.module.scss';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Picker, List, TextareaItem, ImagePicker, Button, Toast } from 'antd-mobile';
import { getQiniuUploadToken } from '@/api/common';
import * as qiniu from 'qiniu-js';
import { requestAddAppeal } from '@/api/feedback';


interface IProps extends RouteComponentProps { id: string };
function DoctorInfo(props: IProps) {
  const { history } = props;
  const [type, setType] = useState([window.location.href.split('add/')[1]]);
  const [describe, setDescribe] = useState('');
  const [files, setFiles] = useState<any>([]);

  const handlePickerChange = (value: any) => {
    setType(value);
  }
  const handleTextChange = (value: any) => {
    console.log(describe)
    setDescribe(value);
  }
  const handleImageChange = async (value: any) => {
    window.console.log(value);
    try {
      Toast.loading('上传中...', 0);
      const { token, domain } = ((await getQiniuUploadToken()) as unknown) as { token: string; domain: string };
      window.console.log(domain)
      const observable = qiniu.upload(value[files.length].file, parseInt((Math.random() * 10000).toString(), 10) + '' + new Date().getTime().toString(), token, {}, {});
      observable.subscribe({
        next(response) {
          window.console.log(response)
          // ...
        },
        error(err) {
          window.console.error(err)
          Toast.info('上传失败,请重试');
        },
        complete(res: any) {
          Toast.hide();
          window.console.log(res)
          setFiles(files.concat({ id: files.length, url: domain + res.key, }));
        },
      });
    } catch (error) {
      console.log(error);
    }
    setFiles(files.concat());
  };

  const handleSubmit = async () => {
    if (describe.length === 0) {
      Toast.info('请描述您遇到的问题', 2);
      return;
    } else if (files.length === 0) {
      Toast.info('请添加相关截图', 2);
      return;
    }
    try {
      const response = await requestAddAppeal({
        type: parseInt(type[0], 10),
        appealContent: describe,
        screenshots: JSON.stringify(files.map((item: any) => item.url)),
      });
      if (response.errcode === 0) {
        setTimeout(() => {
          history.goBack();
        }, 16);
        Toast.info('新建成功！')
      }
    } catch (err) {
      window.console.error(err);
    }
  }
  return (
    <Page title="新建" loading={false} >
      <div className={styles.content} style={{ padding: '15px', boxSizing: 'border-box' }}>
        <Picker
          cols={1}
          data={[{ label: '投诉', value: '1' }, { label: '建议', value: '2' }]}
          value={type}
          onOk={handlePickerChange}
        >
          <List.Item arrow="horizontal">类型</List.Item>
        </Picker>
        <br />
        <TextareaItem
          placeholder="请描述您所遇到的问题，并输入姓名、电话。"
          rows={5}
          count={100}
          value={describe}
          onChange={handleTextChange}
          onBlur={handleTextChange}
        />
        <br />
        <p>请提供相关截图便于客服了解情况({files.length}/9)</p>
        <br />
        <ImagePicker
          files={files}
          onImageClick={(index, fs) => console.log(index, fs)}
          selectable={files.length < 9}
          onChange={(value) => handleImageChange(value)}
          accept="image/*"
          disableDelete
        />
        <br />
        <p style={{ fontSize: '13px', textAlign: 'center', lineHeight: '1.5' }}>
          您的投诉我们会第一时间进行落实，并给予回复。
          <br />
          您的建议我们会根据实际情况清醒改正。
          <br />
          感谢您的配合与支持。
          <br />
          给您造成的不便，尽请谅解。
        </p>
        <br />
        <Button type="primary" onClick={handleSubmit}>提交</Button>
      </div>
    </Page >
  );
}

export default withRouter(DoctorInfo);