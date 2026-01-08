export function getProductImage(category: string): string {
  switch (category) {
    case 'fruit':
      return 'https://images.unsplash.com/photo-1610832958506-aa56368176cf';
    case 'vegetable':
      return 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce';
    default:
      return 'https://images.unsplash.com/photo-1506806732259-39c2d0268443';
  }
}