// app.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getLinkPreview } from 'link-preview-js';
import { data } from '../../public/data';
interface PreviewData {
  url: string;
  preview: any;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  previews: PreviewData[] = [];
  loading = false;

  ngOnInit() {
    this.loadPreviews();
  }

  async loadPreviews() {
    
    const urls = data
      .map((item) => item.public_url)
      .filter((url) => url && url !== 'null' && url !== '');

    const uniqueUrls = [...new Set(urls)];

    this.loading = true;
    for (const url of uniqueUrls) {
      if (url) {
        try {
          const preview = await getLinkPreview(url);
          this.previews.push({ url, preview });
        } catch (error) {
          console.error('Error fetching link preview:', error);
          this.previews.push({ url, preview: null });
        }
      }
    }
    this.loading = false;
  }

  // Keep the existing onInputChange method for manual input
  async onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const url = input.value.trim();

    if (url) {
      try {
        const preview = await getLinkPreview(url);
        this.previews.unshift({ url, preview });
      } catch (error) {
        console.error('Error fetching link preview:', error);
        this.previews.unshift({ url, preview: null });
      }
    }
  }
}
