import { ChangeDetectionStrategy, Component, ElementRef, Renderer2, ViewChild, inject } from '@angular/core';

@Component({
  selector: 'dcp-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionComponent {
  @ViewChild('selection') private readonly selectionRef!: ElementRef<HTMLDivElement>;

  @ViewChild('left_half') private readonly leftHalfRef!: ElementRef<HTMLDivElement>;
  @ViewChild('right_half') private readonly rightHalfRef!: ElementRef<HTMLDivElement>;
  @ViewChild('right_half_wrapper') private readonly rightHalfWrapperRef!: ElementRef<HTMLDivElement>;

  private readonly renderer: Renderer2 = inject(Renderer2);

  /** Setting the width of a selection component */
  private setSelectionWidth(value: number): void {
    this.renderer.setStyle(this.selectionRef.nativeElement, 'width', `${value}px`);
    this.renderer.setStyle(this.selectionRef.nativeElement, 'max-width', `${value}px`);
  }

  /** Setting the left offset of a selection component */
  public setSelectionLeft(value: number): void {
    this.renderer.setStyle(this.selectionRef.nativeElement, 'left', `${value}px`);
  }

  public select(width: number): void {
    this.renderer.setStyle(this.leftHalfRef.nativeElement, 'left', `${width / 2}px`);
    this.renderer.setStyle(this.leftHalfRef.nativeElement, 'max-width', `${width / 2}px`);
    this.renderer.setStyle(this.leftHalfRef.nativeElement, 'opacity', 1);

    this.renderer.setStyle(this.rightHalfRef.nativeElement, 'max-width', `${width / 2}px`);
    this.renderer.setStyle(this.rightHalfRef.nativeElement, 'opacity', 1);
    this.renderer.setStyle(this.rightHalfWrapperRef.nativeElement, 'max-width', `${width / 2}px`);

    this.setSelectionWidth(width);
  }

  public unselect(): void {
    this.renderer.setStyle(this.leftHalfRef.nativeElement, 'left', '0px');
    this.renderer.setStyle(this.leftHalfRef.nativeElement, 'max-width', '0px');
    this.renderer.setStyle(this.leftHalfRef.nativeElement, 'opacity', 0);

    this.renderer.setStyle(this.rightHalfRef.nativeElement, 'max-width', '0px');
    this.renderer.setStyle(this.rightHalfRef.nativeElement, 'opacity', 0);
    this.renderer.setStyle(this.rightHalfWrapperRef.nativeElement, 'max-width', '0px');

    this.setSelectionWidth(0);
  }
}
