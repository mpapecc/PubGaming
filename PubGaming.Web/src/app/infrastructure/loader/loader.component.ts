import { Component, Input } from '@angular/core';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {

constructor(public loaderService: LoaderService) { }

@Input() isVisible:boolean = false;

}
