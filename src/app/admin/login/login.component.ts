import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RealtimeService } from '../../services/realtime.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private subscription : Subscription;
  
  password : string;
  loginError : boolean = false;

  constructor(private realtimeService : RealtimeService, private router : Router) { }

  ngOnInit() {
  }

  authenticate() {
    this.subscription = this.realtimeService.authenticate(this.password).subscribe(success => {
      if (success) {
        this.router.navigate(['/admin']);
      } else {
        this.loginError = true;
      }
      this.subscription.unsubscribe();
    });
  }
}
