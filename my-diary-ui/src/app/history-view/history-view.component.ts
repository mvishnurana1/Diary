import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'history-view',
  templateUrl: './history-view.component.html',
  styleUrls: ['./history-view.component.scss']
})
export class HistoryViewComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
  }

  dateChanged(event: any) {
    console.log(event.target?.value);
    const selected = event.target?.value
    const today = new Date();

    console.log('selected: ', selected);
    console.log('today: ', today);
  }
}
