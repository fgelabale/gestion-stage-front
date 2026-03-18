import { Component, computed, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UsersService } from '../../core/services/users/users';

@Component({
  selector: 'app-admin-superviseurs',
  standalone: true,
  imports: [MatTableModule, MatFormFieldModule, MatInputModule],
  templateUrl: './admin-superviseurs.html',
})
export class AdminSuperviseursComponent {
  private usersService = inject(UsersService);

  displayedColumns = ['nom', 'email', 'nbStages'];

  superviseurs = signal<any[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');
  texteFilter = signal('');

  filteredSuperviseurs = computed(() => {
    const texte = this.texteFilter().trim().toLowerCase();

    return this.superviseurs().filter((row) => {
      const searchable = [row.prenom, row.nom, row.email]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return !texte || searchable.includes(texte);
    });
  });

  constructor() {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.usersService.getSuperviseurs().subscribe({
      next: (response: any) => {
        this.superviseurs.set(response ?? []);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger les superviseurs.');
        this.isLoading.set(false);
      },
    });
  }

  setTexteFilter(value: string): void {
    this.texteFilter.set(value);
  }
}