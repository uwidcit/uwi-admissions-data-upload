import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'uwi-admissions-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private user: User;

  constructor(private auth: AngularFireAuth, private router: Router) {
    this.user = {
      email:'',
      password:''
    };
  }

  ngOnInit() {
  }

  private login(event: MouseEvent){
    this.auth.auth.signInWithEmailAndPassword(this.user.email, this.user.password)
    .then(user => {
      //console.log(user);
      this.router.navigate(['/']);
    })
    .catch(error => {
      console.log(error);
    });
  }

}

interface User {
  email: string;
  password: string;
}