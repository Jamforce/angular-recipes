import { InjectionToken, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { RestService, RestServiceImpl } from './rest.service';

export interface Match { id: string; team_casa: string; team_trasferta: string; data: string; }
export interface Team { id: string; nome: string; }

const config = { root: environment.baseUrl + '/api' };

export const MATCH_SERVICE = new InjectionToken<RestService<Match>>('Match RestService', {
  providedIn: 'root',
  factory: () => new RestServiceImpl('matches', inject(HttpClient), config),
});

export const TEAM_SERVICE = new InjectionToken<RestService<Team>>('Team RestService', {
  providedIn: 'root',
  factory: () => new RestServiceImpl('teams', inject(HttpClient), config),
});

