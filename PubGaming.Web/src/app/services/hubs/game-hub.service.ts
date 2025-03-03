import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HubService } from './hub.service';

@Injectable({
  providedIn: 'root'
})
export class GameHubService {
  selectedQuiz: any;
  
  constructor(
    public router: Router,
    public hubService: HubService
  ) {
  }

  public tryReconnectHost(hostId: string, roomId: number) {
    this.hubService.connection.invoke(GameHubServiceActions.TryReconnectHost, hostId, roomId);
  }

  public createGameRoom(name: string, callback: (roomId: number) => void) {
    return this.hubService.connection.invoke(GameHubServiceActions.CreateGameRoom, name).then(callback);
  }

  public joinRoom(playerName: string, roomId: number) {
    return this.hubService.connection.invoke(GameHubServiceActions.JoinRoom, playerName, roomId);
  }

  public selectGame(roomId: number, gameId: number) {
    this.hubService.connection.invoke(GameHubServiceActions.SelectGame, roomId, gameId);
  }

  public startGame(roomId: number) {
    this.hubService.connection.invoke(GameHubServiceActions.StartGame, roomId);
  }

  public onNotifyGroupPlayerJoinedRoom(callback: (name: string) => void) {
    this.hubService.connection.on(GameHubServiceActions.NotifyGroupPlayerJoinedRoom, callback);
  }

  public onNotifyAdminPlayerJoinedRoom(callback: (name: any) => void) {
    this.hubService.connection.on(GameHubServiceActions.NotifyAdminPlayerJoinedRoom, callback);
  }



}

export enum GameHubServiceActions {
  Connected = "Connected",
  RedirectToUrl = "RedirectToUrl",
  TryReconnectHost = "TryReconnectHost",
  CreateGameRoom = "CreateGameRoom",
  JoinRoom = "JoinRoom",
  SelectGame = "SelectGame",
  StartGame = "StartGame",
  NotifyGroupPlayerJoinedRoom = "NotifyGroupPlayerJoinedRoom",
  NotifyAdminPlayerJoinedRoom = "NotifyAdminPlayerJoinedRoom",
  ReconnectHostWithNewConnectionId = "ReconnectHostWithNewConnectionId"
}
