import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { NavLink } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <NavLink
          to='/'
          end
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.link_active}` : styles.link
          }
        >
          <div className='icon-wrapper'>
            <BurgerIcon type={'primary'} />
          </div>
          <span className='text text_type_main-default ml-2 mr-10'>
            Конструктор
          </span>
        </NavLink>

        <NavLink to='/feed'>
          {({ isActive }) => (
            <span
              className={
                isActive ? `${styles.link} ${styles.link_active}` : styles.link
              }
            >
              <ListIcon type={'primary'} />
              <span className='text text_type_main-default ml-2'>
                Лента заказов
              </span>
            </span>
          )}
        </NavLink>
      </div>

      <div className={styles.logo}>
        <Logo className='' />
      </div>

      <NavLink
        to='/profile'
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.link_active}` : styles.link
        }
      >
        <div className='icon-wrapper'>
          <ProfileIcon type={'primary'} />
        </div>
        <p className='text text_type_main-default ml-2'>
          {userName || 'Личный кабинет'}
        </p>
      </NavLink>
    </nav>
  </header>
);
