import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AppHeaderComponent } from '../app-header/app-header';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-stagiaire-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, AppHeaderComponent, MatButtonModule],
  templateUrl: './stagiaire-layout.html',
})
export class StagiaireLayoutComponent {}