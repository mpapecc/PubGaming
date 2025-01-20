import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameHubService {
  private connection!: signalR.HubConnection;
  public isConnected: boolean = false;
  constructor(public router: Router) { }

  public async connect(callback: (connectionId: string) => void) {
    if (this.isConnected) {
      callback(this.connection.connectionId!);
      return;
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(environment.apiUrl + "game", {
        skipNegotiation: true,  // skipNegotiation as we specify WebSockets
        transport: signalR.HttpTransportType.WebSockets  // force WebSocket transport
      })
      .withAutomaticReconnect()
      .build();

    await this.connection.start().then(() => {
      this.isConnected = true;

      this.connection.on("Connected", (result: string) => {
        callback(result)
        localStorage.setItem("connectionId", result)
      })
      this.connection.on("RedirectToUrl", (url: string) => {
        this.router.navigate([url])
      });

    });
  }

  public tryReconnectHost(hostId: string, roomId: number) {
    this.connection.invoke("TryReconnectHost", hostId, roomId).then((result) => {
    });

  }

  public createGameRoom(name: string, callback: (roomId: number) => void) {
    this.connection.invoke("CreateGameRoom", name).then(callback);
  }

  public joinRoom(playerName: string, roomId: number) {
    return this.connection.invoke("JoinRoom", playerName, roomId);
  }

  public selectGame(roomId: number, gameId: number) {
    this.connection.invoke("SelectGame", roomId, gameId);
  }

  public startGame(roomId: number) {
    this.connection.invoke("StartGame", roomId);
  }

  public onNotifyGroupPlayerJoinedRoom(callback: (name: string) => void) {
    this.connection.on("NotifyGroupPlayerJoinedRoom", callback);
  }

  public onNotifyAdminPlayerJoinedRoom(callback: (name: string) => void) {
    this.connection.on("NotifyAdminPlayerJoinedRoom", callback);
  }
}
