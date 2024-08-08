document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.querySelector('.order-form');
    const orderItemsContainer = document.getElementById('order-items');
    const totalPriceElement = document.getElementById('total-price');

    // Load order summary from local storage when the page loads
    loadOrderSummaryFromLocalStorage();

    // Add event listener to the form to update the order summary whenever a change occurs
    orderForm.addEventListener('change', updateOrderSummary);

    function updateOrderSummary() {
        const products = document.querySelectorAll('.product');
        let totalPrice = 0;
        orderItemsContainer.innerHTML = '';

        // Loop through each product and update the order summary based on quantity
        products.forEach(product => {
            const quantityInput = product.querySelector('input[type="number"]');
            const quantity = parseFloat(quantityInput.value);
            if (quantity > 0) {
                const productName = product.querySelector('h4').innerText;
                const productPrice = parseFloat(product.querySelector('.price').innerText.replace('Rs. ', ''));
                const itemPrice = quantity * productPrice;

                const orderRow = document.createElement('tr');

                // Create item cell with product image and name
                const itemCell = document.createElement('td');
                itemCell.classList.add('item');
                const img = document.createElement('img');
                img.src = product.querySelector('img').src;
                img.alt = productName;
                itemCell.appendChild(img);
                itemCell.append(productName);

                // Create quantity cell
                const quantityCell = document.createElement('td');
                quantityCell.classList.add('quantity');
                const quantityLabel = product.querySelector('label').innerText;
                quantityCell.innerText = quantityLabel.includes('(kg)') ? `${quantity} kg` : `${quantity}`;

                // Create price cell
                const priceCell = document.createElement('td');
                priceCell.classList.add('price');
                priceCell.innerText = `Rs. ${itemPrice.toFixed(2)}`;

                // Create delete cell with delete icon
                const deleteCell = document.createElement('td');
                deleteCell.classList.add('delete');
                const deleteIcon = document.createElement('i');
                deleteIcon.classList.add('fa', 'fa-trash');
                deleteIcon.style.cursor = 'pointer';
                deleteIcon.addEventListener('click', function() {
                    removeItemFromOrder(productName);
                });
                deleteCell.appendChild(deleteIcon);

                // Append cells to the order row
                orderRow.appendChild(itemCell);
                orderRow.appendChild(quantityCell);
                orderRow.appendChild(priceCell);
                orderRow.appendChild(deleteCell);

                // Append the order row to the order items container
                orderItemsContainer.appendChild(orderRow);

                // Update total price
                totalPrice += itemPrice;
            }
        });

        // Update total price element
        totalPriceElement.innerText = `Rs. ${totalPrice.toFixed(2)}`;
        saveOrderSummaryToLocalStorage();
    }

    function saveOrderSummaryToLocalStorage() {
        const orderSummary = [];
        const orderRows = orderItemsContainer.querySelectorAll('tr');

        // Loop through each order row and save the details to local storage
        orderRows.forEach(row => {
            const itemName = row.querySelector('.item').innerText;
            const itemQuantity = row.querySelector('.quantity').innerText;
            const itemPrice = row.querySelector('.price').innerText;
            const imageSrc = row.querySelector('img').src;

            orderSummary.push({ itemName, itemQuantity, itemPrice, imageSrc });
        });

        localStorage.setItem('orderSummary', JSON.stringify(orderSummary));
        localStorage.setItem('totalPrice', totalPriceElement.innerText);

        // Save quantities to local storage
        const quantities = {};
        const products = document.querySelectorAll('.product');
        products.forEach(product => {
            const quantityInput = product.querySelector('input[type="number"]');
            quantities[quantityInput.id] = quantityInput.value;
        });
        localStorage.setItem('quantities', JSON.stringify(quantities));
    }

    function loadOrderSummaryFromLocalStorage() {
        const orderSummary = JSON.parse(localStorage.getItem('orderSummary'));
        const totalPrice = localStorage.getItem('totalPrice');

        // Load order summary and total price from local storage
        if (orderSummary && totalPrice) {
            orderItemsContainer.innerHTML = '';

            // Loop through each item in the order summary and create order rows
            orderSummary.forEach(item => {
                const orderRow = document.createElement('tr');

                // Create item cell with product image and name
                const itemCell = document.createElement('td');
                itemCell.classList.add('item');
                const img = document.createElement('img');
                img.src = item.imageSrc;
                img.alt = item.itemName;
                itemCell.appendChild(img);
                itemCell.append(item.itemName);

                // Create quantity cell
                const quantityCell = document.createElement('td');
                quantityCell.classList.add('quantity');
                quantityCell.innerText = item.itemQuantity;

                // Create price cell
                const priceCell = document.createElement('td');
                priceCell.classList.add('price');
                priceCell.innerText = item.itemPrice;

                // Create delete cell with delete icon
                const deleteCell = document.createElement('td');
                deleteCell.classList.add('delete');
                const deleteIcon = document.createElement('i');
                deleteIcon.classList.add('fa', 'fa-trash');
                deleteIcon.style.cursor = 'pointer';
                deleteIcon.addEventListener('click', function() {
                    removeItemFromOrder(item.itemName);
                });
                deleteCell.appendChild(deleteIcon);

                // Append cells to the order row
                orderRow.appendChild(itemCell);
                orderRow.appendChild(quantityCell);
                orderRow.appendChild(priceCell);
                orderRow.appendChild(deleteCell);

                // Append the order row to the order items container
                orderItemsContainer.appendChild(orderRow);
            });

            // Update total price element
            totalPriceElement.innerText = totalPrice;
        }

        // Load quantities from local storage
        const quantities = JSON.parse(localStorage.getItem('quantities'));
        if (quantities) {
            const products = document.querySelectorAll('.product');
            products.forEach(product => {
                const quantityInput = product.querySelector('input[type="number"]');
                quantityInput.value = quantities[quantityInput.id] || 0;
            });
        }
    }

    function removeItemFromOrder(itemName) {
        const products = document.querySelectorAll('.product');

        // Loop through each product and set the quantity to 0 if the product name matches
        products.forEach(product => {
            const productName = product.querySelector('h4').innerText;
            if (productName === itemName) {
                const quantityInput = product.querySelector('input[type="number"]');
                quantityInput.value = 0;
            }
        });

        // Update the order summary after removing the item
        updateOrderSummary();
    }

    const addFavoritesBtn = document.getElementById('add-favorites-btn');
    const applyFavoritesBtn = document.getElementById('apply-favorites-btn');

    // Add event listeners for the favorites buttons
    addFavoritesBtn.addEventListener('click', addToFavorites);
    applyFavoritesBtn.addEventListener('click', applyFavorites);

    function addToFavorites() {
        const products = document.querySelectorAll('.product');
        const favorites = {};

        // Loop through each product and add to favorites if the quantity is greater than 0
        products.forEach(product => {
            const quantityInput = product.querySelector('input[type="number"]');
            const quantity = parseFloat(quantityInput.value);
            if (quantity > 0) {
                const productId = quantityInput.id;
                const productName = product.querySelector('h4').innerText;
                const productPrice = product.querySelector('.price').innerText;
                const productImg = product.querySelector('img').src;

                favorites[productId] = {
                    quantity,
                    name: productName,
                    price: productPrice,
                    img: productImg
                };
            }
        });

        // Save favorites to local storage if there are any items
        if (Object.keys(favorites).length > 0) {
            localStorage.setItem('favorites', JSON.stringify(favorites));
            alert('Favorites saved!');
        } else {
            // Alert if no items are added to favorites
            alert('No added favorite items!');
        }
    }

    function applyFavorites() {
        const favorites = JSON.parse(localStorage.getItem('favorites'));

        // Apply favorites if there are any saved in local storage
        if (favorites && Object.keys(favorites).length > 0) {
            const products = document.querySelectorAll('.product');

            // Loop through each product and set the quantity from favorites
            products.forEach(product => {
                const quantityInput = product.querySelector('input[type="number"]');
                const productId = quantityInput.id;
                if (favorites[productId] !== undefined) {
                    quantityInput.value = favorites[productId].quantity;
                } else {
                    quantityInput.value = 0;
                }
            });

            // Update the order summary after applying favorites
            updateOrderSummary();
            alert('Favorites applied!');
        } else {
            // Alert if no favorites are found in local storage
            alert('No favorites found!');
        }
    }

    const buyNowBtn = document.querySelector('.btn');

    // Add event listener to the buy now button to navigate to checkout
    buyNowBtn.addEventListener('click', navigateToCheckout);

    function navigateToCheckout(event) {
        event.preventDefault();

        const orderSummary = [];
        const orderRows = orderItemsContainer.querySelectorAll('tr');

        // Loop through each order row and save the details to local storage
        orderRows.forEach(row => {
            const itemName = row.querySelector('.item').innerText;
            const itemQuantity = row.querySelector('.quantity').innerText;
            const itemPrice = row.querySelector('.price').innerText;
            const imageSrc = row.querySelector('img').src;

            orderSummary.push({ itemName, itemQuantity, itemPrice, imageSrc });
        });

        localStorage.setItem('orderSummary', JSON.stringify(orderSummary));
        localStorage.setItem('totalPrice', totalPriceElement.innerText);

        // Navigate to the checkout page
        window.location.href = 'checkout.html';
    }
});
