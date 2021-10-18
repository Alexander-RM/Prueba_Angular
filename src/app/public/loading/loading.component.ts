import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  constructor() { 
    console.log("constructor");
  }

  ngOnInit(): void {
    console.log("init");
  }

}
