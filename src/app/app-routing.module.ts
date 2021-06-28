import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './core/components/login/login.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { PagesComponent } from './pages/pages.component';
import { AuthGuard } from './core/services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'pages',
    canActivate: [AuthGuard],
    component: PagesComponent,
    children: [
      {
        path: 'member',
        loadChildren: () =>
          import('./pages/member/member.module').then((m) => m.MemberModule),
      },
      {
        path: 'news',
        loadChildren: () =>
          import('./pages/news/news.module').then((m) => m.NewsModule),
      },
      {
        path: 'announcement',
        loadChildren: () =>
          import('./pages/announcement/announcement.module').then(
            (m) => m.AnnouncementModule
          ),
      },
      {
        path: 'not-found',
        component: NotFoundComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/pages/not-found',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
