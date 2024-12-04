import { Component, OnDestroy, OnInit } from '@angular/core';
import { IGX_CARD_DIRECTIVES, IGX_GRID_DIRECTIVES, IgxIconComponent } from 'igniteui-angular';
import { IgxCategoryChartModule, IgxPieChartModule } from 'igniteui-angular-charts';
import { Subject, take, takeUntil } from 'rxjs';
import { VoteResult } from '../models/uselections/vote-result';
import { Candidate } from '../models/uselections/candidate';
import { StateVoteResult } from '../models/uselections/state-vote-result';
import { VoteCountResult } from '../models/uselections/vote-count-result';
import { CandidateVoteResult } from '../models/uselections/candidate-vote-result';
import { StateService } from '../services/state.service';
import { USElectionsService } from '../services/uselections.service';

@Component({
  selector: 'app-candidates-and-votes',
  imports: [IGX_CARD_DIRECTIVES, IGX_GRID_DIRECTIVES, IgxCategoryChartModule, IgxIconComponent, IgxPieChartModule],
  templateUrl: './candidates-and-votes.component.html',
  styleUrls: ['./candidates-and-votes.component.scss']
})
export class CandidatesAndVotesComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public democratCandidate?: Candidate;
  public electoralVotesDemocrat?: VoteCountResult;
  public popularVotesDemocrat?: VoteCountResult;
  public republicanCandidate?: Candidate;
  public electoralVotesRepublican?: VoteCountResult;
  public popularVotesRepublican?: VoteCountResult;
  public uSElectionsVoteResult: VoteResult[] = [];
  public uSElectionsVoteResult1: VoteResult[] = [];
  public uSElectionsCandidateVoteResult: CandidateVoteResult[] = [];
  public uSElectionsStateVoteResult: StateVoteResult[] = [];

  constructor(private uSElectionsService: USElectionsService, protected stateService: StateService) { }

  ngOnInit() {
    this.uSElectionsService.democratCandidate.pipe(takeUntil(this.destroy$)).subscribe(x => this.democratCandidate = x);
    this.uSElectionsService.electoralVotesDemocrat.pipe(takeUntil(this.destroy$)).subscribe(x => this.electoralVotesDemocrat = x);
    this.uSElectionsService.popularVotesDemocrat.pipe(takeUntil(this.destroy$)).subscribe(x => this.popularVotesDemocrat = x);
    this.uSElectionsService.republicanCandidate.pipe(takeUntil(this.destroy$)).subscribe(x => this.republicanCandidate = x);
    this.uSElectionsService.electoralVotesRepublican.pipe(takeUntil(this.destroy$)).subscribe(x => this.electoralVotesRepublican = x);
    this.uSElectionsService.popularVotesRepublican.pipe(takeUntil(this.destroy$)).subscribe(x => this.popularVotesRepublican = x);
    this.stateService.currentlyChosenYear.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.uSElectionsService.getVoteResultList(this.stateService.currentlyChosenYear.value as any).pipe(take(1)).subscribe(data => this.uSElectionsVoteResult = data);
    });
    this.stateService.currentlyChosenYear.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.uSElectionsService.getVoteResultList1(this.stateService.currentlyChosenYear.value as any).pipe(take(1)).subscribe(data => this.uSElectionsVoteResult1 = data);
    });
    this.stateService.currentlyChosenYear.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.uSElectionsService.getCandidateVoteResultList(this.stateService.currentlyChosenYear.value as any).pipe(take(1)).subscribe(data => this.uSElectionsCandidateVoteResult = data);
    });
    this.stateService.currentlyChosenYear.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.uSElectionsService.getStateVoteResultList(this.stateService.currentlyChosenYear.value as any).pipe(take(1)).subscribe(data => this.uSElectionsStateVoteResult = data);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
