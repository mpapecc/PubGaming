import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { QuizzesLibraryComponent } from '../quizzes-library/quizzes-library.component';
import { GameHubService } from 'src/app/services/hubs/game-hub.service';
import { GameService } from 'src/app/services/game.service';
import { HubConstants } from 'src/app/constants/hub.constants';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { HostService } from 'src/app/services/host.service';
import { HubService } from 'src/app/services/hubs/hub.service';
import { RoomHubService } from 'src/app/services/hubs/room-hub.service';
@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.css']
})
export class HostComponent implements OnInit {
  @ViewChild("quizzes") quizzesLibrary!: QuizzesLibraryComponent

  @Input() set roomId(roomId: string) {
    this._roomId = roomId ? parseInt(roomId) : 0;
  }
  _roomId!: number
  name: string = "";
  isLoading: boolean = false;
  hostConnectionId: string | null = "";

  constructor(
    public roomHubService: RoomHubService,
    public hostService: HostService,
  ) { }

  ngOnInit(): void {
    this.hostConnectionId = localStorage.getItem(HubConstants.HostConnectionId);

    this.hostService.isHostActive(this.hostConnectionId!, this._roomId).subscribe(result => {
      this.roomHubService.reconnectPossibleToRooms = result.availableRooms;
    });
  }
}
