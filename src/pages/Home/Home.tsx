import React, { useState, useCallback, useEffect} from 'react';
import { IonHeader, IonToolbar, IonLabel, IonCardContent, IonTitle, IonContent, IonIcon, IonPage, IonButtons, IonCard, IonItem, IonButton, IonMenuButton, IonGrid, IonRow, IonCol } from '@ionic/react';
import { pin, chatbubblesOutline, personSharp, fitnessOutline, chatboxEllipsesOutline, clipboardOutline } from "ionicons/icons"

import './Home.scss';

interface HomeProps { }

const Home: React.FC<HomeProps> = () => {

	const onClickSearchCounselor = useCallback(() => {
		alert('상담사 찾기')
	}, []);

    return (
        <IonPage id="speaker-list">
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Home</IonTitle>
                </IonToolbar>
            </IonHeader>

			<IonContent 
				fullscreen={true}
				id="home-page"
				className="home-page"
			>
                {/* <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Speakers</IonTitle>
                    </IonToolbar>
                </IonHeader> */}

                <IonGrid fixed>
					<IonRow>
						<IonCol size="3">
							<IonButton className="menu-btn">
								<IonIcon icon={personSharp} />
							</IonButton>
								<div className="content">로그인</div>
						</IonCol>
						<IonCol size="3">
							<IonButton 
								className="menu-btn"
								onClick={onClickSearchCounselor}
							>
								<IonIcon icon={fitnessOutline} />
							</IonButton>
								<div className="content">상담사 찾기</div>
						</IonCol>
						<IonCol size="3">
							<IonButton className="menu-btn">
								<IonIcon icon={chatboxEllipsesOutline} />
							</IonButton>
								<div className="content">상담 시작</div>
						</IonCol>
						<IonCol size="3">
							<IonButton className="menu-btn">
								<IonIcon icon={clipboardOutline} />
							</IonButton>
								<div className="content">상담 내역 보기</div>
						</IonCol>
					</IonRow>
				</IonGrid>
				<IonCard className="middle-container">
					<IonCardContent>
						<IonItem lines="none" text-center>
							<div className="center">
								<IonIcon icon={chatbubblesOutline} size="large" />
							</div>
						</IonItem>
						<IonItem lines="none" >
							<div className="center">
								<IonLabel position="floating">상담사를 찾고 상담을 시작하세요!</IonLabel>
							</div>
						</IonItem>
					</IonCardContent>
				</IonCard>
            </IonContent>
      </IonPage>
    );
};

export default React.memo(Home);