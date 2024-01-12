import html from './searchPrompts.tpl.html';
import { Component } from '../component';
import { ViewTemplate } from '../../utils/viewTemplate';

class SearchPrompts extends Component {
  view: any;

  constructor(html: any) {
    super(html);
    this.view = new ViewTemplate(html).cloneView();
  }

  render(products?: string[]) {
    if (products) {
      this.view.root.querySelectorAll('[data-tag="prompt"]').forEach((el: HTMLElement, index: number) => {
        el.innerText = products[index] || '';
        el.addEventListener('click', this.handlePromptClick.bind(this, index));
      });
    }
  }

  attach($root: HTMLElement) {
    $root.innerHTML = '';
    $root.appendChild(this.view.root);
  }

  handlePromptClick(index: number) {
    console.log('Clicked on prompt', index);
  }
}

export const searchPromptsComp = new SearchPrompts(html);
