import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import Page from '@/components/Page';
import Recipe from '@/pages/My/MyRecipe/Recipe';
import { getRecipeDetail } from '@/api/recipe';
import { RouteComponentProps } from 'react-router';
import { IrecipeDetailCaseProps } from '@/types/api/recipeManage';
import { get } from 'lodash';
import { Toast } from 'antd-mobile';


function RecipeDetail(props: RouteComponentProps) {
  const { match: { params } } = props;
  const [recipe, setRecipe] = useState<IrecipeDetailCaseProps>();

  useEffect(() => {
    const fetchRecipeDetail = async () => {
      try {
        const { data } = await getRecipeDetail(get(params, 'id'));
        setRecipe(data);
      } catch (error) {
        Toast.info(error.message);
      }
    };
    fetchRecipeDetail();
  }, []);

  return (
    <Page title="处方详情" loading={!recipe}>
      <Recipe {...recipe as IrecipeDetailCaseProps} />
    </Page>
  );
}

export default withRouter(RecipeDetail);
