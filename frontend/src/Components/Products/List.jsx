import React, { useEffect, useState } from 'react';
import api from '../api';

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

const ProductList = ({username}) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState('newest');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');
    const [userId, setUserId] = useState(null);
  


  useEffect(() => {
    const fetchUserId = async () => {
      if (!username) return;

      try {
        const response = await api.get(`http://localhost:5108/users/by-username?username=${username}`);
        if (response.data && response.data.id) {
          setUserId(response.data.id);
        }
      } catch (err) {
        console.error("Failed to fetch userId:", err);
      }
    };

    fetchUserId();
  }, [username]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, sortOption, categoryFilter, nameFilter]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5108/api/Product');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Filter by category if selected
    if (categoryFilter) {
      filtered = filtered.filter(
        (product) => product.category === categoryFilter
      );
    }

    // Filter by name if selected
    if (nameFilter) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    // Sorting
    switch (sortOption) {
      case 'az':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'za':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'lowPrice':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'highPrice':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const handleNameChange = (e) => {
    setNameFilter(e.target.value);
  };

const handleAddToCart = async (productId, quantity) => {
  if (!userId) {
    console.error("User ID not available.");
    return;
  }

  try {
    // 1. Check if user has a pending order (returns boolean)
    const { data: hasPendingOrder } = await api.get(`/Order/HasPendingOrder/${userId}`);

    if (!hasPendingOrder) {
      // 2a. No pending order, create a new order with product
      // Backend expects DTO like: { userId, products: [{ productId, quantity }] }
      await api.post(`/Order`, {
        userId,
        products: [{ productId, quantity }],
      });

    } else {
      // 2b. Pending order exists, get that pending order's Id
      const { data: orders } = await api.get(`/Order/GetOrdersByUser/${userId}`);

      // Find the pending order from orders list
      const pendingOrder = orders.find(o => o.status === "Pending");
      if (!pendingOrder) {
        console.error("Pending order not found after check.");
        return;
      }

      // 3. Add product to existing pending order
      // Backend expects AddProductToOrderRequestDto: { orderId, productId, quantity }
      await api.post(`/Order/AddProductToOrder`, {
        orderId: pendingOrder.id,
        productId,
        quantity,
      });
    }

    alert("Product added to cart!");
  } catch (err) {
    console.error("Failed to add product to cart", err);
  }
};


const addToWishlist = async (product) => {
  if (!userId) {
    console.error("User ID not available.");
    return;
  }

  try {
    await api.post(`/Wishlist`, {
      userId,
      productId: product.id
    });

    alert("Product added to wishlist!");
  } catch (err) {
    if (err.response && err.response.status === 400) {
      // Backend responded with "Product X is already in wishlist"
      alert("Product is already in wishlist.");
    } else {
      console.error("Failed to add product to wishlist", err);
      alert("An error occurred while adding the product to wishlist.");
    }
  }
};

  return (
    <div className="p-6">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
        {/* Sort Dropdown */}
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="border px-3 py-2 rounded text-sm"
        >
          <option value="az">A to Z</option>
          <option value="za">Z to A</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="lowPrice">Lowest Price</option>
          <option value="highPrice">Highest Price</option>
        </select>

        {/* Category Filter Dropdown */}
        <select
          value={categoryFilter}
          onChange={handleCategoryChange}
          className="border px-3 py-2 rounded text-sm"
        >
          <option value="">All Categories</option>
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Name Filter Dropdown */}
        <select
          value={nameFilter}
          onChange={handleNameChange}
          className="border px-3 py-2 rounded text-sm"
        >
          <option value="">All Names</option>
          {nameOptions.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        {/* Product count */}
        <div className="ml-auto text-gray-600 text-sm">
          {filteredProducts.length} Products
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md flex flex-col items-center p-4 hover:shadow-lg transition-shadow"
          >
            {/* Product details */}
            <div className="border rounded p-4 shadow-sm bg-white flex flex-col w-full mt-2">
              {product.imageFile && (
                <img
                  src={`http://localhost:5108${product.imageFile}`}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-2 rounded"
                />
              )}
              <h3 className="text-lg font-bold">{product.name}</h3>
              <p className="text-sm text-gray-600 flex-grow">{product.description}</p>
              <p className="mt-1 font-semibold">Price: €{product.price.toFixed(2)}</p>
              <p className="text-sm">Stock: {product.stockQuantity}</p>
              <p className="text-sm italic text-gray-500 mb-4">Category: {product.category}</p>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between w-full gap-2 mt-auto">
             <button
  onClick={() => handleAddToCart(product.id, 1)}
  className="border border-orange-500 text-orange-500 hover:bg-orange-100 font-semibold rounded-full px-3 py-1 text-xs flex items-center gap-1"
>
  ADD TO
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="orange"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
</button>

              <button
                onClick={() => addToWishlist(product)}
                className="border border-gray-300 hover:border-yellow-400 rounded-full px-2 py-1"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="black"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;

