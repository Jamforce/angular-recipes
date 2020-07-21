import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, } from '@angular/core';
import { tap } from 'rxjs/operators';
// import { MessageService } from 'primeng/api';
import { NotificationService } from '../../../core/notification.service';
import { Observable } from 'rxjs';

/**
 * @author Geremia Nappo <ge.nappo@almaviva.it>
 * @version 1.0.0
 * @summary Componente globale per la gestione dei messaggi
 */
@Component({
    selector: 'app-messages',
    templateUrl: 'messages.component.html',
    styleUrls: ['./messages.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
    // providers: [ MessageService ],
})
export class MessagesComponent implements OnInit {

    messages$: Observable<any>;

    constructor(
        // private readonly messageService: MessageService,
        private readonly notificationService: NotificationService) {
        this.messages$ = this.notificationService.notificationChange$
        .pipe(tap(notification => null
            /* this.messageService.add({
                ...notification,
                detail: notification.message,
                summary: notification.title
            })*/)
        );
    }

    ngOnInit() { }
}
