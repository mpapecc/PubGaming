import { Component } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { GameHubService } from 'src/app/services/hubs/game-hub.service';
import { GameService } from 'src/app/services/game.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-game-room',
  templateUrl: './create-game-room.component.html',
  styleUrls: ['./create-game-room.component.css']
})
export class CreateGameRoomComponent {
  name: string = "";
  isLoading: boolean = false;

  roomName =  this.fb.control('')
  constructor(
    public gameHubService: GameHubService,
    public quizService: GameService,
    public router: Router,
    public fb: FormBuilder
  ) { }

  public createGameRoom = () =>  {
    this.isLoading = true;
    console.log(this.roomName.value)

    this.gameHubService.connect(() => {
      this.gameHubService.createGameRoom(this.roomName.value!, (roomId: number) => {
        this.isLoading = false;
        this.router.navigate([`/host/${roomId}`]);
      });
    });
  }
}
