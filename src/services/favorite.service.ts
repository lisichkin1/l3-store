import localforage from 'localforage';
import { ProductData } from 'types';

const DB_FAV = '__wb-favorite';

class FavoriteService {
  init() {
    this._updCounters();
  }

  async addProduct(product: ProductData) {
    const products = await this.get();
    await this.set([...products, product]);
    console.log(products);
  }

  async removeProduct(product: ProductData) {
    const products = await this.get();
    await this.set(products.filter(({ id }) => id !== product.id));
  }

  async clear() {
    await localforage.removeItem(DB_FAV);
    this._updCounters();
  }

  async get(): Promise<ProductData[]> {
    console.log((await localforage.getItem(DB_FAV)) || []);
    return (await localforage.getItem(DB_FAV)) || [];
  }

  async set(data: ProductData[]) {
    await localforage.setItem(DB_FAV, data);
    this._updCounters();
  }

  async isInFavorite(product: ProductData) {
    const products = await this.get();
    return products.some(({ id }) => id === product.id);
  }

  private async _updCounters() {
    const products = await this.get();
    const count = products.length >= 10 ? '9+' : products.length;

    //@ts-ignore
    document.querySelectorAll('.js__favorite-counter').forEach(($el: HTMLElement) => {
      $el.innerText = String(count || '');
    });
  }
}

export const favoriteService = new FavoriteService();
