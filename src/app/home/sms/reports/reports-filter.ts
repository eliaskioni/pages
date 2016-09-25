/**
 * Created by kioni on 5/3/16.
 */
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: "search",
})

export class SearchSMSList implements PipeTransform {
    // pipes now take a variable number of arguments, and not an array that contains all arguments ^2.0.0.beta.16
    transform(obj:any, search_sms: any) {
        if (obj == null) {
            // console.log("the obj transform null", obj);
            return null;
        }
        // var myString = search_term.replace(/\+/g, "");

        // console.log("the obj transform", obj);
        return obj.filter((item: any) =>new RegExp(search_sms, "i").test(item.names) || new RegExp(search_sms, "i").test(item.phone_number) || new RegExp(search_sms, "i").test(item.message) || new RegExp(search_sms, "i").test(item.updated_at) || new RegExp(search_sms, "i").test(item.status));
        // return obj.filter((item)=> item.names.startsWith(search_term));
    }
}
