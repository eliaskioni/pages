/**
 * Created by kioni on 4/25/16.
 */

import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: "search",
    pure: false,
})

export class SearchContactList implements PipeTransform {
    // pipes now take a variable number of arguments, and not an array that contains all arguments ^2.0.0.beta.16
    // transform(items: any[], field : string, value : string): any[] {
        transform(obj:any, search_term: any) {
        if (obj == null) {
            // console.log("the obj transform null", obj);
            return null;
        }
        // var myString = search_term.replace(/\+/g, "");

        // console.log("the obj transform", obj);
        return obj.filter((item: any) =>new RegExp(search_term.replace(/\+/g, ''), "i").test(item.names) || new RegExp(search_term.replace(/\+/g, ''), "i").test(item.phone_number));
        // return obj.filter((item)=> item.names.startsWith(search_term));
    }
}
