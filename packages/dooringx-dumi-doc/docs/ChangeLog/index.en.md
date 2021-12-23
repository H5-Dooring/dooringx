---
title: change log
toc: menu
nav:
  title: change log
  order: 6
---
## 0.11.1
Compatible with legacy properties
## 0.11.0
Modify the timeline style and add cansee attribute to hide it during editing.
## 0.10.4
Config adds a new custommap transfer to store temporary data that is not brought into JSON.
The remote component configuration is changed from URL to object to store more configurations.
## 0.10.3
Fix the left tab color difference problem.
## 0.10.2
Modify the timeline, select the background color, and add the item class name to facilitate modification.
## 0.10.1
Modify the timeline class name to facilitate style modification.
## 0.10.0
The function name proposes name as a separate configuration item, the first parameter as ID and the last parameter as function name, so that the display name of the function can support conversion.
Pop up event if the pop-up name is not passed, no pop-up will appear.
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
Add config I18N configuration. If internationalization is not used, the context of Intl does not need to be imported.
The first button of the control component is changed to drag and drop, and the functions are merged into the timeline
## 0.9.0
Add react Intl and modify some styles.
## 0.8.4
Add the preview attribute to control external loading.
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
Optimize the canvas drag logic to move more smoothly.
## 0.7.6
The custom rightglobalcustom type on the right is changed to the function passed in config
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
Fix optimization logic such as dragging guides.
## 0.6.0
The use of iframe in edit mode is supported!
Repair the selected condition.
## 0.5.1
Fix the problem on the right that cannot be unchecked.
## 0.5.0
Fix the problem that the control component is not wide enough.
Remove the antd custom icon, and the icon at the bottom of the container can be configured.
## 0.4.2
Fix animation error initial value.
Modify the markline style.
Global settings increase container height.
## 0.4.1
Remove the Lib auto import style.
## 0.4.0
Remove the runtime export and get all properties from config.
## 0.3.1
1. Replace UUID with nanoid.
2. Control component adds ruler control.
## 0.3.0 
1. Add a ruler. The containerwrapper needs to pass config before it can be used.
2. Modify container minimum drag 667. Fix the inconsistency with the mouse distance when the canvas is zoomed down and dragged.
3. Innercontainerdragup needs to pass config.
## 0.2.0 
Modify the transfer of the commander to obtain the config. The commander is no longer exported from the index. When it needs to be used, it is obtained from the config. Add the class name on the left to facilitate customization.
## 0.1.10 
Modify eslint dependency recommendation
## 0.1.9 
Add global body settings
## 0.1.8 
Add pop-up settings and remove modalcontainer
## 0.1.7 
Modify the preview special condition display and delete the console
## 0.1.6 
Adjust the initial zoom, the initial scale of the canvas, and add the function of righting the canvas.
## 0.1.5 
Delete the button not made and add the fixed configuration
## 0.1.4 
Basic functions