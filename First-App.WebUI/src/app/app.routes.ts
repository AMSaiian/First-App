import { Routes } from '@angular/router';
import { BoardComponent } from "./board/components/board.component";

export const routes: Routes = [{ path: 'boards/:id', component: BoardComponent }];
