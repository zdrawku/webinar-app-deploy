import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IGX_NAVBAR_DIRECTIVES, IGX_NAVIGATION_DRAWER_DIRECTIVES, IgxIconButtonDirective, IgxIconComponent, IgxOverlayOutletDirective, IgxRippleDirective, IgxToggleActionDirective, IgxToggleDirective } from 'igniteui-angular';
import { Subject, takeUntil } from 'rxjs';
import { YearModel } from './models/uselections/year-model';
import { StateService } from './services/state.service';
import { USElectionsService } from './services/uselections.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, IGX_NAVBAR_DIRECTIVES, IGX_NAVIGATION_DRAWER_DIRECTIVES, IgxIconButtonDirective, IgxIconComponent, IgxOverlayOutletDirective, IgxRippleDirective, IgxToggleActionDirective, IgxToggleDirective],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public uSElectionsYearModel: YearModel[] = [];

  constructor(private uSElectionsService: USElectionsService, private stateService: StateService) { }

  ngOnInit() {
    this.uSElectionsService.getYearModelList().pipe(takeUntil(this.destroy$)).subscribe(data => this.uSElectionsYearModel = data);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public navDrawerItemClick(item: YearModel) {
    this.stateService.currentlyChosenYear.next(item.year);
  }
}
