import {productData} from './data/index.js'

const fetchFromApi = async () => {
    fetch('https://fakestoreapi.com/products')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
  })
  .then(data => {
    // console.log(data); 
    data.forEach(async e => {
        await productData.addProduct(e.id, e.title, e.price, e.description, e.category, e.image, e.rating)
    });
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });

}

await fetchFromApi()

// const products = await productData.getAllProducts()

// console.log(products)