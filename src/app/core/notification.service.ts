import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface NotificationConfiguration {
    sticky: boolean;
    closable: boolean;
    life: number;
    data?: any;
}

type Severity = 'info' | 'success' | 'warn' | 'error';

/**
 * @author Geremia Nappo <ge.nappo@almaviva.it>
 * @version 1.0.0
 * @summary Service per la pubblicazione di notifiche
 */
@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    private readonly notificationChange: Subject<any>;
    notificationChange$: Observable<any>;

    constructor() {
        this.notificationChange = new Subject();
        this.notificationChange$ = this.notificationChange.asObservable();
    }

    default(message: string, title?: string, override: Partial<NotificationConfiguration> = {}) {
        this.publishNotification('info', message, title, override);
    }

    info(message: string, title?: string, override: Partial<NotificationConfiguration> = {}) {
        this.publishNotification('info', message, title, override);
    }

    success(message: string, title?: string, override: Partial<NotificationConfiguration> = {}) {
        this.publishNotification('success', message, title, override);
    }

    warning(message: string, title?: string, override: Partial<NotificationConfiguration> = {}) {
        this.publishNotification('warn', message, title, override);
    }

    error(message: string, title?: string, override: Partial<NotificationConfiguration> = {}) {
        this.publishNotification('error', message, title, override);
    }

    private publishNotification(severity: Severity, message: string, title: string, override: Partial<NotificationConfiguration> = {}) {
        this.notificationChange.next({ severity, message, title, ...override });
    }

}
