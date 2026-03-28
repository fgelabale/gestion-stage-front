import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { StagesService } from '../../core/services/stage/stages.service';
import { AuthStore } from '../../core/services/auth-api/auth.store';

@Component({
  selector: 'app-stagiaire-dashboard',
  standalone: true,
  imports: [DatePipe, RouterLink, MatCardModule, MatButtonModule],
  templateUrl: './stagiaire-dashboard-component.html'
})
export class StagiaireDashboardComponent implements OnInit {
  private stagesService = inject(StagesService);

  stages = signal<any[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  private authStore = inject(AuthStore);

  // 🔥 IMPORTANT
  currentUser = this.authStore.utilisateur;

  ngOnInit(): void {
    this.stagesService.getMesStages().subscribe({
      next: (response: any) => {
        this.stages.set(response ?? []);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger vos stages.');
        this.isLoading.set(false);
      },
    });
  }

  getMissingWeeks(stage: any): number[] {
    const semainesAttendues = [1, 2, 3, 4, 5, 6, 7];
    const semainesRemplies = (stage.rapportsHebdomadaires ?? []).map(
      (r: any) => r.numeroSemaine,
    );
    return semainesAttendues.filter((s) => !semainesRemplies.includes(s));
  }

  getFirstMissingWeek(stage: any): number {
    const missing = this.getMissingWeeks(stage);
    return missing.length ? missing[0] : 1;
  }
}