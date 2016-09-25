/**
 * Created by kioni on 5/3/16.
 */

import {Component, Output, EventEmitter} from  '@angular/core';
@Component({
    selector: 'sms-box',
    template: `<div><input #searchTerm class="search-query form-control" placeholder="Enter search term..." type="text" (input)="update.emit(searchTerm.value)"></div>`
})

export class SMSearchBox {
    @Output() update = new EventEmitter();

    ngOnInit() {
        this.update.emit('');
        console.log("the typed text", this.update);
    }
}