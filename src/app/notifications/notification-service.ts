/**
 * Created by musale on 5/20/16.
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {Notification} from "./notifications-model";


@Injectable()
export class NotificationsService {
    private _notifications = new Subject<Notification>();

    public noteAdded = this._notifications.asObservable();

    public add(notification: Notification) {
        this._notifications.next(notification);
    }
}