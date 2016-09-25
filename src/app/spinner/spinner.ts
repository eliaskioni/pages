/**
 * Created by musale on 5/6/16.
 */
'use strict';

import {Component, Input, OnDestroy} from '@angular/core';

@Component({
    selector: 'my-spinner',
    templateUrl: './spinner.html',
    styleUrls: ['./spinner.css']
})
export class SpinnerComponent implements OnDestroy {
    private currentTimeout: any;
    private isDelayedRunning: boolean = false;

    @Input()
    public delay: number = 0;

    @Input()
    public set isRunning(value: boolean) {
        if (!value) {
            this.cancelTimeout();
            this.isDelayedRunning = false;
        }

        if (this.currentTimeout) {
            return;
        }

        this.currentTimeout = setTimeout(() => {
            this.isDelayedRunning = value;
            this.cancelTimeout();
        }, this.delay);
    }

    private cancelTimeout(): void {
        clearTimeout(this.currentTimeout);
        this.currentTimeout = undefined;
    }

    ngOnDestroy(): any {
        this.cancelTimeout();
    }
}
