import { favoriteService } from '../../services/favorite.service';
import { Component } from '../component';
import html from './favorites.tpl.html';
import { ProductList } from '../productList/productList';

class Favorites extends Component {
  favoriteProducts: ProductList;

  constructor(props: any) {
    super(props);

    this.favoriteProducts = new ProductList();
    this.favoriteProducts.attach(this.view.favorites__list);
  }
  async render() {
    const products = await favoriteService.get();
    this.favoriteProducts.update(products);
  }
}

export const favoritesComp = new Favorites(html);
