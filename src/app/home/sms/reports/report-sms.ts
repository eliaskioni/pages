import {Component, Input, ElementRef, AfterViewInit} from '@angular/core';
import {BackendApis} from '../../../services/backend.apis'

declare var jQuery:any;
declare var moment:any;
declare var sweetAlert: any;


@Component({
    selector: 'reports-sms',
    templateUrl: './reports-sms.html',

})

export class ReportsSMSComponent implements AfterViewInit{
    @Input() search_report: any;
    sent_sms_list: Array<any>;
    count: any;
    next: any;
    previous: any;
    chartDates: Array<any> = [];
    constructor(public backendApis: BackendApis, private el:ElementRef) {
        this.backendApis.get_sent_sms()
            .subscribe(
                response => {
                    this.sent_sms_list = response.json().results;
                    console.log("response.json().results: ",response.json().results);
                    this.count = response.json().count;
                    this.previous = response.json().previous;
                    this.next = response.json().next;
                    for (var rep of response.json().results){
                        let dateValue = new Date(rep.updated_at);
                        // get dates for the charts in the format 2014-1-16
                        this.chartDates.push(`${dateValue.getFullYear()}-${dateValue.getMonth()}-${dateValue.getDate()}`);
                    }
                    // create the chart
                    this.create_chart(this.chartDates, this.sent_sms_list);
                },


            error => {
                alert(error.text());
                console.log(error.text())
            }
            );
    }
    create_chart(getChartDates: any, getDataYote: any) {
        // store count of statuses
        let successCount = 0;
        let failedCount = 0;
        let totalAirtimeAmount = 0;

        //list of data streams to map on chart series
        let successCountDataStream: Array<any> = [];
        let failedCountDataStream: Array<any> = [];
        let totalCountDataStream: Array<any> = [];

        // get unique dates into an array
        let theChartDates = getChartDates.filter(
            (value: any, index: any, getChartDates: any) => (getChartDates.slice(0, index)).indexOf(value) === -1);

        // now from here ni ku loop:
        // 1. using unique dates, create a nested loop through the data
        for (let date of theChartDates.reverse()) {
            // all the data loop
            for (let data of getDataYote) {
                let dateValue = new Date(data.created_at);
                let checkDate = `${dateValue.getFullYear()}-${dateValue.getMonth()}-${dateValue.getDate()}`;
                // 2. check if date ya unique dates and ya data are the same
                if (date === checkDate) {
                    let dataStatus = data.status;
                    // 3. assign status counts
                    if (dataStatus === 'success') {
                        successCount += 1;
                        totalAirtimeAmount += 1;
                    }
                    else if (dataStatus === 'Failed') {
                        failedCount += 1;
                        totalAirtimeAmount += 1;
                    }
                }
            }

            // get and set status of one date into an array
            let theDate = new Date(date);
            let theDateUTC = Date.UTC(theDate.getFullYear(), theDate.getMonth()+1, theDate.getDate());

            let successDataStream = {x:theDateUTC, y:successCount};
            let failedDataStream = {x:theDateUTC, y:failedCount};
            let totalDataStream = {x:theDateUTC, y:totalAirtimeAmount};

            // assign stream data values
            successCountDataStream.push(successDataStream);
            failedCountDataStream.push(failedDataStream);
            totalCountDataStream.push(totalDataStream);

            // re-set counters. go up to start loop again
            successCount = 0;
            failedCount = 0;
            totalAirtimeAmount = 0;
        }

        jQuery(this.el.nativeElement).find('div[id="chartContainer"]').highcharts('StockChart',{
            chart: {
                type: 'column',
                spacingRight: 20,
                zoomType: 'x'
            },
            credits: false,
            title: {
                text: 'SMS Transactions'
            },
            subtitle: {
                text: 'All the SMS transactions done'
            },
            tooltip: {
                crosshairs: false,
                shared: false
            },
            xAxis: {
                type: 'datetime',
                ordinal: true,
                title: {
                    text: 'Dates of Transactions'
                },
                tickInterval: 24 * 3600 * 1000,
                dateTimeLabelFormats: {
                    day: '%e of %b '
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Number of SMSs Sent'
                }
            },
            legend: {
                enabled: true,
                title: {
                    text: 'STATUS CODES'
                }
            },
            series: [{
                name:'Total SMSs Sent',
                groupPadding:.16,
                color:'rgba(204,204,204,.5)',
                grouping:false,
                data:totalCountDataStream
            },{
                name: 'Success',
                color: '#0913E2',
                data: successCountDataStream
            }, {
                name: 'Failed',
                color: '#A00A0C',
                data: failedCountDataStream
            }]
        });
    }

