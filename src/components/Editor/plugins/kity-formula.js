import { generateRandomStr } from '../../../utils/string';

/**
 * 初始化kity-formula插件
 * @param {Object} options - 参数选项
 * @param {WangEditor} options.editor - 编辑器实例对象
 * @param {string} [options.frameId] - iframe的ID
 * @param {string} [options.submitBtnId] - iframe中确认按钮的ID 
 * @param {string} [options.frameTitle] - iframe的标题
 * @param {Object} [options.config] - 更多的自定义配置
 * @return {Object}
 */
export function initKityFormulaPlugin(options) {
  const { editor, frameId, submitBtnId, frameTitle, config } = options || {};

  if (!editor) {
    console.error('WangEditor 实例参数不可为空！');
    return;
  }

  // 内嵌 kity-formula iframe框架的ID
  const iframeId = 
    typeof frameId === 'string' ? frameId : generateRandomStr(6);
  // iframe框架中确认按钮的ID
  const confirmBtnId = 
    typeof submitBtnId === 'string' ? submitBtnId : generateRandomStr(6);
  // iframe的内容模版
  const iframeContentTemplate = 
    `<div class="w-e-kity-formula-container">
      <iframe
        class="kity-formula-iframe"
        id="${iframeId}"
        width="100%"
        height="400px"
        scrolling="no"
        src="/kityformula/index.html"
      ></iframe>
      <div class="w-e-kity-formula-confirm-btn-wrapper">
        <button id="${confirmBtnId}" class="right confirm-btn">
          ${editor.i18next.t('确认插入')}
        </button>
      </div>
    </div>`

  return {
    width: 840,
    height: 460,
    tabs: [
      {
        title: frameTitle || editor.i18next.t('menus.panelMenus.formula.插入公式'),
        tpl: iframeContentTemplate,
        events: [
          {
            selector: '#' + confirmBtnId,
            type: 'click',
            fn: () => {
              const iframe = document.getElementById(frameId);
              const kfe = iframe.contentWindow.kfe;

              // 内置占位符字符串标记
              const HOLDER_TEXT = '\\placeholder';
              // latax生成image的地址源
              const origin = 'https://latex.codecogs.com';
              // image格式（path）
              const format = 'png.image';
              // 空格转义字符
              const SPACE = '&space;';
              // latax字符串
              let latex = kfe.execCommand('get.source');
              // latax-image的访问地址 
              let latexImgsrc = '';

              // 如果内容为临时的latex字符串，则直接返回（关闭）
              if (latex.trim() === HOLDER_TEXT) {
                return true;
              }

              // 用格式化空格字符代替纯空格
              latex = latex.replace(/\s/g, SPACE);

              latexImgsrc = origin + '/' + format + '?' + latex;

              // 使用 editor.cmd.do 无法关闭弹窗
              editor.cmd.do(
                'insertHTML',
                '<img class="formula" src="'
                  + latexImgsrc
                  + '" data-latex="'
                  + latex
                  + '" />'
              );
              
              return true;
            },
          },
        ],
      },
    ],
    ...config,
  };
}
