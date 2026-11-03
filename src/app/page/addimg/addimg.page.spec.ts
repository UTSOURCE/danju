import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AddimgPage } from './addimg.page';

describe('AddimgPage', () => {
  let component: AddimgPage;
  let fixture: ComponentFixture<AddimgPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddimgPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AddimgPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
