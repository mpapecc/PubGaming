import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { QuizzesLibraryComponent } from '../quizzes-library/quizzes-library.component';
import { GameHubService } from 'src/app/services/hubs/game-hub.service';
import { GameService } from 'src/app/services/game.service';
import { HubConstants } from 'src/app/constants/hub.constants';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { HostService } from 'src/app/services/host.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.css']
})
export class HostComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild("quizzes") quizzesLibrary!: QuizzesLibraryComponent

  @Input() set roomId(roomId: string) {
    this._roomId = roomId ? parseInt(roomId) : 0;
  }
  _roomId!: number
  name: string = "";
  playersInRoom: any[] = [];
  selectedQuiz: any;
  isLoading: boolean = false;
  reconnectPossibleToRooms: any[] = []
  roomName = this.fb.control('')
  hostConnectionId: string | null = "";

  constructor(
    public gameHubService: GameHubService,
    public quizService: GameService,
    public router: Router,
    public fb: FormBuilder,
    public hostService: HostService,
    private location: Location,
    private elRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.hostConnectionId = localStorage.getItem(HubConstants.HostConnectionId);

    if (!this.hostConnectionId) {
      this.handleWhenReconnectNotPosible()
      return;
    }

    this.hostService.isHostActive(this.hostConnectionId, this._roomId).subscribe(result => {
      this.reconnectPossibleToRooms = result.availableRooms;

      if (result.isHostActive && this._roomId !== 0 && !this.gameHubService.isConnected) {
        this.reconnectToRoom(this._roomId);
      }
      else
        this.handleWhenReconnectNotPosible();
    });
  }

  ngAfterViewInit(): void {
    if (this._roomId)
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

  public reconnectIfPossibleAndCreateGameRoom = () => {
    this.isLoading = true;
    if (this.gameHubService.isConnected) {
      this.createGameRoom();
    }
    else if (!this.gameHubService.isConnected && this.hostConnectionId) {
      this.hostService.isHostActive(this.hostConnectionId).subscribe(result => {
        if (result.isHostActive)
          this.reconnectAndCreateRoom(this.hostConnectionId!);
        else
          this.connectAndCreateRoom();
      });
    }
    else
      this.connectAndCreateRoom();
  }

  private createGameRoom() {
    this.gameHubService.createGameRoom(this.roomName.value!, (roomId: number) => {
      this.setRoomId(roomId);
    }).then(() => this.isLoading = false);
  }

  reconnectAndCreateRoom(oldConnectionId: string) {
    this.gameHubService.connect((connectionId) => {
      this.gameHubService.reconnectHostWithNewConnectionId(oldConnectionId!).then(() => {
        this.createGameRoom();
      })

      localStorage.setItem(HubConstants.HostConnectionId, connectionId);

      this.gameHubService.onNotifyAdminPlayerJoinedRoom(playerName => this.playersInRoom.push(playerName));
    });
  }

  private connectAndCreateRoom() {
    this.gameHubService.connect((connectionId) => {
      localStorage.setItem(HubConstants.HostConnectionId, connectionId);
      this.createGameRoom()
    }).then(() => this.isLoading = false);;
  }

  private changeQuizCardOnClick = () => {
    this.quizzesLibrary.onQuizCardClick = (quizId) => {
      this.quizService.GetGameTemplateById(quizId).subscribe(result => {
        this.selectedQuiz = result;
        this.gameHubService.selectGame(this._roomId, quizId);
      })
    }
  }

  reconnectToRoom(roomId: number) {
    this.gameHubService.isConnected ? this.handleSoftReconnect(roomId) : this.handleHardReconnect(roomId);
  }

  private handleSoftReconnect(roomId: number) {
    var roomData = this.getRoomFromAvailableRoomsById(roomId);
    this.selectedQuiz = roomData.game
    this.playersInRoom = roomData.playersData
    this.setRoomId(roomId);
  }

  private handleHardReconnect(roomId: number) {
    let oldConnectionId = localStorage.getItem(HubConstants.HostConnectionId);

    this.gameHubService.connect((connectionId) => {
      this.gameHubService.reconnectHostWithNewConnectionId(oldConnectionId!);
      localStorage.setItem(HubConstants.HostConnectionId, connectionId);
      var roomData = this.getRoomFromAvailableRoomsById(roomId);
      this.selectedQuiz = roomData.game
      this.playersInRoom = roomData.playersData
      if (roomId > 0)
        this.setRoomId(roomId);

      this.gameHubService.onNotifyAdminPlayerJoinedRoom(playerName => this.playersInRoom.push(playerName));
    });
  }

  private handleWhenReconnectNotPosible() {
    this._roomId = 0;
    this.location.go("/host");
  }

  private setRoomId(roomId: number) {
    this._roomId = roomId;
    this.location.go(`/host/${roomId}`);
  }

  private getRoomFromAvailableRoomsById(roomId: number) {
    return this.reconnectPossibleToRooms.find(x => x.id === roomId)
  }
}
