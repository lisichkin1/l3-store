import { Component } from '../component';
import { ProductList } from '../productList/productList';
import { formatPrice } from '../../utils/helpers';
import { ProductData } from 'types';
import html from './productDetail.tpl.html';
import { cartService } from '../../services/cart.service';
import { favoriteService } from '../../services/favorite.service';

class ProductDetail extends Component {
  more: ProductList;
  product?: ProductData;

  constructor(props: any) {
    super(props);

    this.more = new ProductList();
    this.more.attach(this.view.more);
  }

  async render() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = Number(urlParams.get('id'));

    const productResp = await fetch(`/api/getProduct?id=${productId}`);
    this.product = await productResp.json();

    if (!this.product) return;

    const { id, src, name, description, salePriceU } = this.product;

    this.view.photo.setAttribute('src', src);
    this.view.title.innerText = name;
    this.view.description.innerText = description;
    this.view.price.innerText = formatPrice(salePriceU);
    this.view.btnBuy.onclick = this._addToCart.bind(this);
    this.view.btnFav.onclick = this._addToFavorite.bind(this);

    const isInFavorite = await favoriteService.isInFavorite(this.product);
    const isInCart = await cartService.isInCart(this.product);
    console.log(isInFavorite, isInCart);
    if (isInCart) this._setInCart();
    if (isInFavorite) this._setInFavorite();

    fetch(`/api/getProductSecretKey?id=${id}`)
      .then((res) => res.json())
      .then((secretKey) => {
        this.view.secretKey.setAttribute('content', secretKey);
      });

    fetch('/api/getPopularProducts')
      .then((res) => res.json())
      .then((products) => {
        this.more.update(products);
      });
  }

  private _addToCart() {
    if (!this.product) return;

    cartService.addProduct(this.product);
    this._setInCart();
  }
  private async _addToFavorite() {
    if (!this.product) return;
    const isInFavorite = await favoriteService.isInFavorite(this.product);
    if (isInFavorite) {
      favoriteService.removeProduct(this.product);
      this._setUnFavorite();
    } else {
      favoriteService.addProduct(this.product);
      this._setInFavorite();
    }
  }

  private _setInCart() {
    this.view.btnBuy.innerText = '✓ В корзине';
    this.view.btnBuy.disabled = true;
  }
  private _setInFavorite() {
    this.view.btnFav.innerHTML = `
    <svg class="svg-icon">
      <use xlink:href="#heart-fill"></use>
    </svg>
  `;
  }
  private _setUnFavorite() {
    this.view.btnFav.innerHTML = `
    <svg class="svg-icon">
      <use xlink:href="#heart"></use>
    </svg>
  `;
  }
}

export const productDetailComp = new ProductDetail(html);
