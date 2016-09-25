/**
 * Created by musale on 5/5/16.
 */
import {Pipe} from "@angular/core";

@Pipe({
    name : "formatDate"
})

export class FormatDatePipe{
    transform(value: any){
        var date_data = new Date(value);

        var yyyy = date_data.getFullYear().toString();
        var mm = (date_data.getMonth()+1).toString(); // getMonth() is zero-based
        var dd  = date_data.getDate().toString();

        return yyyy +"-"+ (mm[1]?mm:"0"+mm[0]) +"-"+ (dd[1]?dd:"0"+dd[0]); // padding
    }
}