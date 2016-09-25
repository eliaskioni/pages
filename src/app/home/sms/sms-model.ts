/**
 * Created by marlyn on 4/22/16.
 */
export class SMSModel{
    constructor(public message:string = '', public phone_number:string = '', public names:string = ''){}
}

export class ExcelSMSModel{
    constructor(public phone_number:string = '', public names:string = ''){}
}