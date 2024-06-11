import { Component, computed } from '@angular/core';
import { StorageService } from '../../core/storage/storage.service';

export interface Slide {
  headline?: string;
  src: string;
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  template: `<div class="carousel-container">
    <div
      class="carousel"
      [style.transform]="'translateX(-' + currentSlide * 100 + '%)'"
    >
      @for (slide of slides(); track $index) {
        <div class="carousel-item">
          <img [src]="slide.src" alt="Carousel Image" />
        </div>
      }
    </div>
    <button class="nav prev" (click)="prevSlide()">&#10094;</button>
    <button class="nav next" (click)="nextSlide()">&#10095;</button>
  </div> `,
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent {
  slides = computed(() => {
    return this.storage
      .currentProduct()
      .masterVariant.images.map((image: { url: string }) => ({
        src: image.url,
      }));
  });

  currentSlide = 0;

  constructor(private storage: StorageService) {}

  prevSlide(): void {
    this.currentSlide =
      this.currentSlide > 0 ? this.currentSlide - 1 : this.slides().length - 1;
  }

  nextSlide(): void {
    this.currentSlide =
      this.currentSlide < this.slides().length - 1 ? this.currentSlide + 1 : 0;
  }
}
