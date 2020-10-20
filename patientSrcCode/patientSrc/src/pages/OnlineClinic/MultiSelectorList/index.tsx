// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Popover } from 'antd-mobile';
import { title, getUrlParam, decryptObj } from '@/utils';
import classnames from 'classnames/bind';
import { get, set } from 'lodash';
import { getDoctorListFilter } from '@/api/common';
import styles from './index.module.scss';
import { connect } from 'react-redux';
import { getHospitalSource } from '@/store/models/hospital';
import { IhospitalSource } from '@/types/api/doctorManage';
interface ImultiSelectorList {
  onChange: (val: any) => void;
  hospitalSource: IhospitalSource;
  getHospitalSource: () => void;
}

const mapStateToProps = (state: any) => {
  return { hospitalSource: state.hospitalSource };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    getHospitalSource: () => {
      dispatch(getHospitalSource());
    },
  };
};

const MultiSelectorList: React.FC<ImultiSelectorList> = (props) => {
  const { onChange, hospitalSource, getHospitalSource } = props;
  const [currentSource, setCurrentSource] = useState(null as any);
  const [filterType, setFilterType] = useState<string[]>([]);
  const [filterSource, setFilterSource] = useState();
  const [visible, setvisible] = useState<boolean>(false);
  const cx = classnames.bind(styles);
  useEffect(() => {
    const doctorListFilter = async () => {
      try {
        const { data } = await getDoctorListFilter({ hospitalId: hospitalSource.id });
        setFilterType(Object.keys(data));
        setFilterSource(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (hospitalSource.id) {
      doctorListFilter();
    } else {
      getHospitalSource();
    }
  }, [hospitalSource.id]);

  useEffect(() => {
    if (filterType.length > 0 && filterSource) {
      const generateObject = () => {
        let obj = {} as any;
        filterType.map((value: string) => {
          set(obj, value, { selectValue: -1, selectLabel: get(title, value) });
        });
        let section = getUrlParam('section') as any;
        if (section) {
          section = decryptObj(section);
          Object.keys(section).forEach((key: string) => {
            setCurrentSource({
              ...obj,
              [key]: {
                ...obj[key],
                selectValue: section[key],
                selectLabel: filterSource[key].find((selector: any) => selector.id === section[key]).name,
              },
            });
          });
        } else {
          setCurrentSource(obj);
        }
      };
      generateObject();
    }
  }, [filterType, filterSource]);

  useEffect(() => {
    if (currentSource) {
      onChange(currentSource);
    }
  }, [currentSource]);

  const onSelect = (opt: any) => {
    const {
      props: { value, children, label },
    } = opt;
    const newData = {
      ...currentSource,
      [label]: {
        ...currentSource[label],
        selectValue: value,
        selectLabel: children,
      },
    };
    setCurrentSource(newData);
    setvisible(false);
  };

  const textCls = (flag: boolean) => {
    return cx({
      text: true,
      highlight: flag,
    });
  };

  const arrowCls = (flag: boolean) => {
    return cx({
      arrow: true,
      highlight: flag,
    });
  };
  return (
    <div className={styles.menuPanel}>
      {filterSource &&
        filterType.map((key: string) => (
          // @ts-ignore
          <Popover
            visible={visible}
            overlayClassName={styles.popverScroll}
            mask
            key={key}
            placement="bottom"
            overlay={filterSource[key].map((item: { id: number; name: string }) => (
              // @ts-ignore
              <Popover.Item key={item.id} label={key} value={item.id}>
                {item.name.length > 6 ? `${item.name.slice(0, 6)}...` : item.name}
              </Popover.Item>
            ))}
            onSelect={onSelect}>
            <div className={textCls(get(currentSource, [key, 'selectValue']) > 0)}>
              {get(currentSource, [key, 'selectValue']) > 0 ? (
                <span>
                  {get(currentSource, [key, 'selectLabel', 'length']) > 5
                    ? `${get(currentSource, [key, 'selectLabel']).slice(0, 3)}...`
                    : get(currentSource, [key, 'selectLabel'])}
                </span>
              ) : (
                <span>{get(title, key)}</span>
              )}
              <div className={arrowCls(get(currentSource, [key, 'selectValue']) > 0)} />
            </div>
          </Popover>
        ))}
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MultiSelectorList);
