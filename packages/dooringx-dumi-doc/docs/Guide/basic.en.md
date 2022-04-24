---
  title: dooringx lib Foundation
  toc: menu
  order: 2
---
###  store
Store is similar to the concept of redux. It internally implements the functions of redo, undo, publish and subscribe, replace data, forced refresh and so on.
Store can be obtained in config.
At the beginning, it is necessary to combine usestorestate with react. At this time, store can be used anywhere Forceupdate can also use state to obtain the data in the store.
The most important function of JSON is to save the queue every time.
If you need to update the data, use the SetData method to update after the deep copy.
If you don't leave records on redo or undo when you need to update, please operate the queue to delete the saved contents.
If you want to see the view update after changing the data, you can use forceupdate.
### Events
The event of dooringx lib is on the eventcenter, which integrates the function center and an event chain.
You can get the time of component registration in the event center. Timing is similar to the component life cycle. It can be called at the corresponding timing after registration.
The functions in the function center will be combined with the timing, and then the event chain will uniformly process the queue set by the user.
Each event chain will have a context object during execution, which will run through the event chain.
### Command
The commands of dooringx lib are managed by the commander.
Redo and undo commands are provided internally by default. You can add a commander through a plug-in.
The commander integrates shortcut key configuration internally, and uses the keys of keyboard events for registration. If Ctrl, ALT and meta keys are used, the corresponding plus sign can be added for key combination registration, and the case is ignored internally (note! The case of the registered key name is not ignored, but the key processing of a and a is equivalent).
### Pop up window
Dooringx lib has a built-in pop-up system, which is converted through store.
Therefore, when making some scenes, you may need to consider whether to edit them in pop-up window.
Each pop-up window only saves the data in the block, while data such as events will only exist in the master data.
After the pop-up window is saved, the pop-up window data will be replaced in the main data memory and replaced again when editing.
You can use the method on the store to judge, or directly obtain the data source data. See API for details.
### Data source
The data source of dooringx lib is not the same thing as the store mentioned above.
It is located in the datacenter. The original intention of designing data source is to make people who don't understand the code better understand.
The operation of events can be completely separated from the data source, as long as the user knows how to fill in parameters.
Therefore, during event configuration, multiple options can be used to obtain data from the data source and convert it into parameters.