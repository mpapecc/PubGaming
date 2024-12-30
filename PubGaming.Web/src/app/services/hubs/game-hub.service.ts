import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameHubService {
  private connection!:signalR.HubConnection;

  constructor() { }

  public async connect() : Promise<signalR.HubConnection>{
    this.connection = new signalR.HubConnectionBuilder()
    .withUrl(environment.apiUrl + "game", {
      skipNegotiation: true,  // skipNegotiation as we specify WebSockets
      transport: signalR.HttpTransportType.WebSockets  // force WebSocket transport
    })
    .build();

    await this.connection.start();
    return this.connection;
  }

  public createGameRoom(name: string, callback : (roomId:number) => void){
    this.connection.invoke("CreateGameRoom", name).then(callback);
  }

  public joinRoom(playerName:string, roomId:string){
    return this.connection.invoke("JoinRoom", playerName, roomId);
  }

  public selectGame(gameType: number, gameId:number){
    this.connection.invoke("SelectGame", gameType, gameId);
  }

  public startGame(roomId:number){
    this.connection.invoke("StartGame", roomId);
  }

  public onNotifyGroupPlayerJoinedRoom(callback : (name:string) => void){
    this.connection.on("NotifyGroupPlayerJoinedRoom", callback);
  }

  public onNotifyAdminPlayerJoinedRoom(callback : (name:string) => void){
    this.connection.on("NotifyAdminPlayerJoinedRoom", callback);
  }
}
