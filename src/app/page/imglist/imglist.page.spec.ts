import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular';

import { ImglistPage } from './imglist.page';

describe('ImglistPage', () => {
  let component: ImglistPage;
  let fixture: ComponentFixture<ImglistPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImglistPage],
      providers: [provideRouter([]), provideIonicAngular()],
    }).compileComponents();

    fixture = TestBed.createComponent(ImglistPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
