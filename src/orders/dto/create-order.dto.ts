export class CreateOrderDto {

  
        products: ProductToOrder[];

        address: Address
}

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export type Size = 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL';

export interface Address {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  city: string;
  idCountry: string;
  phone: string;
}