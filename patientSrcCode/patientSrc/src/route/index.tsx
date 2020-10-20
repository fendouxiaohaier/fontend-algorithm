import React from 'react';
import { Route, Redirect } from 'react-router-dom';
const HomePage = React.lazy(() => import('@/pages/Home'));
const Login = React.lazy(() => import('@/pages/Login'));
const My = React.lazy(() => import('@/pages/My'));
const MyRecipe = React.lazy(() => import('@/pages/My/MyRecipe'));
const MyRecord = React.lazy(() => import('@/pages/My/MyRecord'));
const MyPatient = React.lazy(() => import('@/pages/My/MyPatient'));
const AddPatient = React.lazy(() => import('@/pages/My/MyPatient/AddPatient'));
const RecordDetail = React.lazy(() => import('@/pages/My/MyRecord/RecordDetail'));
const OnlineClinic = React.lazy(() => import('@/pages/OnlineClinic'));
const DoctorHome = React.lazy(() => import('@/pages/DoctorDetail'));
const RecipeDetail = React.lazy(() => import('@/pages/My/MyRecipe/RecipeDetail'));
const InquiryOrder = React.lazy(() => import('@/pages/InquiryOrder'));
const InquiryIm = React.lazy(() => import('@/pages/IM/Inquiry'));
const OrderPayment = React.lazy(() => import('@/pages/OrderPayment'));
const MyDoctor = React.lazy(() => import('@/pages/Mydoctor'));
const HelpCenter = React.lazy(() => import('@/pages/HelpCenter'));
const HelpCenterDetail = React.lazy(() => import('@/pages/HelpCenter/detail'));
const HelpCenterFeedback = React.lazy(() => import('@/pages/HelpCenter/feedback'));
const HelpCenterConnect = React.lazy(() => import('@/pages/HelpCenter/connect'));
const HelpCenterFeedbackAdd = React.lazy(() => import('@/pages/HelpCenter/add'));
const HelpCenterFeedbackDetail = React.lazy(() => import('@/pages/HelpCenter/feedbackDetail'));
// 追问包
const QuestionPacket = React.lazy(() => import('@/pages/QuestionPacket'));
// 复诊续方
const Continuation = React.lazy(() => import('@/pages/Continuation'));
// 购药IM
const BuyIm = React.lazy(() => import('@/pages/IM/Buy'));
// 满意度调查
const Satisfaction = React.lazy(() => import('@/pages/Satisfaction'));
// 问诊对话列表
const MyDoctorInquiry = React.lazy(() => import('@/pages/MyDoctorInquiry'));
// 患者须知
const Notice = React.lazy(() => import('@/pages/Notice'));

const route = () => (
  <>
    <Route exact path="/" component={() => <Redirect to="/home" />} />
    <Route exact path="/home" component={HomePage} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/my" component={My} />
    <Route exact path="/my-recipe" component={MyRecipe} />
    <Route exact path="/my-record" component={MyRecord} />
    <Route exact path="/my-patient" component={MyPatient} />
    <Route exact path="/my-patient/add" component={AddPatient} />
    <Route exact path="/my-record/detail/:id" component={RecordDetail} />
    <Route exact path="/online-clinic" component={OnlineClinic} />
    <Route exact path="/doctor-home/:id" component={DoctorHome} />
    <Route exact path="/recipe-detail/:id" component={RecipeDetail} />
    <Route exact path="/inquiry-order/:id" component={InquiryOrder} />
    <Route exact path="/im/:id" component={InquiryIm} />
    <Route exact path="/orderPayment" component={OrderPayment} />
    <Route exact path="/my-doctor" component={MyDoctor} />
    <Route exact path="/QuestionPacket/:doctorId" component={QuestionPacket} />
    <Route exact path="/Continuation/:patientId/:doctorId" component={Continuation} />
    <Route exact path="/BuyIm" component={BuyIm} />
    <Route exact path="/helpCenter" component={HelpCenter} />
    <Route exact path="/helpCenter/detail/:params" component={HelpCenterDetail} />
    <Route exact path="/helpCenter/feedback" component={HelpCenterFeedback} />
    <Route exact path="/helpCenter/feedback/:id" component={HelpCenterFeedbackDetail} />
    <Route exact path="/helpCenter/feedback/add/:type" component={HelpCenterFeedbackAdd} />
    <Route exact path="/helpCenter/connect" component={HelpCenterConnect} />
    <Route exact path="/Satisfaction/:clinicNumber" component={Satisfaction} />
    <Route exact path="/MyDoctorInquiry" component={MyDoctorInquiry} />
    <Route exact path="/Notice" component={Notice} />
  </>
);

export default route;
