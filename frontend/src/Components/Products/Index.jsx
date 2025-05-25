import React, { useState, useEffect } from 'react';

const categoryOptions = [
  'Smartphones dhe Aksesore',
  'Laptopë dhe Tabletë',
  'Paisje Smart Home',
  'Kompjuterë dhe Pajisje Hardware',
  'Gadgete dhe Pajisje Wearables',
  'Lojëra dhe Pajisje Gaming',
  'Softuer dhe Licenca'
];

const nameOptions = [
  'Laptop',
  'Tabletë',
  'iPhone',
  'Samsung',
  'Smartwatch',
  'Kufje Wireless',
  'Smart Home Speaker',
  'Gaming Mouse',
  'Gaming Keyboard',
  'Desktop PC',
  'Monitor',
  'VR Headset',
  'Router',
  'Power Bank',
  'Smart TV'
];

const Products = () => {
  const [product, setProduct] = useState({
    name: nameOptions[0],           // default Laptop
    description: '',
    price: '',
    stockQuantity: 0,
    category: categoryOptions[0],   // default Smartphones dhe Aksesore
    imageFile: null,
  });

  const [productsList, setProductsList] = useState([]);
  const [editProductId, setEditProductId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5108/api/Product');
      if (res.ok) {
        const data = await res.json();
        setProductsList(data);
      }
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProduct(prev => ({ ...prev, imageFile: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('Name', product.name);
    formData.append('Description', product.description);
    formData.append('Price', product.price);
    formData.append('StockQuantity', product.stockQuantity);
    formData.append('Category', product.category);
    if (product.imageFile) {
      formData.append('ImageFile', product.imageFile);
    }

    try {
      let res;
      if (editProductId) {
        res = await fetch(`http://localhost:5108/api/Product/${editProductId}`, {
          method: 'PUT',
          body: formData,
        });
      } else {
        res = await fetch('http://localhost:5108/api/Product', {
          method: 'POST',
          body: formData,
        });
      }

      if (res.ok) {
        alert(editProductId ? 'Product updated!' : 'Product created!');
        setProduct({
          name: nameOptions[0],
          description: '',
          price: '',
          stockQuantity: 0,
          category: categoryOptions[0],
          imageFile: null,
        });
        setEditProductId(null);
        fetchProducts();
      } else {
        alert('Failed to save product.');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong.');
    }
  };

  const handleEdit = (prod) => {
    setEditProductId(prod.id);
    setProduct({
      name: prod.name || nameOptions[0],
      description: prod.description || '',
      price: prod.price || '',
      stockQuantity: prod.stockQuantity || 0,
      category: prod.category || categoryOptions[0],
      imageFile: null,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`http://localhost:5108/api/Product/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Product deleted!');
        fetchProducts();
      } else {
        alert('Failed to delete product.');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4 bg-white shadow p-6 rounded-md mb-10">
        <h2 className="text-xl font-semibold mb-4">{editProductId ? 'Edit Product' : 'Create Product'}</h2>

        {/* Dropdown for Name */}
        <label className="block font-medium">Name</label>
        <select
          name="name"
          value={product.name}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        >
          {nameOptions.map((opt, idx) => (
            <option key={idx} value={opt}>{opt}</option>
          ))}
        </select>

        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
          placeholder="Description"
          required
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          placeholder="Price"
          step="0.01"
          required
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="number"
          name="stockQuantity"
          value={product.stockQuantity}
          onChange={handleChange}
          placeholder="Stock Quantity"
          min="0"
          className="w-full border px-3 py-2 rounded"
        />

        {/* Dropdown for Category */}
        <label className="block font-medium">Category</label>
        <select
          name="category"
          value={product.category}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          {categoryOptions.map((opt, idx) => (
            <option key={idx} value={opt}>{opt}</option>
          ))}
        </select>

        <input
          type="file"
          name="imageFile"
          onChange={handleFileChange}
          accept="image/*"
          className="w-full"
        />

        <button
          type="submit"
          className={`px-4 py-2 rounded text-white ${editProductId ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {editProductId ? 'Update Product' : 'Submit'}
        </button>

        {editProductId && (
          <button
            type="button"
            onClick={() => {
              setEditProductId(null);
              setProduct({
                name: nameOptions[0],
                description: '',
                price: '',
                stockQuantity: 0,
                category: categoryOptions[0],
                imageFile: null,
              });
            }}
            className="ml-4 px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
        )}
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-4">Product List</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {productsList.length === 0 && <p>No products found.</p>}
          {productsList.map((prod) => (
            <div key={prod.id} className="border rounded p-4 shadow-sm bg-white flex flex-col">
              {prod.imageFile && (
                <img
                  src={`http://localhost:5108${prod.imageFile}`}
                  alt={prod.name}
                  className="w-full h-48 object-cover mb-2 rounded"
                />
              )}
              <h3 className="text-lg font-bold">{prod.name}</h3>
              <p className="text-sm text-gray-600 flex-grow">{prod.description}</p>
              <p className="mt-1 font-semibold">Price: €{prod.price.toFixed(2)}</p>
              <p className="text-sm">Stock: {prod.stockQuantity}</p>
              <p className="text-sm italic text-gray-500 mb-4">Category: {prod.category}</p>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => handleEdit(prod)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(prod.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
