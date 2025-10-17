import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatIconModule, MatButtonModule],
  template: `
    <mat-toolbar color="primary" class="toolbar">
      <button mat-icon-button routerLink="/products">
        <mat-icon>store</mat-icon>
      </button>
      <span class="title">Products Store</span>
      <span class="spacer"></span>
      <button mat-button routerLink="/products">
        <mat-icon>home</mat-icon>
        Inicio
      </button>
      <button mat-button routerLink="/products/new">
        <mat-icon>add</mat-icon>
        Nuevo
      </button>
    </mat-toolbar>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrls: ['./app.scss']
})
export class AppComponent {}