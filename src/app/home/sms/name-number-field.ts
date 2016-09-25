/**
 * Created by marlyn on 4/21/16.
 */
import {Component, Input} from '@angular/core';

@Component({
    selector: 'name-number-field',
    template: '<td> <label class="control-label" [hidden]="!phone_number_error">{{phone_number_error}} </label>' +
    '<input #names value="{{choice.names}}" id="id_form-0-names" maxlength="255" name="form-0-names" type="text"/>' +
    '</td>' +
    '<td>' +
    '<input #number value="{{choice.to}}"  id="id_form-0-phone_number" maxlength="20" name="form-0-phone_number" type="text"/>' +
    '</td>'
})

export class NameNumberFieldComponent{
    @Input() choice: any;
}