import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, concatMap, Observable, of, take } from 'rxjs';
import { StateService } from './state.service';
import { YearModel } from '../models/uselections/year-model';
import { VoteResult } from '../models/uselections/vote-result';
import { Candidate } from '../models/uselections/candidate';
import { StateVoteResult } from '../models/uselections/state-vote-result';
import { VoteCountResult } from '../models/uselections/vote-count-result';
import { CandidateVoteResult } from '../models/uselections/candidate-vote-result';
import { ErrorHandlerService } from './error-handler.service';

const API_ENDPOINT = 'https://elections.appbuilder.dev';

@Injectable({
  providedIn: 'root'
})
export class USElectionsService {
  constructor(
    private http: HttpClient,
    private stateService: StateService
  ) { }

  private _electoralVotesRepublican$!: BehaviorSubject<VoteCountResult | undefined>;

  public get electoralVotesRepublican(): BehaviorSubject<VoteCountResult | undefined> {
    if (!this._electoralVotesRepublican$) {
      this._electoralVotesRepublican$ = new BehaviorSubject<VoteCountResult | undefined>(undefined);
      this.stateService.currentlyChosenYear.pipe(
        concatMap(() => this.getElectoralVotesRepublican(this.stateService.currentlyChosenYear.value as any, 'Republican').pipe(take(1), catchError(() => of(undefined))))
      ).subscribe(v => this._electoralVotesRepublican$.next(v));
    }
    return this._electoralVotesRepublican$;
  }

  private _popularVotesDemocrat$!: BehaviorSubject<VoteCountResult | undefined>;

  public get popularVotesDemocrat(): BehaviorSubject<VoteCountResult | undefined> {
    if (!this._popularVotesDemocrat$) {
      this._popularVotesDemocrat$ = new BehaviorSubject<VoteCountResult | undefined>(undefined);
      this.stateService.currentlyChosenYear.pipe(
        concatMap(() => this.getPopularVotesDemocrat(this.stateService.currentlyChosenYear.value as any, 'Democrat').pipe(take(1), catchError(() => of(undefined))))
      ).subscribe(v => this._popularVotesDemocrat$.next(v));
    }
    return this._popularVotesDemocrat$;
  }

  private _democratCandidate$!: BehaviorSubject<Candidate | undefined>;

  public get democratCandidate(): BehaviorSubject<Candidate | undefined> {
    if (!this._democratCandidate$) {
      this._democratCandidate$ = new BehaviorSubject<Candidate | undefined>(undefined);
      this.stateService.currentlyChosenYear.pipe(
        concatMap(() => this.getDemocratCandidate(this.stateService.currentlyChosenYear.value as any).pipe(take(1), catchError(() => of(undefined))))
      ).subscribe(v => this._democratCandidate$.next(v));
    }
    return this._democratCandidate$;
  }

  private _electoralVotesDemocrat$!: BehaviorSubject<VoteCountResult | undefined>;

  public get electoralVotesDemocrat(): BehaviorSubject<VoteCountResult | undefined> {
    if (!this._electoralVotesDemocrat$) {
      this._electoralVotesDemocrat$ = new BehaviorSubject<VoteCountResult | undefined>(undefined);
      this.stateService.currentlyChosenYear.pipe(
        concatMap(() => this.getElectoralVotesRepublican(this.stateService.currentlyChosenYear.value as any, 'Democrat').pipe(take(1), catchError(() => of(undefined))))
      ).subscribe(v => this._electoralVotesDemocrat$.next(v));
    }
    return this._electoralVotesDemocrat$;
  }

  private _popularVotesRepublican$!: BehaviorSubject<VoteCountResult | undefined>;

  public get popularVotesRepublican(): BehaviorSubject<VoteCountResult | undefined> {
    if (!this._popularVotesRepublican$) {
      this._popularVotesRepublican$ = new BehaviorSubject<VoteCountResult | undefined>(undefined);
      this.stateService.currentlyChosenYear.pipe(
        concatMap(() => this.getPopularVotesDemocrat(this.stateService.currentlyChosenYear.value as any, 'Republican').pipe(take(1), catchError(() => of(undefined))))
      ).subscribe(v => this._popularVotesRepublican$.next(v));
    }
    return this._popularVotesRepublican$;
  }

