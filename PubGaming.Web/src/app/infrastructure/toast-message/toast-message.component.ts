import { Component } from '@angular/core';
import { ToastMessageService } from 'src/app/services/toast-message.service';

@Component({
  selector: 'app-toast-message',
  templateUrl: './toast-message.component.html',
  styleUrls: ['./toast-message.component.css']
})
export class ToastMessageComponent {

  constructor(public toastMessageService: ToastMessageService){}
}
