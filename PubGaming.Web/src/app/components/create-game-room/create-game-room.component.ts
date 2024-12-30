import { AfterViewInit, Component, ViewChild, ViewChildren } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { GameHubService } from 'src/app/services/hubs/game-hub.service';
import { QuizzesLibraryComponent } from '../quizzes-library/quizzes-library.component';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-create-game-room',
  templateUrl: './create-game-room.component.html',
  styleUrls: ['./create-game-room.component.css']
})
export class CreateGameRoomComponent {

  @ViewChild("quizzes") quizzesLibrary!:QuizzesLibraryComponent

  connection!:signalR.HubConnection
  isRoomCreated:boolean = false;
  isConnected:boolean = false;
  name:string = "";
  roomId:number = 0;
  playersInRoom : string[] = [];
  selectedQuiz:any;

  constructor(
    public gameHubService: GameHubService,
    public quizService: GameService
  ){}

  public createGameRoom(){
    this.gameHubService.connect().then((connection) => {
      this.connection = connection;

      this.gameHubService.createGameRoom(this.name, (roomId:number) => {
        this.roomId = roomId;
        this.isRoomCreated = true;
        setTimeout(() => {
          console.log(this.quizzesLibrary)
          this.quizzesLibrary.onQuizCardClick = (quizId) => {
            this.quizService.GetGameTemplateById(quizId).subscribe(result => {
              this.selectedQuiz = result;
              this.gameHubService.selectGame(roomId, parseInt(quizId));
            })
          }
        })

      });

      this.gameHubService.onNotifyAdminPlayerJoinedRoom(name => this.playersInRoom.push(name));
    });
  }

  startGame() {
    this.gameHubService.startGame(this.roomId);
  }
}
