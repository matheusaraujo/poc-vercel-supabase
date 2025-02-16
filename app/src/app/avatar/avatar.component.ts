import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css'],
})
export class AvatarComponent {
  _avatarUrl: SafeResourceUrl | undefined;
  uploading = false;

  @Input()
  set avatarUrl(url: string | null) {
    if (url) {
      this.downloadImage(url);
    }
  }

  @Output() upload = new EventEmitter<string>();

  constructor(
    private readonly supabase: SupabaseService,
    private readonly dom: DomSanitizer
  ) {}

  async downloadImage(path: string): Promise<void> {
    try {
      const { data } = await this.supabase.downLoadImage(path);
      if (data instanceof Blob) {
        this._avatarUrl = this.dom.bypassSecurityTrustResourceUrl(URL.createObjectURL(data));
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error downloading image:', error.message);
      }
    }
  }

  async uploadAvatar(event: Event): Promise<void> {
    try {
      this.uploading = true;
      const input = event.target as HTMLInputElement;
      if (!input.files || input.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = input.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

      await this.supabase.uploadAvatar(filePath, file);
      this.upload.emit(filePath);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      this.uploading = false;
    }
  }
}
