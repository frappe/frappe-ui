## Props


### step
The current step of the progress bar. 
It is required.

### totalSteps
The total number of steps in the progress bar. Default value is 100.
It is required.

### ringSize
The size of the ring.
The type of the value should be a string with a valid CSS unit (e.g. '42px', '2rem', '5em'). Default value is 42px.

### ringBarWidth
The width of the ring bar in pixels.
The type of the value should be a string with a valid CSS unit (e.g. '10px', '0.5rem', '1em'). Default value is 10px.

### innerTextFontSize
The font size of the inner text.
The type of the value should be a string with a valid CSS unit (e.g. '16px', '1rem', '2em'). Default value is 16px.

### progressColor
The color of the how much progress has been made. Default value is #333 (dark grey).

### progressRemainingColor
The color of the remaining progress. Default value is #888 (light grey).

### progressCompleteColor
The color of the completed progress. Default value is #76f7be (light green).

### isOuterCircleFilledOnComplete
If true, the outer circle will be filled with the `progressCompleteColor` when the progress is completed. Else, the inner circle will be filled with the `progressCompleteColor`. Default value is false.

### showPercentage
If true, the percentage of the progress will be shown in the center of the circle. Else, the absolute value of the current step will be shown. Default value is false.