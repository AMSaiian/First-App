import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { BoardsFeature } from "./board/state/boards.state";
import { CardsFeature } from "./card/state/cards.state";
import { ChangesFeature } from "./changes/state/changes.state";
import { GroupListsFeature } from "./group-list/state/group-lists.state";
import { PrioritiesFeature } from "./priorities/state/priorities.state";
import { BoardsEffects } from "./board/state/boards.effects";
import { CardsEffects } from "./card/state/cards.effects";
import { ChangesEffects } from "./changes/state/changes.effects";
import { GroupListsEffects } from "./group-list/state/group-lists.effects";
import { PrioritiesEffects } from "./priorities/state/priorities.effects";
import { provideHttpClient } from "@angular/common/http";
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { ErrorsEffects } from "./common/effects/errors.effects";

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideEffects(BoardsEffects, CardsEffects, ChangesEffects, GroupListsEffects, PrioritiesEffects, ErrorsEffects),
    provideStore(),
    provideState(BoardsFeature),
    provideState(CardsFeature),
    provideState(ChangesFeature),
    provideState(GroupListsFeature),
    provideState(PrioritiesFeature),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
    }),
  ]
};
