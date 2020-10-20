import React, { useState, useEffect } from 'react';
import MenuList from '@/components/MenuList';
import { getRecipeList } from '@/api/recipe';
import Page from '@/components/Page';
import RecipePanel from '@/pages/My/MyRecipe/RecipePanel';
import styles from './index.module.scss';
import { Toast, WhiteSpace, ListView, WingBlank } from 'antd-mobile';
import { IrecipeListCaseProps } from '@/types/api/recipeManage';

const MyRecipe: React.FC = () => {
  const initSource = new ListView.DataSource({
    rowHasChanged: (row1: any, row2: any) => { return row1 !== row2 },
  })
  const [recipeSource, setRecipeSource] = useState(initSource);
  const [currentPatientId, setCurrentPatientId] = useState<number>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRecipeList = async (id: number) => {
      try {
        setLoading(true);
        const { data } = await getRecipeList(id);
        setRecipeSource(recipeSource.cloneWithRows(data));
        setLoading(false);
      } catch (error) {
        Toast.info(error.message);
      }
    };
    if (currentPatientId) {
      fetchRecipeList(currentPatientId);
    } else {
      setLoading(false);
    }
  }, [currentPatientId]);

  const handlePatientChange = (patientId: number) => {
    setCurrentPatientId(patientId);
  };

  const renderRow = (rowData: IrecipeListCaseProps, sectionID: string | number, rowID: string | number) => {
    return (
      <RecipePanel key={rowID} recipe={rowData} />
    )
  }
  return (
    <Page title="我的处方" loading={loading}>
      <WhiteSpace />
      <MenuList onChange={handlePatientChange} />
      <WingBlank>
        <ListView
          dataSource={recipeSource}
          renderRow={renderRow}
          useBodyScroll={true}
          className={styles.recipeList}
        />
        <WhiteSpace />
      </WingBlank>
    </Page>
  );
}

export default MyRecipe;
