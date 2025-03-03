import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GameHubService } from 'src/app/services/hubs/game-hub.service';
import { HubService } from 'src/app/services/hubs/hub.service';
import { RoomHubService } from 'src/app/services/hubs/room-hub.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';

@Component({
  selector: 'app-join-game-form',
  templateUrl: './join-game-form.component.html',
  styleUrls: ['./join-game-form.component.css']
})
export class JoinGameFormComponent {

  constructor(
    private fb: FormBuilder, 
    private toastMessageService: ToastMessageService,
    private gameHubService:GameHubService,
    private hubService: HubService
  ) {}
  
  profileForm = this.fb.group({
    name: this.fb.control(''),
    roomId: this.fb.control('')
  });

  onSubmit() {
    console.log("i m")
    let playerName = this.profileForm.get("name")!.value!; 
    let roomId = this.profileForm.get("roomId")!.value!; 

    this.hubService.connect(() => {
      this.gameHubService.joinRoom(playerName.toString(), parseInt(roomId)).then(() => {
        this.gameHubService.onNotifyGroupPlayerJoinedRoom(name => console.log(`Player with name ${name} joined group`));
      });
    });
    
  }
}
