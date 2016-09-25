/**
 * Created by kioni on 5/3/16.
 */
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: "search",
})

export class SearchReports implements PipeTransform {
    // pipes now take a variable number of arguments, and not an array that contains all arguments ^2.0.0.beta.16
    transform(obj:any, search_report: any) {
        if (obj == null) {
            // console.log('empty filter', obj);
            return null;
        }
        
        // console.log("object transform");
        // return 'elias';
        return obj.filter((item:any) =>new RegExp(search_report, "i").test(item.names) || new RegExp(search_report).test(item.phone_number) || new RegExp(search_report).test(item.amount) || new RegExp(search_report, "i").test(item.updated_at) || new RegExp(search_report, "i").test(item.status));
    }
}