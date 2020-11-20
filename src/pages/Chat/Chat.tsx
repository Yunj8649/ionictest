import React, { useState, useCallback, useEffect} from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton, IonGrid, IonRow, IonCol } from '@ionic/react';

interface ChatProps { }

const Chat: React.FC<ChatProps> = () => {
    return (
        <IonPage id="speaker-list">
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Chat</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen={true}>
                {/* <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Speakers</IonTitle>
                    </IonToolbar>
                </IonHeader> */}

                <IonGrid fixed>
                    <IonRow>
                        ddd
                    </IonRow>
                </IonGrid>
            </IonContent>
      </IonPage>
    );
};

export default React.memo(Chat);