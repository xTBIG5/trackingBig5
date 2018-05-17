import { Component, OnInit, ViewChild } from '@angular/core';
import { GuarderService } from '../guarder.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	@ViewChild("userName") userName:any
	@ViewChild("password") password:any
	message=""
  constructor(private guarder:GuarderService, private router:Router) { }

  ngOnInit() {

  }
  login(){
  	let userName = this.userName.nativeElement.value
  	let password = this.password.nativeElement.value
  	let user = this.guarder.getUserTest(userName, password)
  	if(!user._id){
  		this.message = "Your user name or password is wrong."
  		return
  	}
  	this.guarder.setUser(user)
  	this.router.navigate(['/dashboard'])

  }

}
