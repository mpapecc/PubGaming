import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { GameHubServiceActions } from './game-hub.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HubService {
  public connection!: signalR.HubConnection;
  isConnected : boolean = false;

  constructor(public router: Router) { }

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

        this.connection.on(GameHubServiceActions.RedirectToUrl, (url: string) => {
          this.router.navigate([url]);
        });
      });
    }
}
