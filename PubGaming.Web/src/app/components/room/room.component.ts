import { AfterViewChecked, AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { GameHubService } from 'src/app/services/hubs/game-hub.service';
import { RoomHubService } from 'src/app/services/hubs/room-hub.service';
import { QuizzesLibraryComponent } from '../quizzes-library/quizzes-library.component';
import { RoomService } from 'src/app/services/room.service';
import { HubConstants } from 'src/app/constants/hub.constants';
import { HubService } from 'src/app/services/hubs/hub.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements AfterViewInit, AfterViewChecked, OnInit {
  _roomId!: number
  @ViewChild("quizzes") quizzesLibrary!: QuizzesLibraryComponent

  constructor(
    public gameHubService: GameHubService,
    public roomHubService: RoomHubService,
    public hubService: HubService,
    public roomService: RoomService,
    public gameService: GameService
  ) { }

  @Input() set roomId(roomId: string) {
    this._roomId = roomId ? parseInt(roomId) : 0;
  }

  ngOnInit(): void {

    if(!this.hubService.connection){
      this.roomHubService.handleHardReconnect(this._roomId);
    }
    
    let hostConnectionId = localStorage.getItem(HubConstants.HostConnectionId);

    this.roomService.getRoomData(hostConnectionId!, this._roomId!).subscribe((result: any)=>{
      this.gameHubService.selectedQuiz = result.game;
      this.roomHubService.playersInRoom = result.playersData;
    })
  }

  ngAfterViewInit(): void {
    if (this.quizzesLibrary)
      this.changeQuizCardOnClick();
  }

  ngAfterViewChecked() {
    if (this.quizzesLibrary) {
      this.changeQuizCardOnClick();
    }
  }

  startGame = () => {
    this.gameHubService.startGame(this._roomId);
  }

  private changeQuizCardOnClick = () => {
    this.quizzesLibrary.onQuizCardClick = (quizId) => {
      this.gameService.GetGameTemplateById(quizId).subscribe(result => {
        this.gameHubService.selectedQuiz = result;
        this.gameHubService.selectGame(this._roomId, quizId);
      })
    }
  }
}
