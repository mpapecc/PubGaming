import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { QuizzesLibraryComponent } from '../quizzes-library/quizzes-library.component';
import { GameHubService } from 'src/app/services/hubs/game-hub.service';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.css']
})
export class HostComponent implements AfterViewInit {
  @ViewChild("quizzes") quizzesLibrary!: QuizzesLibraryComponent

  @Input() set roomId(roomId: string) {
    this._roomId = parseInt(roomId)
  }
  _roomId!: number
  isRoomCreated: boolean = false;
  name: string = "";
  playersInRoom: string[] = [];
  selectedQuiz: any;

  constructor(
    public gameHubService: GameHubService,
    public quizService: GameService
  ) {
    let connectionIdFromLs = localStorage.getItem("connectionId");

    if (connectionIdFromLs) {
      console.log("found connection id in local storge  will try to recoonect");

      this.gameHubService.connect((connectionId) => {
        console.log(connectionId)
        console.log(connectionIdFromLs)
        this.gameHubService.tryReconnectHost(connectionIdFromLs!,this._roomId);

      });
      return;
    }
    
    // this.gameHubService.onNotifyAdminPlayerJoinedRoom(name => this.playersInRoom.push(name));
  }

  ngAfterViewInit(): void {
    this.quizzesLibrary.onQuizCardClick = (quizId) => {
      this.quizService.GetGameTemplateById(quizId).subscribe(result => {
        this.selectedQuiz = result;
        console.log(quizId)
        console.log(this._roomId)
        this.gameHubService.selectGame(this._roomId, parseInt(quizId));
      })
    }
  }

  startGame() {
    this.gameHubService.startGame(this._roomId);
  }
}
