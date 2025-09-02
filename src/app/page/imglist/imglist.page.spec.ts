import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ImglistPage } from './imglist.page';

describe('ImglistPage', () => {
  let component: ImglistPage;
  let fixture: ComponentFixture<ImglistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImglistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ImglistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
