import {Component, ViewChild, Input, Output, EventEmitter} from '@angular/core';
declare var jQuery:any;

@Component({
  selector: 'select-group',
  inputs: ['groups', "selectedValues"],
  outputs: ['selected_values'],
  template: `
  <select #select multiple="" class="ui fluid search dropdown" (change)="change($event.target.options)" id="multi-select">
    <option *ngFor="let item of groups" [value]="item.id">
      {{item.name}}
    </option>
  </select>
`
})
export class MultipleGroupSelect {
  @ViewChild('select') selectElRef: any;
  public groups: Array<any>;
  public selected_values: any = new EventEmitter();
  public selectedValues :Array<any> = [];

  // constructor() { console.clear(); }
  ngAfterViewInit(){
    this.updateSelectList();
    eval("$('#multi-select').dropdown();");
  }
  updateSelectList() {
    let options = this.selectElRef.nativeElement.options;
    for(let i=0; i < options.length; i++) {
      for (let j=0; j < this.selectedValues.length; j++){
        if (options[i].value == this.selectedValues[j].id){
          options[i].selected = true;
        }
      }
    }
    this.change(options)

  }
  change(options: any) {
    this.selectedValues = Array.apply(null,options)
      .filter((option: any) => option.selected)
      .map((option: any) => option.value);
    this.selected_values.next(this.selectedValues);
  }
}