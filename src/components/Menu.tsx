import React, {useEffect, useCallback, useState} from 'react';
import { RouteComponentProps, withRouter, useLocation } from 'react-router';

import { IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle, IonToggle } from '@ionic/react';
import { calendarOutline, hammer, moonOutline, help, informationCircleOutline, logIn, logOut, mapOutline, peopleOutline, person, personAdd, tvOutline } from 'ionicons/icons';

import { connect } from '../data/connect';
import { setDarkMode } from '../data/user/user.actions';

import './Menu.css'
import DataManager from '../util/DataManager/DataManager';

// const routes = {
//   appPages: [
//     { title: 'Schedule', path: '/tabs/schedule', icon: calendarOutline },
//     { title: 'Speakers', path: '/tabs/speakers', icon: peopleOutline },
//     { title: 'Map', path: '/tabs/map', icon: mapOutline },
//     { title: 'About', path: '/tabs/about', icon: informationCircleOutline },
//     { title: 'Camera', path: '/tabs/camera', icon: tvOutline }
//   ],
//   loggedInPages: [
//     { title: 'Account', path: '/account', icon: person },
//     { title: 'Support', path: '/support', icon: help },
//     { title: 'Logout', path: '/logout', icon: logOut }
//   ],
//   loggedOutPages: [
//     { title: 'Login', path: '/login', icon: logIn },
//     { title: 'Support', path: '/support', icon: help },
//     { title: 'Signup', path: '/signup', icon: personAdd }
//   ]
// };

interface Pages {
    MENU_NM: string,
    MENU_URL: string,
  icon: string,
  routerDirection?: string
//   title: string,
//   path: string,
//   icon: string,
//   routerDirection?: string
}
interface StateProps {
  darkMode: boolean;
  isAuthenticated: boolean;
  menuEnabled: boolean;
}

interface DispatchProps {
  setDarkMode: typeof setDarkMode
}

interface DispatchProps {
  setDarkMode: typeof setDarkMode
}

interface MenuProps extends RouteComponentProps, StateProps, DispatchProps { }

const Menu: React.FC<MenuProps> = ({ darkMode, history, isAuthenticated, setDarkMode, menuEnabled }) => {
    const [routes, setRoutes] = useState({appPages: [], loggedInPages: [], loggedOutPages: []});
  const location = useLocation();

  function renderlistItems(list: Pages[]) {
    return list
      .filter(route => !!route.MENU_URL)
      .map(p => (
        <IonMenuToggle key={p.MENU_NM} auto-hide="false">
          <IonItem detail={false} routerLink={p.MENU_URL} routerDirection="none" className={location.pathname.startsWith(p.MENU_URL) ? 'selected' : undefined}>
            {/* <IonIcon slot="start" icon={p.icon} /> */}
            <IonLabel>{p.MENU_NM}</IonLabel>
          </IonItem>
        </IonMenuToggle>
      ));
  }

  const initialize = useCallback(async() => {
    console.log('111')
    const menus = await DataManager.getMenus();

    setRoutes(menus)
    console.log(menus)
  }, []);

  useEffect(() => {
    initialize();
  }, []);

  return (
    <IonMenu  type="overlay" disabled={!menuEnabled} contentId="main">
      <IonContent forceOverscroll={false}>

        <IonList lines="none">
          <IonListHeader>Conference</IonListHeader>
          {renderlistItems(routes.appPages)}
        </IonList>

        <IonList lines="none">
          <IonListHeader>Account</IonListHeader>
          {isAuthenticated ? renderlistItems(routes.loggedInPages) : renderlistItems(routes.loggedOutPages)}
          <IonItem>
            <IonIcon slot="start" icon={moonOutline}></IonIcon>
            <IonLabel>Dark Mode</IonLabel>
            <IonToggle checked={darkMode} onClick={() => setDarkMode(!darkMode)} />
          </IonItem>
        </IonList>

        <IonList lines="none">
          <IonListHeader>Tutorial</IonListHeader>
          <IonItem button onClick={() => {
            history.push('/tutorial');
          }}>
            <IonIcon slot="start" icon={hammer} />
            Show Tutorial
          </IonItem>
        </IonList>
        
      </IonContent>
    </IonMenu>
  );
};

export default connect<{}, StateProps, {}>({
  mapStateToProps: (state) => ({
    darkMode: state.user.darkMode,
    isAuthenticated: state.user.isLoggedin,
    menuEnabled: state.data.menuEnabled
  }),
  mapDispatchToProps: ({
    setDarkMode
  }),
  component: withRouter(Menu)
})
