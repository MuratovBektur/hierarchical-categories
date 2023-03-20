export interface ICategory {
  countView: number;
  countPlay: number;
  countSend: number;
  countOrder: number;
  countPay: number;
  parentId: number;
  categoryId: number;
  nameId: number | null;
  id: number;
  title: title;
  viewSend: number;
  viewPay: number;
  children: Array<ICategory>;
}
export interface ICategoryTotal {
  countView: number;
  countPlay: number;
  countSend: number;
  countOrder: number;
  countPay: number;
  viewSend: number;
  viewPay: number;
}

export interface IFetchedCategories {
  categories: Array<ICategory>;
  total: ICategoryTotal;
}
