import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';
import { TIngredient } from '@utils-types';
import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useDispatch, useSelector} from 'react-redux';
import { fetchIngredients} from '../../services/slices/ingredientsSlice';
import { RootState, AppDispatch } from 'src/services/store';
//import { addBun, addIngredient } from '../../services/slices/constructorSlice';


export const BurgerIngredients: FC = () => {
  
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);


  const ingredients = useSelector(
    (state: RootState) => state.ingredients.data
  ) as TIngredient[];

  const buns = ingredients.filter((ing) => ing.type === 'bun');
  const mains = ingredients.filter((ing) => ing.type === 'main');
  const sauces = ingredients.filter((ing) => ing.type === 'sauce');

/*
  const [selectedBun, setSelectedBun] = useState<TIngredient | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<TIngredient[]>([]);

  const handleSelectBun = (ingredient: TIngredient) => {
    setSelectedBun(ingredient);
    dispatch(addBun(ingredient));
  };

  const handleSelectIngredient = (ingredient: TIngredient) => {
    setSelectedIngredients(prev => [...prev, ingredient]);
    dispatch(addIngredient(ingredient));
  };
*/
  //выбранные ингредиенты для конструктора
  /** TODO: взять переменные из стора */
  //const buns = [];
  //const mains = [];
  //const sauces = [];
  // const buns: TIngredient[] = [];
  // const mains: TIngredient[] = [];
  // const sauces: TIngredient[] = [];

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
