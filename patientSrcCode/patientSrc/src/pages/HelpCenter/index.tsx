import React, { useState } from 'react';
import Page from '@/components/Page';
import styles from './index.module.scss';
import { withRouter, Link } from 'react-router-dom';
import { SearchBar, List, Accordion } from 'antd-mobile';
import Doc from './doc';
import { calculateAge } from '@/utils';

function DoctorInfo() {
  const [searching, setSearching] = useState(false);
  const [searchParams, setSearchParams] = useState('');
  const [result, setResult] = useState([]);
  let questions: any = [];
  Doc.forEach((item) => {
    questions = questions.concat(item.list);
  });
  const handleSearchChange = (value: string) => {
    window.console.log(value);
    setSearchParams(value);

    window.console.log(questions)
    setResult(questions.filter((doclistitem: any) => doclistitem.name.indexOf(value) !== -1));
  };

  const handleSearchBlur = () => {
    if (!searchParams) {
      setSearching(false);
    }
  };
  const handleSearchCancel = () => {
    setSearchParams('');
    setSearching(false);
  };
  const handleSearchFocus = () => {
    setSearching(true);
  };
  return (
    <Page title="帮助中心" loading={false}>
      <div className={styles.content}>
        <SearchBar
          placeholder="搜索"
          maxLength={8}
          value={searchParams}
          onFocus={handleSearchFocus}
          onChange={handleSearchChange}
          onCancel={handleSearchCancel}
          onBlur={handleSearchBlur}
        />
        {
          searching
            ? <List renderHeader="搜索结果">
              {result && searchParams && result.map((item: any) => (
                <List.Item key={item.id + ',' + item.key}>
                  <Link
                    style={{ color: '#333' }}
                    to={`/helpCenter/detail/${item.id},${item.key}`}>
                    {item.name}?
                  </Link>
                </List.Item>
              ))
              }
            </List>
            :
            <>
              <div style={{ maxHeight: 'calc(100vh - 100px)', overflow: 'scroll' }}>
                <Accordion defaultActiveKey="0">
                  {
                    Doc.map((item: any) => (
                      <Accordion.Panel header={item.name} key={item.id}>
                        <List className="my-list">
                          {item.list.map((listItem: any) => (
                            <List.Item key={listItem.key} arrow='horizontal'>
                              <Link
                                style={{ color: '#333' }}
                                to={`/helpCenter/detail/${item.id},${listItem.key}`}>
                                {listItem.name}?
                              </Link>
                            </List.Item>
                          ))}
                        </List>
                      </Accordion.Panel>
                    ))
                  }
                </Accordion>
              </div>
              <div className={styles.footer}>
                <Link to={`/helpCenter/feedback`}>
                  <div
                    style={{ position: 'absolute', width: '40vw', bottom: '5vw', left: '5vw', background: '#40a9ff', borderRadius: '8px', color: '#fff', height: '30px', textAlign: 'center', lineHeight: '30px' }}>投诉和建议</div>
                </Link>
                <Link to={`/helpCenter/connect`}>
                  <div
                    style={{ position: 'absolute', width: '40vw', bottom: '5vw', right: '5vw', background: '#40a9ff', borderRadius: '8px', color: '#fff', height: '30px', textAlign: 'center', lineHeight: '30px' }}>联系客服</div>
                </Link>
              </div>
            </>
        }
      </div>
    </Page >
  );
}

export default withRouter(DoctorInfo);
