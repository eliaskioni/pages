/**
 * Created by kioni on 5/3/16.
 */

/**
 * Created by musale on 4/27/16.
 */
import {Component, Output, EventEmitter} from  '@angular/core';
@Component({
    selector: 'report-box',
    template: `<div><input #searchTerm class="search-query form-control" placeholder="Enter name or number to search..." type="text" (input)="update.emit(searchTerm.value)"></div>`
})

export class ReportSearch {
    @Output() update = new EventEmitter();

    ngOnInit() {
        this.update.emit('');
        console.log("the typed text", this.update);
    }
}