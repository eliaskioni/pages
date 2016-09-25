/**
 * Created by marlyn on 4/15/16.
 */
import {Component, Input, AfterViewInit, ElementRef} from "@angular/core";
import {BackendApis} from "../../../services/backend.apis";

declare var jQuery:any;
declare var moment:any;
declare var sweetAlert: any;

@Component({
    selector: 'reports-topup',
    templateUrl: './reports-topup.html',
})

export class ReportsTopupComponent implements AfterViewInit {
    @Input() search_report: any;
    airtime_reports: any = [];
    counts: any;
    next: any;
    previous: any;
    paginated_count: any;
    private url: any;
    chartDates: any = [];

    constructor(public backendApi:BackendApis, private el:ElementRef) {
        this.populate_page(1);
    }

    get_page_num(url: any) {
        var href = url;
        var reg = new RegExp('[?&]' + 'page' + '=([^&#]*)', 'i');
        var string = reg.exec(href);
        return string ? string[1] : null;
    }


    populate_page(page: any = 1) {
        this.backendApi.getAirtimeReport(page)
            .subscribe(
                response => {
                    // reset page data
                    this.airtime_reports = [];

                    var next_url = response.json().next;
                    var previous_url = response.json().previous;
                    this.assign_page(next_url, previous_url);

                    this.paginated_count = true;

                    // populate page
                    for (var report of response.json().results) for (var rep of report.recipient_transactions) {
                        this.airtime_reports.push(rep);
                        let dateValue = new Date(rep.created_at);
                        // get dates for the charts in the format 2014-1-16
                        this.chartDates.push(`${dateValue.getFullYear()}-${dateValue.getMonth()+1}-${dateValue.getDate()}`);
                    }
                    this.counts = this.airtime_reports.length;

                    // create the chart
                    this.create_chart(this.chartDates, this.airtime_reports);
                },
                error => {
                    alert(error.text());
                    // console.log(error.text())
                }
            );

    }

    create_chart(getChartDates: any, getDataYote: any) {
        // store count of statuses
        let successCount = 0;
        let failedCount = 0;
        let totalAirtimeAmount = 0;

        //list of data streams to map on chart series
        let successCountDataStream: any = [];
        let failedCountDataStream: any = [];
        let totalCountDataStream: any = [];

        // get unique dates into an array
        let theChartDates = getChartDates.filter(
            (value: any, index: any, getChartDates: any) => (getChartDates.slice(0, index)).indexOf(value) === -1);

        // now from here ni ku loop:
        // 1. using unique dates, create a nested loop through the data
        for (let date of theChartDates.reverse()) {
            // all the data loop
            for (let data of getDataYote) {
                let dateValue = new Date(data.created_at);
                let checkDate = `${dateValue.getFullYear()}-${dateValue.getMonth()+1}-${dateValue.getDate()}`;
                // 2. check if date ya unique dates and ya data are the same
                if (date === checkDate) {
                    let dataStatus = data.status;
                    // 3. assign status counts
                    if (dataStatus === 'success') {
                        successCount += data.amount;
                        totalAirtimeAmount += data.amount;
                    }
                    else if (dataStatus === 'failed') {
                        failedCount += data.amount;
                        totalAirtimeAmount += data.amount;
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

        jQuery(this.el.nativeElement).find('div[id="chartContainer"]').highcharts({
            chart: {
                type: 'column',
                spacingRight: 20,
                zoomType: 'x'
            },
            credits: false,
            title: {
                text: 'Airtime Transactions'
            },
            subtitle: {
                text: 'All the airtime disbursements done'
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
                    text: 'Airtime Amount'
                }
            },
            legend: {
                enabled: true,
                title: {
                    text: 'STATUS CODES'
                }
            },
            series: [{
                name:'Total Airtime',
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

    assign_page(next_url: any, previous_url: any) {
        if (next_url != null) {
            this.next = this.get_page_num(next_url);
        }
        else {
            this.next = null;
        }

        if (previous_url != null) {
            this.previous = this.get_page_num(previous_url);
        }
        else {
            this.previous = null;
        }
    }

    download_airtime_report(event: any) {
        event.preventDefault();
        // console.log(this.airtime_reports)
        // i will use this to download contacts
        var list: any = [];
        var download: any = [];
        download[0] = "User Names";
        download[1] = "Phone Numbers";
        download[2] = "Amount Sent";
        download[3] = "Status";
        download[4] = "Updated At";
        list.push(download);
        for (var air of this.airtime_reports) {
            // console.log("airtime", airtime);
            var download: any = [];
            download[0] = air.names;
            download[1] = air.phone_number;
            download[2] = air.amount;
            download[3] = air.status;
            download[4] = air.updated_at;
            list.push(download);
        }
        // console.log('to be downloaded', list)

        var csvContent = "data:text/csv;charset=utf-8,";

        list.forEach(function (infoArray: any, index:any) {
            var smsDataString = infoArray.join(",");
            csvContent += index < list.length ? smsDataString + "\n" : smsDataString;

        });

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "AirtimeReport.csv");

        link.click();
    }

    setDate(date:any) {
        console.log("selected date is ", date);
        this.search_report = date;
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
            (start:any, end:any, label:any)=> {
                // get date range
                let dateRange = start.format('MM/DD/YYYY') + "-" + end.format('MM/DD/YYYY');

                // do the filter on api
                this.backendApi.filterAirtimeTransactions(dateRange).subscribe(
                    response=> {
                        // empty the list
                        this.airtime_reports = [];

                        this.paginated_count = true;

                        // populate page
                        for (var report of response.json().results) for (var rep of report.recipient_transactions) {
                            this.airtime_reports.push(rep);
                            let dateValue = new Date(rep.created_at);
                            // get dates for the charts in the format 2014-1-16
                            this.chartDates.push(`${dateValue.getFullYear()}-${dateValue.getMonth()+1}-${dateValue.getDate()}`);
                        }
                        // re-create the chart
                        this.create_chart(this.chartDates, this.airtime_reports);

                        // re-assign count, next and prev urls
                        this.counts = this.airtime_reports.length;
                        var next_url = response.json().next;
                        var previous_url = response.json().previous;
                        this.assign_page(next_url, previous_url);

                        console.log("the filter response: ", this.counts);
                    },
                    error=> {
                        sweetAlert("Error", "Error getting your filtered result", "warning");
                    });
            });
    }

}
