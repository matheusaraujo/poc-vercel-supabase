import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  loading = false;
  signInForm: FormGroup;

  constructor(
    private readonly supabase: SupabaseService,
    private readonly formBuilder: FormBuilder
  ) {
    this.signInForm = this.formBuilder.group({
      email: '',
    });
  }

  async onSubmit(): Promise<void> {
    if (this.signInForm.invalid) return;

    try {
      this.loading = true;
      const email = this.signInForm.get('email')?.value as string;
      const { error } = await this.supabase.signIn(email);
      if (error) throw error;
      alert('Check your email for the login link!');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      this.signInForm.reset();
      this.loading = false;
    }
  }

  async signInWithGoogle(): Promise<void> {
    await this.supabase.signInWithGoogle();
  }
}
