import { CartService } from './../cart.service';
import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: any = {
    username: '',
    email: '',
    password: '',
    isAdmin: 'false'
  };
  passwordConf: '';


  options = new RequestOptions({ withCredentials: true });
  baseUrl = 'http://localhost:8080/user/';

  constructor(public http: Http, public router: Router, public cart: CartService) {
    this.cart.getQuantity();
  }

  validation() {
    if (this.user.password !== this.passwordConf) {
      return alert('Jelszó nem egyezik.');
    } else {
      this.register();
      this.router.navigate(['/main']);
    }
  }

  register() {
    this.http.post(this.baseUrl + 'register', this.user, this.options)
      .subscribe(data => {
        console.log(data['_body']);
      });
  }

  ngOnInit() {
  }

}
