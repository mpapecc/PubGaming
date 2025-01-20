import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { jwtDecode } from "jwt-decode";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {

  constructor(
    private fb: FormBuilder,
    private authService: AuthService) { }

  loginForm = this.fb.group({
    email: this.fb.control(''),
    password: this.fb.control('')
  });

  onSubmit() {
    this.authService.login(this.loginForm.getRawValue()).subscribe((result: any) => {
      this.authService.jwt = result.message;
      let jwt = jwtDecode(result.message);
      console.log(jwt)
    })
  }

  authentificate = () => {
    this.authService.authentificate().subscribe();
  }
}
