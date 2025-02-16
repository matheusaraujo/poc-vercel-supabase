import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthSession } from '@supabase/supabase-js';
import { Profile, SupabaseService } from '../supabase.service';
import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AvatarComponent],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  loading = false;
  profile!: Profile;

  @Input()
  session!: AuthSession;

  updateProfileForm: FormGroup;

  constructor(
    private readonly supabase: SupabaseService,
    private readonly formBuilder: FormBuilder
  ) {
    this.updateProfileForm = this.formBuilder.group({
      username: '',
      website: '',
      avatar_url: '',
    });
  }

  async ngOnInit(): Promise<void> {
    if (!this.session) return;

    await this.getProfile();

    if (this.profile) {
      this.updateProfileForm.patchValue({
        username: this.profile.username,
        website: this.profile.website,
        avatar_url: this.profile.avatar_url,
      });
    }
  }

  async getProfile(): Promise<void> {
    try {
      this.loading = true;
      if (!this.session?.user) throw new Error('User session not found');

      const { data: profile, error, status } = await this.supabase.profile(this.session.user);
      if (error && status !== 406) throw error;

      if (profile) {
        this.profile = profile;
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      this.loading = false;
    }
  }

  async updateProfile(): Promise<void> {
    try {
      this.loading = true;
      if (!this.session?.user) throw new Error('User session not found');

      const { id } = this.session.user;
      const { username, website, avatar_url } = this.updateProfileForm.value;

      const { error } = await this.supabase.updateProfile({
        id,
        username: username as string,
        website: website as string,
        avatar_url: avatar_url as string,
      });

      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      this.loading = false;
    }
  }

  async signOut(): Promise<void> {
    await this.supabase.signOut();
  }

  get avatarUrl() {
    return this.updateProfileForm.value.avatar_url as string
  }

  async updateAvatar(event: string): Promise<void> {
    this.updateProfileForm.patchValue({
      avatar_url: event,
    })
    await this.updateProfile()
  }
}
