import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsynchronousComponent } from './asynchronous.component';

describe('AsynchronousComponent', () => {
  let component: AsynchronousComponent;
  let fixture: ComponentFixture<AsynchronousComponent>;

  beforeEach(async () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');

    await TestBed.configureTestingModule({
      declarations: [ AsynchronousComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsynchronousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set timeoutResp check', () => {
    component.checkSetTimeout();
    expect(component.timeoutResp).not.toBe('setTimeoutCheck');
    //jest.advanceTimersByTime(1000);
    jest.runAllTimers();
    expect(component.timeoutResp).toBe('setTimeoutCheck');
    expect(setTimeout).toHaveBeenCalledTimes(1);
  });
});
