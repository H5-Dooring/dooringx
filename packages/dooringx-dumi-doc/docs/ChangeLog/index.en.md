---
title: Change log
toc: menu
nav:
  title: Change log
  order: 6
---
## 1.0.0
New document and createcomponent function
## 0.15.3
Modify the checkbox and select the algorithm
## 0.15.2
Fixed inconsistency in editing preview of elements in the line.
Add line height font size configuration item.
## 0.15.1
Useregistfunc is added to register functions.
Update some documents.
## 0.15.0
Discard the storechanger and iframe containers.
Add function configuration to properly uninstall.
Modify logic such as pop-up window to save preview correctly.
## 0.14.1
Add data source left panel settings.
## 0.14.0
Fixed the problem that the left and right configurations could not get config.
## 0.13.3
Fixed Title Failure and added right panel configuration
## 0.13.2
Fixed the problem that custom animation might fail.
## 0.13.1
Fixed the editing problem of custom animation reloading canvas.
## 0.13.0
Add custom animation, you can customize the animation freely.
## 0.12.4
Add lifecycle.
Modify the color and style of timeline and optimize the selected state.
## 0.12.3
Fix double click positioning problem
## 0.12.2
Add double click positioning frame.
Fixed the behavior of dragging frame to reset pointer after pause.
## 0.12.0
The operation of adding new frames in animation can accurately view the animation status every 0.1 seconds!
Timeline adds some class names for easy style modification.
## 0.11.11
Fixed animation causing rotation preview not to take effect.
Add container overflow configuration.
The style of timeline is adjusted.
Example section style adjustment.
## 0.11.10
Add color style settings for markline
## 0.11.9
Add setting panel control to control adsorption, scaling and other behaviors.
Fixed pop-up button style problem.
Fixed the problem that some prompts were not displayed.
## 0.11.8
Timeline adds auto focus function.
## 0.11.7
Cancel the multi selection adsorption function.
## 0.11.6
Cancel the adsorption of the first mouse click.
Modify the selected color of timeline.
## 0.11.5
Fix the bug of reference line adsorption and wrong displacement
Change the position of rotation back to normal
## 0.11.4
Fix reference line bug
Optimize drag and drop algorithm
## 0.11.3
Add the function of rotation return.
Optimize the mouse style.
## 0.11.2
Optimize drag speed
## 0.11.1
Compatible with old properties
## 0.11.0
Modify the timeline style and add the cansee attribute to make it easy to hide when editing.
## 0.10.4
Config adds a custommap transfer to store temporary data that is not brought into JSON.
The configuration of remote components is changed from URL to object to store more configurations.
## 0.10.3
Fixed the color difference of the left tab.
## 0.10.2
Modify the background color of timeline, and add the item class name to facilitate modification.
## 0.10.1
Modify the timeline class name to facilitate style modification.
## 0.10.0
The function name proposes that name is passed as a separate configuration item, the first parameter is ID, and the last parameter is function name. In this way, the display name of the function can support conversion.
If the pop-up event does not pass the pop-up name, no pop-up window will appear.
## 0.9.5
The scripts loading of the preview component changes from concurrent to linear.
Using remote components in edit mode will save the current canvas state.
## 0.9.4
Fix the bug that the preview component cannot release loading
## 0.9.3
Add double click to place the canvas.
Change the initial focus state of the element.
If the width and height of an element exist, it is positioned at the center of the element during placement.
## 0.9.2
Add the whole process of remote component calling, and Add URL attribute in component to facilitate script loading.
## 0.9.1
Add config.i18n configuration. If internationalization is not used, there is no need to import Intl context.
The first button of the control component is changed to drag and drop, and the functions are merged into the timeline
## 0.9.0
Add react Intl and modify some styles.
## 0.8.4
Add the content of preview to control loading from outside.
## 0.8.3
Add timeline drag bar and select.
Fixed an error in the antd menu attribute.
## 0.8.2
Add left panel configuration.
Fixed the problem of timeline flicker.
## 0.8.1
New animation component timeline. All animations can be previewed better.
## 0.8.0
Partial reconstruction of animation can support simultaneous configuration of multiple animations.
The minimum value of canvas drag is changed to 0.
## 0.7.7
Optimize the drag logic of the canvas to move more smoothly.
## 0.7.6
The user-defined rightglobalcustom type on the right side is changed to function, and config is passed in
## 0.7.5
Change the roller direction.
## 0.7.4
Fixed the box move bug.
## 0.7.3
Fixed pop-up location and selection issues.
## 0.7.2
Fixed the effect of locking components. Dragging, zooming and rotating cannot be performed during locking.
## 0.7.1
Fix that the lock component cannot be unlocked.
## 0.7.0
Component rotation is supported!
Fixed optimization logic such as dragging reference lines.
## 0.6.0
Iframe is supported in editing mode!
Repair the selected condition.
## 0.5.1
Fixed the problem that the right selection cannot be unchecked.
## 0.5.0
Fixed the problem that the width of the control component was not enough.
Remove the antd custom icon, and the icon at the bottom of the container can be configured.
## 0.4.2
Fix incorrect initial value of animate.
Modify the markline style.
The global setting increases the height of the container.
## 0.4.1
Remove the Lib auto import style.
## 0.4.0
Remove the runtime export and get all properties from config.
## 0.3.1
1. Replace UUID with nanoid.
2. The control component adds ruler control.
## 0.3.0 
1. Add ruler. Containerwrapper needs to pass config before it can be used.
2. Modify the minimum drag of the container 667. Fixed the inconsistency between the distance between the canvas and the mouse when zooming down and dragging.
3. Innercontainerdragup needs to pass config.
## 0.2.0 
Modify the transfer of the commander to obtain the config. The commander is no longer exported from the index, but needs to be obtained from the config. Add the class name on the left to facilitate customization.
## 0.1.10 
Modify eslint dependency (recommended)
## 0.1.9 
Add global body settings
## 0.1.8 
Add pop-up settings and remove modalcontainer
## 0.1.7 
Modify the preview special condition display and delete the console
## 0.1.6 
Adjust the initial scale, the initial scale of the canvas, and add the function of aligning the canvas.
## 0.1.5 
Delete the button not made and add the fixed configuration
## 0.1.4 
Basic functions