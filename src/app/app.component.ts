import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CapturaDatosComponent } from "./captura-datos/captura-datos.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CapturaDatosComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'NutribeDietas';
}
