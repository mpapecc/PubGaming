import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameHubService {
  private connection!: signalR.HubConnection;
  constructor(public router: Router) { }
  isConnected : boolean = false;
  public async connect(callback: (connectionId: string) => void) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(environment.apiUrl + "game", {
        skipNegotiation: true,  // skipNegotiation as we specify WebSockets
        transport: signalR.HttpTransportType.WebSockets  // force WebSocket transport
      })
      .withAutomaticReconnect()
      .build();

    await this.connection.start().then(() => {
      this.connection.on(GameHubServiceActions.Connected, (result: string) => {
        callback(result);
        this.isConnected = true;
      })
      this.connection.on(GameHubServiceActions.RedirectToUrl, (url: string) => {
        this.router.navigate([url]);
      });

    });
  }

  public tryReconnectHost(hostId: string, roomId: number) {
    this.connection.invoke(GameHubServiceActions.TryReconnectHost, hostId, roomId);
  }

  public createGameRoom(name: string, callback: (roomId: number) => void) {
    return this.connection.invoke(GameHubServiceActions.CreateGameRoom, name).then(callback);
  }

  public joinRoom(playerName: string, roomId: number) {
    return this.connection.invoke(GameHubServiceActions.JoinRoom, playerName, roomId);
  }

  public selectGame(roomId: number, gameId: number) {
    this.connection.invoke(GameHubServiceActions.SelectGame, roomId, gameId);
  }

  public startGame(roomId: number) {
    this.connection.invoke(GameHubServiceActions.StartGame, roomId);
  }

  public onNotifyGroupPlayerJoinedRoom(callback: (name: string) => void) {
    this.connection.on(GameHubServiceActions.NotifyGroupPlayerJoinedRoom, callback);
  }

  public onNotifyAdminPlayerJoinedRoom(callback: (name: string) => void) {
    this.connection.on(GameHubServiceActions.NotifyAdminPlayerJoinedRoom, callback);
  }

  public reconnectHostWithNewConnectionId(oldConnectionId:string){
    return this.connection.invoke(GameHubServiceActions.ReconnectHostWithNewConnectionId, oldConnectionId);
  }  
}

enum GameHubServiceActions {
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
