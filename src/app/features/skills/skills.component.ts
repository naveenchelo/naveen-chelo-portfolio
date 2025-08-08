import { Component, ElementRef, ViewChild } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { SkillsInterface } from '../../core/models/portfolio.interface';
import { PortfolioSandbox } from '../../sandbox/portfolio.sandbox';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

interface SkillWithLevel {
  name: string;
  level: number;
  category: string;
  years?: number;
  projects?: number;
}

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent {
  @ViewChild('radarChart', { static: false })
  radarChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('skillBarsContainer', { static: false }) skillBarsRef!: ElementRef;

  skills$: Observable<SkillsInterface | undefined>;
  private destroy$ = new Subject<void>();

  skillsWithLevels: SkillWithLevel[] = [];
  filteredSkills: SkillWithLevel[] = [];
  activeCategory = 'all';
  chartInstance: Chart | null = null;
  isAnimationComplete = false;

  private skillLevels: Record<
    string,
    { level: number; years?: number; projects?: number }
  > = {
    // Languages
    TypeScript: { level: 95, years: 3, projects: 6 },
    'JavaScript (ES6+)': { level: 90, years: 4, projects: 6 },
    HTML5: { level: 95, years: 4, projects: 6 },
    CSS3: { level: 90, years: 4, projects: 6 },
    Sass: { level: 85, years: 3, projects: 5 },

    // Frameworks
    'Angular (v17+)': { level: 95, years: 3, projects: 6 },
    NgRx: { level: 90, years: 2, projects: 3 },
    RxJS: { level: 88, years: 3, projects: 5 },
    'Angular Material': { level: 85, years: 3, projects: 5 },
    'Native Federation': { level: 80, years: 1, projects: 2 },

    // Tools
    Git: { level: 90, years: 4, projects: 6 },
    'VS Code': { level: 95, years: 4, projects: 6 },
    Figma: { level: 75, years: 2, projects: 4 },
    'REST API Integration': { level: 88, years: 3, projects: 6 },
    JIRA: { level: 85, years: 3, projects: 6 },
    'CI/CD Pipelines': { level: 75, years: 2, projects: 3 },

    // Concepts
    'Micro Front-end Architecture': { level: 85, years: 1, projects: 2 },
    'Module Federation': { level: 80, years: 1, projects: 2 },
    'Responsive Web Design (RWD)': { level: 90, years: 4, projects: 6 },
    'State Management': { level: 90, years: 3, projects: 3 },
    'Agile Methodologies': { level: 85, years: 3, projects: 6 },
    'UI/UX Principles': { level: 80, years: 3, projects: 5 },
    'Performance Optimization': { level: 85, years: 3, projects: 5 },

    // Default for skills not specified
    default: { level: 70, years: 1, projects: 3 },
  };

  constructor(private portfolioSandbox: PortfolioSandbox) {
    this.skills$ = this.portfolioSandbox.skills$;
  }

  ngOnInit() {
    this.loadSkillsWithLevels();
  }

  ngAfterViewInit() {
    // Delay to ensure DOM is ready
    setTimeout(() => {
      this.initializeRadarChart();
      this.animateSkillBars();
    }, 500);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }

  private loadSkillsWithLevels() {
    this.skills$.pipe(takeUntil(this.destroy$)).subscribe((skills) => {
      if (skills) {
        this.skillsWithLevels = this.processSkillsData(skills);
        this.filteredSkills = [...this.skillsWithLevels];

        // Re-initialize chart and animations when data changes
        setTimeout(() => {
          this.initializeRadarChart();
          this.animateSkillBars();
        }, 100);
      }
    });
  }

  private processSkillsData(skills: SkillsInterface): SkillWithLevel[] {
    const processedSkills: SkillWithLevel[] = [];

    Object.entries(skills).forEach(([category, skillList]) => {
      (skillList as string[]).forEach((skill: string) => {
        const skillData =
          this.skillLevels[skill] || this.skillLevels['default'];
        processedSkills.push({
          name: skill,
          level: skillData.level,
          category: category,
          years: skillData.years,
          projects: skillData.projects,
        });
      });
    });

    return processedSkills.sort((a, b) => b.level - a.level);
  }

  private initializeRadarChart() {
    if (!this.radarChartRef?.nativeElement) return;

    // Destroy existing chart
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }

    // Get top 8 skills for radar chart
    const topSkills = this.skillsWithLevels.slice(0, 8);
    if (topSkills.length === 0) return;

    const ctx = this.radarChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Chart configuration
    const config: ChartConfiguration<'radar'> = {
      type: 'radar',
      data: {
        labels: topSkills.map((skill) => skill.name),
        datasets: [
          {
            label: 'Skill Level',
            data: topSkills.map((skill) => skill.level),
            backgroundColor: 'rgba(102, 126, 234, 0.2)',
            borderColor: 'rgba(102, 126, 234, 0.8)',
            borderWidth: 2,
            pointBackgroundColor: '#667eea',
            pointBorderColor: '#667eea',
            pointRadius: 6,
            pointHoverRadius: 8,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#667eea',
            borderWidth: 1,
            callbacks: {
              label: (context) => {
                const skill = topSkills[context.dataIndex];
                return [
                  `Level: ${skill.level}%`,
                  `Experience: ${skill.years} year${
                    skill.years !== 1 ? 's' : ''
                  }`,
                  `Projects: ${skill.projects}`,
                ];
              },
            },
          },
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            min: 0,
            ticks: {
              stepSize: 20,
              color: 'rgba(102, 126, 234, 0.6)',
              font: {
                size: 10,
              },
              callback: function (value) {
                return value + '%';
              },
            },
            grid: {
              color: 'rgba(102, 126, 234, 0.2)',
              lineWidth: 1,
            },
            angleLines: {
              color: 'rgba(102, 126, 234, 0.3)',
              lineWidth: 1,
            },
            pointLabels: {
              color: '#333',
              font: {
                size: 11,
                weight: 500,
              },
              padding: 10,
            },
          },
        },
        animation: {
          duration: 1500,
          easing: 'easeInOutCubic',
        },
        interaction: {
          intersect: false,
          mode: 'point',
        },
      },
    };

    // Create the chart
    this.chartInstance = new Chart(ctx, config);
  }

  private animateSkillBars() {
    if (!this.skillBarsRef?.nativeElement) return;

    const skillBars =
      this.skillBarsRef.nativeElement.querySelectorAll('.skill-progress');

    skillBars.forEach((bar: Element, index: number) => {
      const progressBar = bar as HTMLElement;
      const targetWidth = progressBar.dataset['level'] + '%';

      // Reset animation
      progressBar.style.width = '0%';

      // Animate with delay
      setTimeout(() => {
        progressBar.style.width = targetWidth;
      }, index * 100);
    });

    this.isAnimationComplete = true;
  }

  filterSkills(category: string) {
    this.activeCategory = category;

    if (category === 'all') {
      this.filteredSkills = [...this.skillsWithLevels];
    } else {
      this.filteredSkills = this.skillsWithLevels.filter(
        (skill) => skill.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Re-animate skill bars
    setTimeout(() => this.animateSkillBars(), 100);
  }

  getSkillCategories(): string[] {
    const categories = [
      ...new Set(this.skillsWithLevels.map((skill) => skill.category)),
    ];
    return ['all', ...categories];
  }

  getSkillLevelText(level: number): string {
    if (level >= 90) return 'Expert';
    if (level >= 80) return 'Advanced';
    if (level >= 70) return 'Intermediate';
    if (level >= 60) return 'Familiar';
    return 'Beginner';
  }

  getSkillLevelColor(level: number): string {
    if (level >= 90) return '#4caf50';
    if (level >= 80) return '#2196f3';
    if (level >= 70) return '#ff9800';
    if (level >= 60) return '#9c27b0';
    return '#607d8b';
  }

  getCategoryIcon(category: string): string {
    const iconMap: Record<string, string> = {
      languages: 'fas fa-code',
      frameworks: 'fas fa-layer-group',
      tools: 'fas fa-tools',
      concepts: 'fas fa-lightbulb',
      default: 'fas fa-star',
    };

    return iconMap[category.toLowerCase()] || iconMap['default'];
  }

  getSkillsCountByCategory(category: string): number {
    return this.skillsWithLevels.filter(
      (skill) => skill.category.toLowerCase() === category.toLowerCase()
    ).length;
  }

  getTopSkillsForCategory(
    category: string,
    count: number = 3
  ): SkillWithLevel[] {
    return this.skillsWithLevels
      .filter(
        (skill) => skill.category.toLowerCase() === category.toLowerCase()
      )
      .sort((a, b) => b.level - a.level)
      .slice(0, count);
  }

  learningMilestones = [
    {
      year: '2024',
      title: 'Micro Frontend & Performance',
      description:
        'Leading micro frontend architecture implementation for NEST UK pension platform, focusing on performance optimization and scalable solutions.',
      skills: [
        'Native Federation',
        'Module Federation',
        'Performance Optimization',
        'Angular 17',
      ],
    },
    {
      year: '2023',
      title: 'Advanced Angular & State Management',
      description:
        'Deep dive into NgRx state management, RxJS patterns, and complex component architecture for enterprise applications.',
      skills: [
        'NgRx',
        'RxJS',
        'State Management',
        'Component Architecture',
        'Angular Material',
      ],
    },
    {
      year: '2022',
      title: 'Professional Angular Development',
      description:
        'Started at TCS, working on CVS Pharmacy customer portal and healthcare applications with Angular and TypeScript.',
      skills: [
        'Angular',
        'TypeScript',
        'REST APIs',
        'Healthcare APIs',
        'Agile Methodologies',
      ],
    },
    {
      year: '2021',
      title: 'Frontend Development Foundation',
      description:
        'Built strong foundation in modern web development, preparing for professional Angular development career.',
      skills: [
        'JavaScript',
        'HTML5',
        'CSS3',
        'Git',
        'VS Code',
        'Responsive Design',
      ],
    },
  ];
}
