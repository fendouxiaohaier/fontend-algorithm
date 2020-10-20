import React, { useState, useEffect } from 'react';
import { getUrlParam, getPrice } from '@/utils';
import { Button, Toast } from 'antd-mobile';
import Page from '@/components/Page';
import wx from 'weixin-js-sdk';
import { createPrePayInquiryOrder, inquiryOrderPaySuccess, CreatePrePayParams, OrderPaySuccess } from '@/api/common';
import { withRouter, RouteComponentProps } from 'react-router-dom';

interface IinquiryOrderProps {
  errcode: number;
  errmsg: string;
  data: {
    wechatPay: IwechatPay;
    title: string;
    price: number;
  };
}

interface IwechatPay {
  appId: string;
  nonceStr: string;
  package: string;
  signType: string;
  paySign: string;
  timestamp: string;
}

const OrderPayment: React.FC<RouteComponentProps> = (props) => {
  const { history } = props;
  const id: string = getUrlParam('id');
  const type: string = getUrlParam('type');
  const doctorId: string = getUrlParam('doctorId');
  const backUrl: string = decodeURIComponent(getUrlParam('backUrl'));
  const [wechatPay, setWechatPay] = useState<IwechatPay>();
  const [price, setPrice] = useState();
  const [title, setTitle] = useState<string>('');
  const [payState, setPayState] = useState<boolean>(true);
  const [followId, setFollowId] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const params: CreatePrePayParams = {
          business: type,
        };
        if (id) {
          params.inquiryId = parseInt(id);
        }
        if (doctorId) {
          params.doctorId = parseInt(doctorId);
        }
        const { data } = await createPrePayInquiryOrder(params);
        setWechatPay(data.wechatPay);
        setPrice(getPrice(data.price));
        setTitle(data.title);
        setFollowId(data.followId);
        setPayState(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, []);

  const handlePayment = () => {
    const goBack: string = getUrlParam('goBack');

    Toast.loading('支付请求中');
    //TODO: 优化一下支付
    wx.config({
      ...wechatPay,
      jsApiList: ['chooseWXPay'],
    });
    wx.ready(() => {
      wx.checkJsApi({
        jsApiList: ['chooseWXPay'],
        success: () => {
          Toast.hide();
          wx.chooseWXPay({
            ...wechatPay,
            success: function(res: any) {
              if (res.errMsg === 'chooseWXPay:ok') {
                // 使用以上方式判断前端返回,微信团队郑重提示：
                //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                const SuccessRequest = async () => {
                  try {
                    const params: OrderPaySuccess = {
                      business: type,
                      followId,
                    };
                    if (id) {
                      params.inquiryId = parseInt(id);
                    }
                    const { data } = await inquiryOrderPaySuccess(params);
                    if (data) {
                      if (backUrl) {
                        window.location.href = backUrl;
                      } else if (goBack) {
                        history.go(-parseInt(goBack, 10));
                      }
                    }
                  } catch (error) {
                    console.log(error);
                    Toast.info(error);
                  }
                };
                SuccessRequest();
              }
            },
            fail: (error: object) => {
              console.log('支付失败', error);
              Toast.info('支付失败');
            },
          });
        },
        fail: (error: object) => {
          console.log('支付请求失败', error);
          Toast.info('支付失败');
        },
      });
    });
  };

  return (
    <Page title="订单支付" loading={payState}>
      <div style={{ paddingTop: '50px', fontSize: '20px', textAlign: 'center' }}>{title}</div>
      <div style={{ textAlign: 'center', fontSize: '40px', padding: '20px 0', color: '#333', fontWeight: 700 }}>
        &yen;{price}
      </div>
      <Button
        style={{ color: '#fff', backgroundColor: '#06be04', margin: '0 20px' }}
        disabled={payState}
        onClick={handlePayment}>
        立即支付
      </Button>
    </Page>
  );
};

export default withRouter(OrderPayment);
