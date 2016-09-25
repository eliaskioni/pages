/**
 * Created by musale on 5/9/16.
 */
import {Component, Output, EventEmitter} from  '@angular/core';
@Component({
    selector: 'date-search',
    template: `<div><label for="dateTerm">Filter By Date: <input step="any" #dateTerm class="btn btn-primary" type="date" (input)="update.emit(dateTerm.value)"></label></div>`
})

export class DateSearch {
    @Output() update = new EventEmitter();

    ngOnInit() {
        this.update.emit('');
        // console.log("the typed text", this.update);
    }
}