import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddimgPage } from './addimg.page';

describe('AddimgPage', () => {
  let component: AddimgPage;
  let fixture: ComponentFixture<AddimgPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddimgPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddimgPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
