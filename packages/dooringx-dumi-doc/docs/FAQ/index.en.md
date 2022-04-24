---
title: FAQ
toc: menu
nav:
  title: FAQ
  order: 4
---
## The chart is constantly refreshed as it moves
Please use fast deep equal to compare the required data. If they are the same, ignore the update.
## Unable to select components or preview adaptation issues
The absolute positioning component must have the initial width and height. Although the width and height will be added to the component during dragging, if the user does not drag at the beginning, the component has no width and height, which will not only affect the selection judgment, but also affect the calculation of the final preview.
## The functions dynamically registered by components will always be retained
The component function needs to call the unloading method when the component is unloaded, otherwise it will always exist.
## Form verification submission ideas
There are many ways to verify and submit forms, because all the data is connected, or you can write a form component directly.
When the form component is not used, the simple way is to make a verification function and submission function for each input component.
In this way, whether to verify depends on the user's selection, and the thrown input allows the user to choose where to put it, and the user names the variable.
When clicking the submit button, call the verification function and submission function of all components to throw them to the context, then aggregate them into objects through the context aggregation function, and finally send them to the corresponding back end through the sending function, so as to complete the whole process. You can try this demo in example.
If the operator can understand the interface documents provided by the back-end, he can spell out the desired fields of the back-end through naming.
If you don't need documentation, some values can also be written dead at development time.
Another way is to write a submit button specifically, fix the parameters and some rules, such as stipulating that all forms in the page will be collected and submitted.
Then we can use the data source to automatically submit all the form output content to the data source. The last submit button extracts the key in the format specified by the data source and sends it to the back end.
## Top to bottom problem
A small partner responded that the operation of placing the top and bottom is a little unreasonable. In fact, zindex should not be used to make the top and bottom, which is inconsistent with the order of layers, and there will be problems when using zindex to set the bottom, because the element zindex cannot be lower than the canvas, so it is common sense to raise the order.
## Multilingual removal
If I18N in config is set to false, intlprovider does not need to be applied in the outer layer.
```js
config.i18n = false;
```