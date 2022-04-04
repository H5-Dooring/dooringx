---
title: Change log
toc: menu
nav:
  title: Change log
  order: 6
---
## 0.13.2
Fixed possible invalidation of custom animation.
## 0.13.1
Fixed editing problem of custom animation overloaded canvas.
## 0.13.0
Add custom animation, you can customize the animation freely.
## 0.12.4
Add a lifecycle.
Modify the timeline color and style to optimize the selected state.
## 0.12.3
Fix double click positioning problem
## 0.12.2
Add double click positioning frame.
Fixed drag frame reset pointer behavior after pause.
## 0.12.0
The operation of adding frames to the animation can accurately view the animation status every 0.1 seconds!
Timeline adds some class names to facilitate style modification.
## 0.11.11
Fixed animation causing rotation preview not to take effect.
Add container overflow configuration.
Adjust the style of the timeline section.
Example part style adjustment.
## 0.11.10
Add color and style settings for markline
## 0.11.9
A new setting panel is added to control adsorption scaling and other behaviors.
Fixed pop-up button style issues.
Fix the problem that some prompts do not display.
## 0.11.8
Timeline adds auto focus function.
## 0.11.7
Cancel the multi selection adsorption function.
## 0.11.6
Cancel the first mouse click.
Modify the selected color of timeline.
## 0.11.5
Fix reference line adsorption and wrong displacement bug
Change the position of rotation justification
## 0.11.4
Fix guide line bug
Optimized drag and drop algorithm
## 0.11.3
Increase the function of rotary return.
Optimize mouse style.
## 0.11.2
Optimize drag speed
## 0.11.1
Compatible with legacy properties
## 0.11.0
Modify the timeline style and add cansee attribute to make it easy to hide when editing.
## 0.10.4
Config adds a new custommap transfer, which is used to store temporary data that is not brought into JSON.
The remote component configuration is changed from URL to object to store more configurations.
## 0.10.3
Fix the color difference problem of the left tab.
## 0.10.2
Modify the timeline, select the background color, and add the item class name to facilitate modification.
## 0.10.1
Modify the timeline class name to facilitate style modification.
## 0.10.0
The function name proposes name as a separate configuration item, the first parameter as ID and the last parameter as function name, so that the display name of the function can support conversion.
A pop-up event will not appear if the pop-up name is not passed.
## 0.9.5
Scripts loading of preview component changes from concurrency to linearity.
Using remote components in edit mode will save the current canvas state.
## 0.9.4
Fix the bug that the preview component cannot release loading
## 0.9.3
Add double click to place the canvas.
Change the initial focus state of the element.
If there is an element width and height, it is positioned at the center of the element when placed.
## 0.9.2
Add remote component to call the whole process, and Add URL attribute in component to facilitate script loading.
## 0.9.1
Add config I18N configuration. If internationalization is not used, there is no need to import the context of Intl.
The first button of the control component is changed to drag and drop, and the functions are merged into the timeline
## 0.9.0
Add react Intl and modify some styles.
## 0.8.4
Add the preview attribute to control loading from outside.
## 0.8.3
Add timeline drag bar and select.
Fix the error reported by the antd menu attribute.
## 0.8.2
Add left panel configuration.
Fix timeline flicker.
## 0.8.1
Add animation component timeline. You can preview all animations better.
## 0.8.0
The animation part is reconstructed, which can support the simultaneous configuration of multiple animations.
The minimum value of canvas drag is changed to 0.
## 0.7.7
Optimize the drag logic of the canvas to move more smoothly.
## 0.7.6
The custom globalconfig function on the right is changed to the custom type
## 0.7.5
Change the roller direction.
## 0.7.4
Fix box move bug.
## 0.7.3
Fix pop-up location and selection issues.
## 0.7.2
Fix the impact of locking components. You can't drag, zoom or rotate during locking.
## 0.7.1
The repair lock component cannot be unlocked.
## 0.7.0
Component rotation is supported!
Fix optimization logic such as dragging reference lines.
## 0.6.0
The use of iframe in edit mode is supported!
Fix the selected condition.
## 0.5.1
Fix the problem on the right that cannot be unchecked.
## 0.5.0
Fix the problem that the width of the control component is not enough.
Remove the antd custom icon, and the icon at the bottom of the container can be configured.
## 0.4.2
Fix animation error initial value.
Modify the markline style.
Global settings increase the height of the container.
## 0.4.1
Remove the Lib auto import style.
## 0.4.0
Remove the runtime export and get all properties from config.
## 0.3.1
1. Replace UUID with nanoid.
2. Control component adds ruler control.
## 0.3.0 
1. Add a ruler. The containerwrapper needs to pass config before it can be used.
2. Modify container minimum drag 667. Fix the inconsistency between the distance between the canvas and the mouse when zooming down and dragging.
3. Innercontainerdragup needs to pass config.
## 0.2.0 
Modify the transmission of the commander to obtain the config. The commander will no longer be exported from the index. When it needs to be used, it will be obtained from the config. Add the class name on the left to facilitate customization.
## 0.1.10 
Modify eslint dependency recommendation
## 0.1.9 
Add global body settings
## 0.1.8 
Add pop-up settings and remove modalcontainer
## 0.1.7 
Modify the preview special condition display and delete the console
## 0.1.6 
Adjust the initial zoom, the initial proportion of the canvas, and add the function of righting the canvas.
## 0.1.5 
Delete the button not made and add the fixed configuration
## 0.1.4 
Basic functions