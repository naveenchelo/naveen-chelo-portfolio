import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-typing-animation',
  templateUrl: './typing-animation.component.html',
  styleUrl: './typing-animation.component.scss',
})
export class TypingAnimationComponent implements OnInit, OnDestroy {
  @Input() texts: string[] = [];
  @Input() typeSpeed: number = 100;
  @Input() deleteSpeed: number = 50;
  @Input() pauseDuration: number = 2000;
  @Input() loop: boolean = true;
  @Input() startDelay: number = 500;

  displayText: string = '';
  showCursor: boolean = true;
  private currentTextIndex: number = 0;
  private currentCharIndex: number = 0;
  private isDeleting: boolean = false;
  private timeoutId: any;

  ngOnInit() {
    if (this.texts.length > 0) {
      setTimeout(() => {
        this.startTyping();
      }, this.startDelay);
    }
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  private startTyping() {
    const currentText = this.texts[this.currentTextIndex];

    if (this.isDeleting) {
      // Deleting characters
      this.displayText = currentText.substring(0, this.currentCharIndex - 1);
      this.currentCharIndex--;

      if (this.currentCharIndex === 0) {
        this.isDeleting = false;
        this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
      }

      this.timeoutId = setTimeout(() => this.startTyping(), this.deleteSpeed);
    } else {
      // Typing characters
      this.displayText = currentText.substring(0, this.currentCharIndex + 1);
      this.currentCharIndex++;

      if (this.currentCharIndex === currentText.length) {
        // Finished typing current text
        if (this.loop || this.currentTextIndex < this.texts.length - 1) {
          this.isDeleting = true;
          this.timeoutId = setTimeout(
            () => this.startTyping(),
            this.pauseDuration
          );
        } else {
          // Stop animation if not looping and last text
          this.showCursor = false;
          return;
        }
      } else {
        this.timeoutId = setTimeout(() => this.startTyping(), this.typeSpeed);
      }
    }
  }
}
