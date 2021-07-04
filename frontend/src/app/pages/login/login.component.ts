import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username;
  password;

  constructor(
    private authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
  }

  login() {
    this.authService.login(this.username, this.password)
    .subscribe();
  }
}
