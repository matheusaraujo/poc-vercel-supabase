import { Component, OnInit } from '@angular/core';
import { AuthComponent } from './auth/auth.component';
import { AccountComponent } from './account/account.component';
import { SupabaseService } from './supabase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, AuthComponent, AccountComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'angular-user-management'

  session: any;

  constructor(private readonly supabase: SupabaseService) {}

  ngOnInit() {
    this.session = this.supabase.session;
    this.supabase.authChanges((_, session) => (this.session = session))
  }
}
