<script lang="ts">
  export let text = '';
  export let position: 'top' | 'bottom' | 'automatic' = 'automatic';
  let visible = false;
  let isMouseOver = false;
  let tooltipX = 0;
  let tooltipY = 0;
  let elementDiv: HTMLDivElement;
  let tooltipDiv: HTMLDivElement;

  function calcPos() {
    tooltipX = elementDiv.offsetLeft + elementDiv.offsetWidth / 2 - tooltipDiv.offsetWidth / 2;
    let isTop = position === 'top';

    isTop = position === 'automatic' ? (elementDiv.offsetTop > window.innerHeight / 2 ? true : false) : isTop;

    if (isTop) {
      tooltipY = elementDiv.offsetTop - tooltipDiv.offsetHeight;
    } else {
      tooltipY = elementDiv.offsetTop + elementDiv.offsetHeight / 2 + tooltipDiv.offsetHeight;
    }
  }

  function showTooltip(): void {
    if (!isMouseOver) {
      isMouseOver = true;
      setTimeout(() => {
        calcPos();
        visible = isMouseOver;
      }, 800);
    }
  }

  function hideTooltip() {
    visible = false;
    isMouseOver = false;
  }
</script>

<div
  bind:this={elementDiv}
  role="tooltip"
  class="relative inline-block"
  on:mouseenter={showTooltip}
  on:mouseleave={hideTooltip}>
  <slot />
</div>

<div
  bind:this={tooltipDiv}
  class="{visible ? 'visible' : 'collapse'} text-center z-50 absolute bg-light-cmp dark:bg-dark-cmp"
  style="left: {tooltipX}px; top: {tooltipY}px;">
  {text}
</div>
