import React from "react";

export default [
  <>
    <h3>What is an Action?</h3>
    <p>As one of the main concepts of Redux, an Action is an object used by your app to communicate with the Store.
       It requires at least a "type" property, and can contain as many other properties as needed by that action type.
    </p>
    <p>
      As an example, consider the following action:
    </p>
    <p>
      {`{ type: "ADD_CONTACT", name: "Joe", phoneNumber: "(000)000-0000" }`}
    </p>
    <p>
      The properties "name" and "phoneNumber" are the pieces of information needed for our "ADD_CONTANT" action type.
      And that's it! No logic or implementation has been done there (and that's how the "Reducers" will get in the picture). 
    </p>
    <p>
      Also, note the "CAMEL_CASE" of the action type. That's because "type" is usually a constant, and CAMEL_CASE is used by convention. 
    </p>
    <p>
      On the next page we'll talk about "action creators".
    </p>
  </>,

  <>
    <h3>What is an Action Creator (and why would I need one)?</h3>
    <p>
      Action creators are basically functions that return an action. 
      Again, no actual logic is implemented in them. Below is an action creator for the action saw in the previous step:
    </p>
    <p>
      {`function addContact(name, phoneNumber) {`}<br />
      {`  return { type: "ADD_CONTACT", name, phoneNumber }`} <br />
      {`}`}
    </p>
    <p>
      In fact, action creators are not even necessary for your Redux code to work. But it brings a huge benefit: 
      it encapsulates the action for us, describing the information expected by the "action type".
    </p>
    <p>
      That way, we simply call the action creator and send the expected parameters. 
      The result of the function is what gets dispatched to Redux's store.
    </p>
  </>,

  <>
    <h3>How do I use this app?</h3>
    <p>
      You can create your action creators using the form below. Make sure to check the "examples" list and add/edit a few actions.
    </p>
    <p>
      In this app, the action types and action creators will be automatically visible by the Reducers and Store sections,
      which makes it very easy to see Redux's flow by just following the examples and editing the code!
    </p>
  </>,

  <>
    <h3>Organizing my app's actions</h3>
    <p>
      In the previous steps we talked about "action types" and "action creators". Both pieces are defined once, 
      and used throughout our app. There are no restriction as to how to organize them in our code-base, but it's
      common to add all of them in a single "actions.js" file or an "actions" folder. 
    </p>
    <p>
      And although neither of those steps are mandatory, it's highly benefitial to create the "constant variables" for
      each action type and the "action creator functions".
    </p>
    <p></p>
    <p>
      And that's all for the Action Creator Tutorial! Feel free to check the Tutorials for "Reducers" and "Store"
      in this app, or read Redux's docs for more detailed info.
    </p>
  </>
]