  private _republicanCandidate$!: BehaviorSubject<Candidate | undefined>;

  public get republicanCandidate(): BehaviorSubject<Candidate | undefined> {
    if (!this._republicanCandidate$) {
      this._republicanCandidate$ = new BehaviorSubject<Candidate | undefined>(undefined);
      this.stateService.currentlyChosenYear.pipe(
        concatMap(() => this.getRepublicanCandidate(this.stateService.currentlyChosenYear.value as any).pipe(take(1), catchError(() => of(undefined))))
      ).subscribe(v => this._republicanCandidate$.next(v));
    }
    return this._republicanCandidate$;
  }

  public getYearModelList(): Observable<YearModel[]> {
    return this.http.get<YearModel[]>(`${API_ENDPOINT}/api/Election/years`)
      .pipe(catchError(ErrorHandlerService.handleError<YearModel[]>('getYearModelList', [])));
  }

  public getVoteResultList(year: number): Observable<VoteResult[]> {
    if (!year) {
      return of([]);
    }
    return this.http.get<VoteResult[]>(`${API_ENDPOINT}/api/Election/electoral-votes/${year}`)
      .pipe(catchError(ErrorHandlerService.handleError<VoteResult[]>('getVoteResultList', [])));
  }

  public getVoteResultList1(year: number): Observable<VoteResult[]> {
    if (!year) {
      return of([]);
    }
    return this.http.get<VoteResult[]>(`${API_ENDPOINT}/api/Election/popular-votes/${year}`)
      .pipe(catchError(ErrorHandlerService.handleError<VoteResult[]>('getVoteResultList1', [])));
  }

  public getCandidateVoteResultList(year: number): Observable<CandidateVoteResult[]> {
    if (!year) {
      return of([]);
    }
    return this.http.get<CandidateVoteResult[]>(`${API_ENDPOINT}/api/Election/votes/${year}/by-candidate`)
      .pipe(catchError(ErrorHandlerService.handleError<CandidateVoteResult[]>('getCandidateVoteResultList', [])));
  }

  public getStateVoteResultList(year: number): Observable<StateVoteResult[]> {
    if (!year) {
      return of([]);
    }
    return this.http.get<StateVoteResult[]>(`${API_ENDPOINT}/api/Election/popular-votes/${year}/by-state`)
      .pipe(catchError(ErrorHandlerService.handleError<StateVoteResult[]>('getStateVoteResultList', [])));
  }

  public getElectoralVotesRepublican(year: number, party: string): Observable<VoteCountResult | undefined> {
    if (!year || !party) {
      return of(undefined);
    }
    return this.http.get<VoteCountResult | undefined>(`${API_ENDPOINT}/api/Election/electoral-votes/${year}/${party}`)
      .pipe(catchError(ErrorHandlerService.handleError<VoteCountResult | undefined>('getElectoralVotesRepublican', undefined)));
  }

  public getPopularVotesDemocrat(year: number, party: string): Observable<VoteCountResult | undefined> {
    if (!year || !party) {
      return of(undefined);
    }
    return this.http.get<VoteCountResult | undefined>(`${API_ENDPOINT}/api/Election/popular-votes/${year}/${party}`)
      .pipe(catchError(ErrorHandlerService.handleError<VoteCountResult | undefined>('getPopularVotesDemocrat', undefined)));
  }

  public getDemocratCandidate(year: number): Observable<Candidate | undefined> {
    if (!year) {
      return of(undefined);
    }
    return this.http.get<Candidate | undefined>(`${API_ENDPOINT}/api/Election/democratic-candidate/${year}`)
      .pipe(catchError(ErrorHandlerService.handleError<Candidate | undefined>('getDemocratCandidate', undefined)));
  }

  public getRepublicanCandidate(year: number): Observable<Candidate | undefined> {
    if (!year) {
      return of(undefined);
    }
    return this.http.get<Candidate | undefined>(`${API_ENDPOINT}/api/Election/republican-candidate/${year}`)
      .pipe(catchError(ErrorHandlerService.handleError<Candidate | undefined>('getRepublicanCandidate', undefined)));
  }
}