    previous_click_event(event: any) {
        var api = "https"+this.previous.substring(4);
        event.preventDefault(api);
        this.backendApis.previous(this.previous)
            .subscribe(
                response => {
                    this.sent_sms_list = [];
                    this.sent_sms_list = response.json().results;
                    this.count = response.json().count;
                    this.previous = response.json().previous;
                    this.next = response.json().next;
                },


                error => {
                    alert(error.text());
                    console.log(error.text())
                }
            );

    }


    next_click_event(event: any) {
        event.preventDefault();
        var api = "https"+this.next.substring(4);
        this.backendApis.next(api)
            .subscribe(
                response => {
                    this.sent_sms_list = [];
                    this.sent_sms_list = response.json().results;
                    this.count = response.json().count;
                    this.previous = response.json().previous;
                    this.next = response.json().next;
                },


                error => {
                    alert(error.text());
                    console.log(error.text())
                }
            );

    }


    download_message(event: any) {
        event.preventDefault();
        // console.log(this.sent_sms_list)
        // i will use this to download contacts
        var list: Array<any> = [];
        var download: Array<any> = [];
        download[0] = "User Names";
        download[1] = "Phone Numbers";
        download[2] = "Message Sent";
        download[3] = "Status";
        download[4] = "Updated At"
        list.push(download)
        for (var msg of this.sent_sms_list) {
            var download = [];
            download[0] = msg.names;
            download[1] = msg.phone_number;
            download[2] = msg.message;
            download[3] = msg.status;
            download[4] = msg.updated_at;
            list.push(download);

        }
        // console.log('to be downloaded', list)

        var csvContent = "data:text/csv;charset=utf-8,";

        list.forEach(function (infoArray, index) {
            var smsDataString = infoArray.join(",");
            csvContent += index < list.length ? smsDataString + "\n" : smsDataString;

        });

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "SmsReport.csv");

        link.click();
    }

    ngAfterViewInit() {
        jQuery(this.el.nativeElement).find('input[name="daterange"]').daterangepicker({
                "showISOWeekNumbers": true,
                "startDate": "01/01/2016",
                "endDate": "12/31/2016",
                "opens": "left",
                "alwaysShowCalendars": true,
                ranges: {
                    'Today': [moment(), moment()],
                    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                }
            },
            (start: any, end: any, label: any)=> {
                // get date range
                let dateRange = start.format('MM/DD/YYYY') + "-" + end.format('MM/DD/YYYY');

                // do the filter on api
                this.backendApis.filterSMSTransactions(dateRange).subscribe(
                    response=> {
                        this.chartDates =[];
                        this.sent_sms_list = [];
                        this.sent_sms_list = response.json().results;
                        this.count = response.json().count;
                        this.previous = response.json().previous;
                        this.next = response.json().next;
                        for (var rep of response.json().results){
                            let dateValue = new Date(rep.updated_at);
                            // get dates for the charts in the format 2014-1-16
                            this.chartDates.push(`${dateValue.getFullYear()}-${dateValue.getMonth()}-${dateValue.getDate()}`);
                        }
                        // create the chart
                        this.create_chart(this.chartDates, this.sent_sms_list);
                    },
                    error=> {
                        sweetAlert("Error", "Error getting your filtered result", "warning");
                    });
            });
    }
}
