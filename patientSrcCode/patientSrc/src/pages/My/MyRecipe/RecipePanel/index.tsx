import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import styles from './index.module.scss';
import { IrecipeListCaseProps, ImedicationListCaseProps } from '@/types/api/recipeManage';
import { get } from 'lodash';
import { WhiteSpace, List } from 'antd-mobile';
import Underline from '@/components/Underline';

interface IrecipeCompoentProps extends RouteComponentProps {
  recipe: IrecipeListCaseProps;
}

const RecipePanel: React.FC<IrecipeCompoentProps> = (props) => {
  const { recipe, history } = props;

  const handleToRecipeDetail = (id: number) => {
    history.push(`/recipe-detail/${id}`);
  };

  return (
    <>
      <WhiteSpace />
      <div className={styles.recipeWrapper} onClick={() => handleToRecipeDetail(get(recipe, 'id'))}>
        <List>
          <List.Item error extra={get(recipe, 'statusText', '')}><span className={styles.text}>编号：{get(recipe, 'tranNo', '')}</span></List.Item>
          <Underline />
          {get(recipe, 'medication').map((item: ImedicationListCaseProps, index: number) => (
            <List.Item key={index} extra={`x${item.quantity}`} multipleLine>{item.name}<List.Item.Brief>{`规格: ${item.specification}`}</List.Item.Brief></List.Item>
          ))}
          <Underline />
          <List.Item thumb={get(recipe, 'doctorAvatar')}><span className={styles.text}>{get(recipe, 'doctorName', '')}医生</span></List.Item>
        </List>
      </div>
    </>
  );
}

export default withRouter(RecipePanel);
