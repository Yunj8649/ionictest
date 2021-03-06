import React  from 'react';
import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { Route, Redirect } from 'react-router';
import { personSharp,fitnessOutline,chatboxEllipsesOutline,clipboardOutline,calendar, location, informationCircle, people, home } from 'ionicons/icons';
import Home from './Home/Home';
import SchedulePage from './SchedulePage';
import SpeakerList from './SpeakerList';
import SpeakerDetail from './SpeakerDetail';
import SessionDetail from './SessionDetail';
import MapView from './MapView';
import About from './About';
import VideoChat from './VideoChat/VideoChat';

interface MainTabsProps { }

const MainTabs: React.FC<MainTabsProps> = () => {

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/tabs" to="/tabs/home" />
        {/* <Redirect exact path="/tabs" to="/tabs/schedule" /> */}
        {/*
          Using the render method prop cuts down the number of renders your components will have due to route changes.
          Use the component prop when your component depends on the RouterComponentProps passed in automatically.
        */}
        <Route path="/tabs/home" render={() => <Home />} exact={true} />
        <Route path="/tabs/schedule" render={() => <SchedulePage />} exact={true} />
        <Route path="/tabs/speakers" render={() => <SpeakerList />} exact={true} />
        <Route path="/tabs/speakers/:id" component={SpeakerDetail} exact={true} />
        <Route path="/tabs/schedule/:id" component={SessionDetail} />
        <Route path="/tabs/speakers/sessions/:id" component={SessionDetail} />
        <Route path="/tabs/map" render={() => <MapView />} exact={true} />
        <Route path="/tabs/about" render={() => <About />} exact={true} />
        <Route path="/tabs/camera" render={() => <VideoChat />} exact={true} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="schedule" href="/tabs/schedule">
          <IonIcon icon={personSharp} />
          <IonLabel>로그인</IonLabel>
        </IonTabButton>
        <IonTabButton tab="speakers" href="/tabs/speakers">
          <IonIcon icon={fitnessOutline} />
          <IonLabel>상담사찾기</IonLabel>
        </IonTabButton>
        <IonTabButton tab="home" href="/tabs/home">
          <IonIcon icon={home} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="map" href="/tabs/map">
          <IonIcon icon={chatboxEllipsesOutline} />
          <IonLabel>상담시작</IonLabel>
        </IonTabButton>
        <IonTabButton tab="about" href="/tabs/about">
          <IonIcon icon={clipboardOutline} />
          <IonLabel>상담내역</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default MainTabs;