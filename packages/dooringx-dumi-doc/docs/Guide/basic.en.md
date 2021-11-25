---
  title: dooringx lib Foundation
  toc: menu
  order: 2
---
###  store
Store is similar to the concept of redux. It internally implements the functions of redo, undo, publish and subscribe, replace data, forced refresh and so on.
Store can be obtained in config.
At the beginning, usestorestate and react need to be combined. At this time, store.forceupdate can be used at any position, or state can be used to obtain the data in the store.
The most important function of the store is to save the JSON queue for each modification.
If you need to update the data, use the SetData method to update after the deep copy.
If you don't leave a record on redo or undo when you need to update, please operate the queue to delete the saved content.
If you want to see the view update after changing the data, you can use forceupdate.
### Events
The events of dooringx lib are on the eventcenter, which integrates the function center and an event chain.
You can get the time of component registration in the event center. Timing is similar to the component life cycle. It can be called at the corresponding timing after registration.
The functions in the function center will be combined with the timing, and then the event chain will uniformly process the queue set by the user.
Each event chain will have a context object during execution, which will run through the event chain.
### Command
The commands of dooringx lib are managed by the commander.
Redo and undo commands are provided internally by default. You can add a commander through a plug-in.
The commander integrates shortcut key configuration internally, and uses the keys of keyboard events for registration. If Ctrl, ALT and meta keys are used, the corresponding plus sign can be added for key combination registration, and the case is ignored internally (note! The case of the registered key name is not ignored, but the keys of a and a are equivalent in processing).
### Pop up window
Dooringx lib has a built-in pop-up system, which is converted through storechanger.
Therefore, when making some scenes, you may need to consider whether to edit them in pop-up window.
Each pop-up window only saves the data in the block, while data such as events will only exist in the master data.
After the pop-up window is saved, the pop-up window data will be replaced in the main data memory and replaced again when editing.
You can use the methods on storechanger to judge, or directly obtain the data source data. See API for details.
### Data source
The data source of dooringx lib is not the same thing as the store mentioned above.
It is located in the datacenter. The original intention of designing data source is to make people who do not understand the code better understand.
The operation of events can be completely separated from the data source, as long as the user knows how to fill in parameters.
Therefore, during event configuration, multiple options can be used to obtain data from the data source and convert it into parameters.