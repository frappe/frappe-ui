## Props

### step

The current step of the progress bar. It is required.

### totalSteps

The total number of steps in the progress bar. Default value is 100. It is
required.

### showPercentage

If true, the percentage of the progress will be shown in the center of the
circle. Else, the absolute value of the current step will be shown. Default
value is false.

### size

The size of the progress bar. Default value is 'md'. Available options are 'xs',
'sm', 'md', 'lg', 'xl'.

### theme

The theme of the progress bar. Default value is 'black'. Available options are
'black', 'red', 'green', 'blue', 'orange'.

If a string is passed, the predefined theme will be used, and if the color does
not match any predefined theme, the default theme will be used. If a custom
theme is needed, an object with primary and secondary colors can be passed.

### themeComplete

The color of the completed progress. Default value is #76f7be (light green).

### variant

The variant of the progress bar. Default value is 'solid'. Available options are
'solid', 'outline'.

When the variant is 'solid', the progress bar on complete will be filled with
the progress color. When the variant is 'outline', the progress bar on complete
will be an outline with the progress color.
