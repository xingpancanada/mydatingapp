import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchesComponent } from './matches.component';

describe('MatchesComponent', () => {
  let component: MatchesComponent;
  let fixture: ComponentFixture<MatchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //exact equlity --> toBe()
  it('two plus two is four', ()=>{
    expect(2+2).toBe(4);
  });

  //object testing --> toEqual()
  it('Object values', ()=>{
    const data = {name: "XING"};
    expect(data).toEqual({name: "XING"});
  });

  //Truthiness
  it('null', ()=>{
    const n = null;
    expect(n).toBeNull();
    expect(n).toBeDefined();
    expect(n).not.toBeUndefined();
    expect(n).not.toBeTruthy();
    expect(n).toBeFalsy();
  });
  it('zero', ()=>{
    const n = 0;
    expect(n).not.toBeNull();
    expect(n).toBeDefined();
    expect(n).not.toBeUndefined();
    expect(n).not.toBeTruthy();
    expect(n).toBeFalsy();
  });

  //numbers
  it('two plus two', ()=>{
    const value = 2 + 2;
    expect(value).toBeGreaterThan(3);
    expect(value).toBeGreaterThanOrEqual(3.5);
    expect(value).toBeLessThan(5);
    expect(value).toBeLessThanOrEqual(4.5);

    expect(value).toBe(4);
    expect(value).toEqual(4);
  });

  it('adding floating point numbers', ()=>{
    const value = 0.1 + 0.2;
    //expect(value).toBe(0.3)  //not work because of rounding error
    expect(value).toBeCloseTo(0.3); // this works
  });

  //strings
  it('this is no X in xing', ()=>{
    expect('xing').not.toMatch(/X/);  //sensitive for upper or lower cap
  });
  it('this is xin in xing', ()=>{
    expect('xing').toMatch(/xin/);  //sensitive for upper or lower cap
  });

  //Arrays
  it('the shopping list has milk on it', ()=>{
    const shoppingList = [
      'diapers',
      'kleenex',
      'trash bags',
      'paper towels',
      'milk'
    ];
    expect(shoppingList).toContain('milk');
    expect(new Set(shoppingList)).toContain('milk');
  });

  //exception
  it('compiling android goes as expected', ()=>{
    expect(()=> component.compileAndroidCode()).toThrow();
    expect(()=> component.compileAndroidCode()).toThrow(Error);

    //You can also use the exact error message or a regexp
    expect(()=> component.compileAndroidCode()).toThrow('you are using Old Angular');
    expect(()=> component.compileAndroidCode()).toThrow(/Angular/);
  });



});
