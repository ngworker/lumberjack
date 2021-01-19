import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { NoopConsoleModule } from '@internal/console-driver/test-util';
import { LumberjackLevel, LumberjackModule } from '@ngworker/lumberjack';
import { LumberjackConsoleDriverModule } from '@ngworker/lumberjack/console-driver';
import { LumberjackHttpDriverModule } from '@ngworker/lumberjack/http-driver';

import { AppComponent } from './app.component';

describe(AppComponent.name, () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        HttpClientTestingModule,
        LumberjackModule.forRoot(),
        LumberjackConsoleDriverModule.forRoot(),
        NoopConsoleModule,
        LumberjackHttpDriverModule.forRoot({
          levels: [LumberjackLevel.Error],
          origin: 'ForestAPP',
          storeUrl: '/api/logs',
          retryOptions: { maxRetries: 5, delayMs: 250 },
        }),
      ],
    });
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'lumberjack'`, () => {
    expect(component.title).toEqual('lumberjack');
  });

  it('should render title', () => {
    const query: HTMLElement = fixture.debugElement.query(By.css('.content span')).nativeElement;
    expect(query && query.textContent).toContain('lumberjack app is running!');
  });
});
