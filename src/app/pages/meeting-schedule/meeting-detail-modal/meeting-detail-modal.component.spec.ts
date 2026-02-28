import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeetingDetailModalComponent } from './meeting-detail-modal.component';

describe('MeetingDetailModalComponent', () => {
  let component: MeetingDetailModalComponent;
  let fixture: ComponentFixture<MeetingDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingDetailModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetingDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
