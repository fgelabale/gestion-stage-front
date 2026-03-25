import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { EntreprisesService } from '../../core/services/entreprises/entreprises';

@Component({
  selector: 'app-admin-entreprises',
  standalone: true,
  imports: [CommonModule, RouterLink, MatTableModule, MatButtonModule],
  templateUrl: './admin-entreprises.html',
})
export class AdminEntreprises implements OnInit {
  private entreprisesService = inject(EntreprisesService);

  entreprises = signal<any[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  displayedColumns = ['nom', 'adresse', 'telephone', 'actions'];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.entreprisesService.findAll().subscribe({
      next: (data: any) => {
        this.entreprises.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message || 'Impossible de charger les entreprises.');
        this.isLoading.set(false);
      },
    });
  }

  formatAdresse(entreprise: any): string {
    const ligne1 = [entreprise.numeroRue, entreprise.nomRue].filter(Boolean).join(' ');
    const ligne2 = [entreprise.ville, entreprise.province, entreprise.codePostal]
      .filter(Boolean)
      .join(', ');
    return [ligne1, ligne2].filter(Boolean).join(' - ');
  }
}