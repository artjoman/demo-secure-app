import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.css']
})
export class PrivateComponent implements OnInit {

  users = [];

  constructor(
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
    this.dataService.getUsers()
      .subscribe((users) => {
        this.users = users;
      })
  }

}
