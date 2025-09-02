import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BigimgPage } from './bigimg.page';

describe('BigimgPage', () => {
  let component: BigimgPage;
  let fixture: ComponentFixture<BigimgPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BigimgPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BigimgPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
