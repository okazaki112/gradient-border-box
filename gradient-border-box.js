/**
 * GradientBorderBox - 流动渐变边框Web组件
 * 
 * 功能：创建带有流动渐变边框的卡片组件
 * 特性：
 *  - 流动的渐变边框动画
 *  - 可配置的边框粗细、圆角、动画速度
 *  - 完全响应式，支持任意内容
 *  - 样式隔离，不污染全局样式
 *  - 支持暂停/恢复动画
 */

class GradientBorderBox extends HTMLElement {
  // 监听的属性
  static get observedAttributes() {
    return [
      'border-width',
      'corner-size',
      'border-radius',
      'animation-speed',
      'gradient-colors',
      'paused',
      'content-padding'
    ];
  }

  // 默认配置
  static get DEFAULTS() {
    return {
      borderWidth: 8,
      cornerSize: 100,
      borderRadius: 8,
      animationSpeed: 1,
      gradientColors: ['#ff3333', '#ffdd22', '#3399ff', '#ff3333'],
      paused: false,
      contentPadding: 20
    };
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._state = {
      ...GradientBorderBox.DEFAULTS
    };
  }

  connectedCallback() {
    this.render();
    this._applyAttributes();
  }

  disconnectedCallback() {
    // 清理资源（如有需要）
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal !== newVal) {
      this._updateAttribute(name, newVal);
    }
  }

  // 私有方法：更新属性
  _updateAttribute(name, value) {
    switch (name) {
      case 'border-width':
        this._state.borderWidth = parseInt(value, 10) || GradientBorderBox.DEFAULTS.borderWidth;
        break;
      case 'corner-size':
        this._state.cornerSize = parseInt(value, 10) || GradientBorderBox.DEFAULTS.cornerSize;
        break;
      case 'border-radius':
        this._state.borderRadius = parseInt(value, 10) || GradientBorderBox.DEFAULTS.borderRadius;
        break;
      case 'animation-speed':
        this._state.animationSpeed = parseFloat(value) || GradientBorderBox.DEFAULTS.animationSpeed;
        break;
      case 'gradient-colors':
        try {
          this._state.gradientColors = JSON.parse(value);
        } catch (e) {
          this._state.gradientColors = GradientBorderBox.DEFAULTS.gradientColors;
        }
        break;
      case 'paused':
        this._state.paused = value === '' || value === 'true';
        break;
      case 'content-padding':
        this._state.contentPadding = parseInt(value, 10) || GradientBorderBox.DEFAULTS.contentPadding;
        break;
    }
    this._applyStyles();
  }

  // 私有方法：从属性初始化状态
  _applyAttributes() {
    const attrs = {
      'border-width': this.getAttribute('border-width'),
      'corner-size': this.getAttribute('corner-size'),
      'border-radius': this.getAttribute('border-radius'),
      'animation-speed': this.getAttribute('animation-speed'),
      'gradient-colors': this.getAttribute('gradient-colors'),
      'paused': this.getAttribute('paused'),
      'content-padding': this.getAttribute('content-padding')
    };

    Object.entries(attrs).forEach(([name, value]) => {
      if (value !== null) {
        this._updateAttribute(name, value);
      }
    });
  }

  // 私有方法：应用样式
  _applyStyles() {
    const style = this.shadowRoot.querySelector('style');
    if (!style) return;

    const { borderWidth, cornerSize, borderRadius, animationSpeed, gradientColors, contentPadding } = this._state;
    const hw = borderWidth / 2; // 半宽：边框骑在内容边缘上，内外各一半
    
    // 生成渐变色字符串
    const gradientStr = gradientColors.join(',');
    
    style.textContent = `
      :host {
        display: inline-block;
        position: relative;
      }
      
      .wrap {
        position: relative;
        display: inline-block;
        max-width: 100%;
        min-width: ${cornerSize * 2}px;
      }
      
      /* 左上角L型区域 */
      .l-top-left {
        position: absolute;
        top: -${hw}px;
        left: -${hw}px;
        width: ${cornerSize}px;
        height: ${cornerSize}px;
        overflow: hidden;
        border-radius: ${borderRadius}px 0 0 0;
        pointer-events: none;
        z-index: 20;
        clip-path: polygon(
          0 0,
          ${cornerSize}px 0,
          ${cornerSize}px ${borderWidth}px,
          ${borderWidth}px ${borderWidth}px,
          ${borderWidth}px ${cornerSize}px,
          0 ${cornerSize}px
        );
      }
      
      .l-top-left::before {
        content: "";
        position: absolute;
        inset: -100%;
        width: 300%;
        height: 300%;
        background: conic-gradient(from 0deg, ${gradientStr});
        animation: clockwise ${animationSpeed}s linear infinite;
        animation-play-state: ${this._state.paused ? 'paused' : 'running'};
      }
      
      /* 右下角L型区域 */
      .l-bottom-right {
        position: absolute;
        bottom: -${hw}px;
        right: -${hw}px;
        width: ${cornerSize}px;
        height: ${cornerSize}px;
        overflow: hidden;
        border-radius: 0 0 ${borderRadius}px 0;
        pointer-events: none;
        z-index: 20;
        clip-path: polygon(
          ${cornerSize - borderWidth}px 0,
          ${cornerSize}px 0,
          ${cornerSize}px ${cornerSize}px,
          0 ${cornerSize}px,
          0 ${cornerSize - borderWidth}px,
          ${cornerSize - borderWidth}px ${cornerSize - borderWidth}px
        );
      }
      
      .l-bottom-right::before {
        content: "";
        position: absolute;
        inset: -100%;
        width: 300%;
        height: 300%;
        background: conic-gradient(from 0deg, ${gradientStr});
        animation: clockwise ${animationSpeed}s linear infinite;
        animation-play-state: ${this._state.paused ? 'paused' : 'running'};
      }
      
      /* 内容区域 */
      .content {
        position: relative;
        background: var(--gradient-border-bg, #fff);
        z-index: 10;
        padding: ${contentPadding}px;
      }
      
      /* 顺时针旋转动画 */
      @keyframes clockwise {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
  }

  // 私有方法：渲染组件
  render() {
    this.shadowRoot.innerHTML = `
      <style></style>
      <div class="wrap">
        <div class="l-top-left"></div>
        <div class="l-bottom-right"></div>
        <div class="content">
          <slot></slot>
        </div>
      </div>
    `;
    this._applyStyles();
  }

  // 公共方法：暂停动画
  pause() {
    this._state.paused = true;
    this._applyStyles();
    this.dispatchEvent(new CustomEvent('animation-pause', {
      bubbles: true,
      composed: true
    }));
  }

  // 公共方法：恢复动画
  play() {
    this._state.paused = false;
    this._applyStyles();
    this.dispatchEvent(new CustomEvent('animation-play', {
      bubbles: true,
      composed: true
    }));
  }

  // 公共方法：切换动画状态
  toggle() {
    if (this._state.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  // 公共方法：更新渐变颜色
  setColors(colors) {
    if (Array.isArray(colors) && colors.length >= 2) {
      this._state.gradientColors = colors;
      this._applyStyles();
      this.dispatchEvent(new CustomEvent('colors-change', {
        detail: { colors },
        bubbles: true,
        composed: true
      }));
    }
  }

  // 公共方法：获取当前状态
  getState() {
    return { ...this._state };
  }

  // Getter/Setter：动画是否暂停
  get paused() {
    return this._state.paused;
  }

  set paused(value) {
    this._state.paused = Boolean(value);
    this._applyStyles();
  }

  // Getter/Setter：渐变颜色
  get colors() {
    return [...this._state.gradientColors];
  }

  set colors(value) {
    this.setColors(value);
  }
}

// 注册组件
customElements.define('gradient-border-box', GradientBorderBox);