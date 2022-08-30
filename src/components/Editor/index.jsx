import Vue from 'vue';
import WEditor from 'wangeditor';
import { initKityFormulaPlugin } from './plugins/kity-formula';
import './index.css';

export default Vue.extend({
  name: 'Editor',
  methods: {
    initEditor() {
      const editor = new WEditor('#editor-root');
      if (!editor) {
        console.info('编辑器初始化失败！')
        return;
      }
      const { $, PanelMenu, Panel } = WEditor;
      // Kity Formula面板中确认按钮的ID
      const submitBtnId = 'demo-iframe-confirm-btn';
      /**
       * 模拟Kity Formula面板的关闭逻辑
       */
      const hackKityFormulaPanelClose = () => {
        let confirmZone = null;
        const onClose = () => {
          const closeIcon = document.querySelector('.w-e-icon-close.w-e-panel-close');
          const tooltip = document.querySelector('.w-e-menu-tooltip');
          closeIcon?.click();
          if (tooltip !== null) {
            tooltip.style.visibility = 'hidden';
          }
          confirmZone?.removeEventListener('click', onClose);
          confirmZone = null;
        };
        confirmZone = document.getElementById(submitBtnId);
        confirmZone?.addEventListener('click', onClose);
      };
      /** Kity Formula菜单类 */
      class KityFormulaMenu extends PanelMenu {
        constructor(inst) {
          const $elem = $(
            `<div class="w-e-menu" data-title="插入公式">
              <svg style="width:20px;height:20px" t="1660122000430" class="formula-svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2159" width="200" height="200"><path d="M552.0896 565.90336L606.03392 512l-53.94432-53.90336L290.6112 196.83328l551.0144-0.29696v-76.25728l-659.17952 0.3584v76.25728L498.14528 512 182.3744 827.50464v75.85792l659.17952 0.3584v-76.25728l-551.0144-0.29696 261.55008-261.26336" p-id="2160" fill="#8a8a8a"></path></svg>
            </div>`
          )
          super($elem, inst);      
        }
        /**
         * 处理点击事件
         */
        clickHandler() {
          const options = {
            editor,
            frameId: 'demo-iframe',
            submitBtnId,
          };
          const config = initKityFormulaPlugin(options);
          const panel = new Panel(this, config);
          panel.create();
          hackKityFormulaPanelClose();
        }
      }
      const KITY_FORMULA_MENU_KEY = 'kity-formula-menu-key';
      editor.menus.extend(KITY_FORMULA_MENU_KEY, KityFormulaMenu);
      editor.config.menus.push(KITY_FORMULA_MENU_KEY);
      editor.create();
    },
  },
  mounted() {
    this.initEditor();
  },
  render() {
    return <div class="editor-wrapper">
      <div id="editor-root"></div>
    </div>
  },
});
