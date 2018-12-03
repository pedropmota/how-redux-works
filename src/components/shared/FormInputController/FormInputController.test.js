import React from "react"
import debounce from "debounce-promise";
import { shallow, mount } from "enzyme"
import FormInputController from "./FormInputController"

jest.mock('debounce-promise');


describe("FormInputController", () => {

  const defaultProps = {
    formValues: ['1', '2', '3'],
    itemKeyBeingEdited: '2'
  }

  function newFormController (customProps) {
    const props = {
      onEdit: jest.fn(), //Mocks onEdit prop by default
      ...defaultProps,
      ...customProps
    }
    return shallow(<FormInputController { ...props } />)
  }

  /* Mocks debounce so it simply returns the function syncronously, without debouncing it: */
  function mockDebounce() {
    debounce.mockImplementation((fn) => fn)
  }

  /* Mocks debounce so it only returns the time value it'd use to debounce: */
  function mockDebounceTime() {
    debounce.mockImplementation((fn, time) => time)
  }
  
  

  it("calls onEdit when form values change", () => {
    mockDebounce()    

    const component = newFormController();
    
    const getCallsCount = () =>
      component.instance().props.onEdit.mock.calls.length;

    //Same values:
    component.setProps({ ...defaultProps, formValues: defaultProps.formValues })
    expect(getCallsCount()).toBe(0)

    //New values:
    component.setProps({ ...defaultProps, formValues: ['4', '5', '6'] })
    expect(getCallsCount()).toBe(1)
  })


  it("Does not call onEdit if item being edited also changes", () => {
    mockDebounce()

    const component = newFormController();
    
    const getCallsCount = () =>
      component.instance().props.onEdit.mock.calls.length;

    //Same form values:
    component.setProps({ ...defaultProps, formValues: defaultProps.formValues })
    expect(getCallsCount()).toBe(0)

    //New values, but also new key:
    component.setProps({ ...defaultProps, formValues: ['4', '5', '6'], itemKeyBeingEdited: '3' })
    expect(getCallsCount()).toBe(0)
  })


  it("Uses 'debounceTime' prop on debounced 'handleEdit' method", () => {
    mockDebounceTime()
    
    const debounceTime = Math.random()
    
    const props = {
      ...defaultProps,
      debounceTime: debounceTime
    }
    const component = newFormController(props);
    expect(component.instance().handleEdit).toBe(debounceTime)
  })

  it("Uses 'defaultDebounceTime' if no debounceTime prop is set", () => {
    mockDebounceTime()

    const component = newFormController();
    expect(component.instance().handleEdit).toBe(800)
  })

})