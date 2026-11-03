import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavParams, provideIonicAngular } from '@ionic/angular';

import { BigimgPage } from './bigimg.page';

describe('BigimgPage', () => {
  let component: BigimgPage;
  let fixture: ComponentFixture<BigimgPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BigimgPage],
      providers: [provideRouter([]), provideIonicAngular(), { provide: NavParams, useValue: new NavParams({ url: 'test.png' }) }],
    }).compileComponents();

    fixture = TestBed.createComponent(BigimgPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
