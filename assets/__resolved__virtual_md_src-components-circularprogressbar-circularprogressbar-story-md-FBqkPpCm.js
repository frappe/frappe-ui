const html = `<h2 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-hidden="true">#</a></h2>
<h3 id="step" tabindex="-1">step <a class="header-anchor" href="#step" aria-hidden="true">#</a></h3>
<p>The current step of the progress bar. It is required.</p>
<h3 id="totalsteps" tabindex="-1">totalSteps <a class="header-anchor" href="#totalsteps" aria-hidden="true">#</a></h3>
<p>The total number of steps in the progress bar. Default value is 100. It is
required.</p>
<h3 id="showpercentage" tabindex="-1">showPercentage <a class="header-anchor" href="#showpercentage" aria-hidden="true">#</a></h3>
<p>If true, the percentage of the progress will be shown in the center of the
circle. Else, the absolute value of the current step will be shown. Default
value is false.</p>
<h3 id="size" tabindex="-1">size <a class="header-anchor" href="#size" aria-hidden="true">#</a></h3>
<p>The size of the progress bar. Default value is 'md'. Available options are 'xs',
'sm', 'md', 'lg', 'xl'.</p>
<h3 id="theme" tabindex="-1">theme <a class="header-anchor" href="#theme" aria-hidden="true">#</a></h3>
<p>The theme of the progress bar. Default value is 'black'. Available options are
'black', 'red', 'green', 'blue', 'orange'.</p>
<p>If a string is passed, the predefined theme will be used, and if the color does
not match any predefined theme, the default theme will be used. If a custom
theme is needed, an object with primary and secondary colors can be passed.</p>
<h3 id="themecomplete" tabindex="-1">themeComplete <a class="header-anchor" href="#themecomplete" aria-hidden="true">#</a></h3>
<p>The color of the completed progress. Default value is #76f7be (light green).</p>
<h3 id="variant" tabindex="-1">variant <a class="header-anchor" href="#variant" aria-hidden="true">#</a></h3>
<p>The variant of the progress bar. Default value is 'solid'. Available options are
'solid', 'outline'.</p>
<p>When the variant is 'solid', the progress bar on complete will be filled with
the progress color. When the variant is 'outline', the progress bar on complete
will be an outline with the progress color.</p>
`;
const frontmatter = {};
const relativePath = "src/components/CircularProgressBar/CircularProgressBar.story.md";
export {
  frontmatter,
  html,
  relativePath
};
