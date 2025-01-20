import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  isVisible:boolean = false;

  constructor() { }

  showLoader = () => this.isVisible = true;

  hideLoader = () => this.isVisible = false;
}
