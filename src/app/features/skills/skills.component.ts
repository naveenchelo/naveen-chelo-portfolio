import { Component, ElementRef, ViewChild } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { SkillsInterface } from '../../core/models/portfolio.interface';
import { PortfolioSandbox } from '../../sandbox/portfolio.sandbox';

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
  chartInstance: any;
  isAnimationComplete = false;

  // Predefined skill levels (you can move this to your JSON data later)
  private skillLevels: Record<
    string,
    { level: number; years?: number; projects?: number }
  > = {
    // Frontend Technologies
    Angular: { level: 95, years: 4, projects: 15 },
    TypeScript: { level: 90, years: 4, projects: 20 },
    JavaScript: { level: 88, years: 5, projects: 25 },
    HTML5: { level: 95, years: 6, projects: 30 },
    CSS3: { level: 90, years: 6, projects: 30 },
    SCSS: { level: 85, years: 3, projects: 20 },
    React: { level: 75, years: 2, projects: 8 },
    'Vue.js': { level: 60, years: 1, projects: 3 },

    // Backend Technologies
    'Node.js': { level: 80, years: 3, projects: 12 },
    'Express.js': { level: 75, years: 2, projects: 8 },
    NestJS: { level: 70, years: 1, projects: 5 },
    Python: { level: 65, years: 2, projects: 6 },
    Java: { level: 70, years: 2, projects: 7 },

    // Databases
    MongoDB: { level: 75, years: 2, projects: 10 },
    PostgreSQL: { level: 70, years: 2, projects: 8 },
    MySQL: { level: 72, years: 3, projects: 12 },
    Firebase: { level: 80, years: 2, projects: 10 },

    // DevOps & Tools
    Git: { level: 90, years: 5, projects: 30 },
    Docker: { level: 70, years: 2, projects: 8 },
    AWS: { level: 65, years: 1, projects: 5 },
    Jenkins: { level: 60, years: 1, projects: 4 },

    // State Management & Libraries
    NgRx: { level: 85, years: 3, projects: 10 },
    RxJS: { level: 88, years: 4, projects: 15 },
    Redux: { level: 75, years: 2, projects: 8 },

    // Testing
    Jest: { level: 80, years: 3, projects: 15 },
    Cypress: { level: 75, years: 2, projects: 8 },
    Jasmine: { level: 85, years: 4, projects: 12 },
    Karma: { level: 80, years: 4, projects: 12 },

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

    // Get top 8 skills for radar chart
    const topSkills = this.skillsWithLevels.slice(0, 8);

    const ctx = this.radarChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    // Create radar chart using Chart.js (you'll need to install: npm install chart.js)
    // For now, we'll create a custom SVG radar chart
    this.createCustomRadarChart(topSkills);
  }

  private createCustomRadarChart(skills: SkillWithLevel[]) {
    const canvas = this.radarChartRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 40;
    const angleStep = (2 * Math.PI) / skills.length;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid circles
    ctx.strokeStyle = 'rgba(102, 126, 234, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, (radius * i) / 5, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Draw axis lines and labels
    skills.forEach((skill, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const endX = centerX + Math.cos(angle) * radius;
      const endY = centerY + Math.sin(angle) * radius;

      // Draw axis line
      ctx.strokeStyle = 'rgba(102, 126, 234, 0.3)';
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Draw skill label
      ctx.fillStyle = '#333';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      const labelX = centerX + Math.cos(angle) * (radius + 20);
      const labelY = centerY + Math.sin(angle) * (radius + 20);
      ctx.fillText(skill.name, labelX, labelY);
    });

    // Draw data polygon
    ctx.strokeStyle = 'rgba(102, 126, 234, 0.8)';
    ctx.fillStyle = 'rgba(102, 126, 234, 0.2)';
    ctx.lineWidth = 2;

    ctx.beginPath();
    skills.forEach((skill, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const distance = (skill.level / 100) * radius;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw data points
    skills.forEach((skill, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const distance = (skill.level / 100) * radius;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;

      ctx.fillStyle = '#667eea';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
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
      databases: 'fas fa-database',
      testing: 'fas fa-bug',
      devops: 'fas fa-cloud',
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

  // Learning timeline data - you can move this to your JSON data later
  learningMilestones = [
    {
      year: '2024',
      title: 'Advanced State Management',
      description:
        'Mastered NgRx, learned advanced RxJS patterns, and implemented complex state architectures.',
      skills: ['NgRx', 'RxJS', 'State Patterns', 'Angular Signals'],
    },
    {
      year: '2023',
      title: 'Full-Stack Development',
      description:
        'Expanded to backend development with Node.js and cloud technologies.',
      skills: ['Node.js', 'Express.js', 'MongoDB', 'AWS', 'Docker'],
    },
    {
      year: '2022',
      title: 'Angular Expertise',
      description:
        'Became proficient in Angular framework and modern frontend development practices.',
      skills: ['Angular', 'TypeScript', 'SCSS', 'Jest', 'Cypress'],
    },
    {
      year: '2021',
      title: 'Frontend Foundation',
      description:
        'Started journey in web development with core technologies and JavaScript frameworks.',
      skills: ['JavaScript', 'HTML5', 'CSS3', 'React', 'Git'],
    },
  ];
}
