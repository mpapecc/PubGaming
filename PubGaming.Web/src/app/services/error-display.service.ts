import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorDisplayService {

  errorMessage : string = ""
  
  showError(errorMessage:string){
    this.errorMessage = errorMessage;
  }

  closeError(){
    this.errorMessage = "";
  }
}
