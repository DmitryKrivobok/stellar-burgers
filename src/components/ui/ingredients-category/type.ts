import { TIngredient } from '@utils-types';

export type TIngredientsCategoryUIProps = {
  title: string;
  titleRef: React.RefObject<HTMLHeadingElement>;
  ingredients: TIngredient[];
  ingredientsCounters: Record<string, number>;
  //onSelectBun: (ingredient: TIngredient) => void;
  // onSelectIngredient: (ingredient: TIngredient) => void;
};
