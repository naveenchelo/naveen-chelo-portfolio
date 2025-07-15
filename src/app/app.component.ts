import { Component } from '@angular/core';
import { PortfolioSandbox } from './sandbox/portfolio.sandbox';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  isDarkMode = false;
  isMenuOpen = false;
  isScrolled = false;

  constructor(private portfolioSandbox: PortfolioSandbox) {}

  ngOnInit() {
    this.portfolioSandbox.loadPortfolioData();
    this.setupScrollListener();
    this.loadThemePreference();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  scrollToSection(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    this.isMenuOpen = false;
  }

  private setupScrollListener() {
    window.addEventListener('scroll', () => {
      this.isScrolled = window.scrollY > 50;
    });
  }

  private loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
  }
}
