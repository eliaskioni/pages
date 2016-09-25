import {Component} from "@angular/core";
import {Notification} from "./notifications-model";
import {NotificationsService} from "./notification-service";
import {Observable} from "rxjs/Rx";
/**
 * Created by musale on 5/20/16.
 */
@Component({
    selector: 'notifications',
    styleUrls: ['./notifications.css'],
    template:`<div class="notifications"><div (click)="hide(note)" class="{{ note.type }}" *ngFor="let note of _notes">{{ note.message }}<br> <small>Redirecting in <b>{{count}}s</b></small></div></div>`
})
export class Notifications {
    private _notes: Notification[];
    private count: any;

    constructor(private _notifications: NotificationsService) {
        this._notes = [];

        _notifications.noteAdded.subscribe(note => {
            this._notes.push(note);

            setTimeout(() => { this.hide.bind(this)(note) }, 6000);
        });

        Observable.interval(1000)
            .map((x) => x+1)
            .subscribe((x) => {
                this.count = x;
            });
    }

    private hide(note: any) {
        let index = this._notes.indexOf(note);

        if (index >= 0) {
            this._notes.splice(index, 1);
        }
    }
}
