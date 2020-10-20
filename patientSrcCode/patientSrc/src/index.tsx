require('promise.prototype.finally').shim();
import 'es6-promise';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as Sentry from '@sentry/browser';

// if (process.env.REACT_APP_ENV === 'qa') {
//   const VConsole = require('vconsole');
//   const vConsole = new VConsole();
//   //console.log(vConsole);
// }
try {
  process.env.NODE_ENV === "production"
  &&  
  Sentry.init({
    release: `${process.env.HOSPITAL_TAG}${process.env.VERSION}`,
    dsn: 'https://5e90e937c2ca478e9b149031763c9413@sentry-int.medlinker.com/18',
    environment: process.env.APP_ENV
  });
  
  Sentry.configureScope( (scope: any) => {
    scope.setTags({
      HOSPITAL_TAG: process.env.HOSPITAL_TAG
    })
  })
} catch (error) {
  console.error(error);
}


ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
