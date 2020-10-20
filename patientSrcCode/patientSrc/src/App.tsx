import React, { Fragment, Suspense } from 'react';
import { Provider } from 'react-redux';
import store from '@/store';
import { createHashHistory } from "history";
import { Router, Switch } from 'react-router-dom';
import Route from './route';
import './index.scss';

export const history = createHashHistory();

const App = () => (
  <Provider store={store}>
    <Fragment>
      <div className="container">
        <Router history={history}>
          <Switch>
            <Suspense fallback={null}>
              <Route />
            </Suspense>
          </Switch>
        </Router>
      </div>
    </Fragment>
  </Provider>
);

export default App;
