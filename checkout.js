// Event listener to execute the script once the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Select the checkout form and add an event listener for form submission
    const checkoutForm = document.getElementById('checkout-form');
    checkoutForm.addEventListener('submit', handleCheckout);

    // Function to handle the checkout process when the form is submitted
    function handleCheckout(event) {
        event.preventDefault(); // Prevent the default form submission

        // Validate the form before processing the checkout
        if (validateForm()) {
            // Retrieve form field values
            const fullName = document.getElementById('full-name').value;
            const email = document.getElementById('email').value;
            const address = document.getElementById('address').value;
            const city = document.getElementById('city').value;
            const state = document.getElementById('state').value;
            const zipCode = document.getElementById('zip-code').value;
            const nameOnCard = document.getElementById('name-on-card').value;
            const cardNumber = document.getElementById('card-number').value;
            const expMonth = document.getElementById('exp-month').value;
            const expYear = document.getElementById('exp-year').value;
            const cvv = document.getElementById('cvv').value;

            // Calculate the delivery date (assuming delivery in 7 days)
            const deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + 7);

            // Calculate the total price of the order
            const totalPrice = calculateTotalPrice();

            // Create a thank you message with order details
            const thankYouMessage = `
                <h2 style="color: #fff;">Thank You for Your Order!</h2>
                <p style="color: #fff;"><i class="fa fa-calendar" style="color: #ffeb3b;"></i> <strong>Delivery Date:</strong> ${deliveryDate.toDateString()}</p>
                <p style="color: #fff;"><i class="fa fa-map-marker-alt" style="color: #ff5722;"></i> <strong>Delivery Address:</strong></p>
                <p style="color: #fff;">${fullName}</p>
                <p style="color: #fff;">${address}</p>
                <p style="color: #fff;">${city}, ${state}, ${zipCode}</p>
                <p style="color: #fff;"><i class="fa fa-dollar-sign" style="color: #4caf50;"></i> <strong>Total Price:</strong> Rs. ${totalPrice}</p>
            `;

            // Show the thank you message in a modal
            showModal(thankYouMessage);
            checkoutForm.reset(); // Reset the form after submission
        }
    }

    // Function to display a modal with a given message
    function showModal(message) {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '20px';
        modal.style.right = '20px'; // Position the modal to the right
        modal.style.padding = '2rem';
        modal.style.backgroundColor = '#333';
        modal.style.color = '#fff';
        modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        modal.style.borderRadius = '10px';
        modal.style.width = '300px';
        modal.style.zIndex = '1000';
        modal.innerHTML = message;

        // Create a close button for the modal
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.marginTop = '1rem';
        closeButton.style.padding = '10px 20px';
        closeButton.style.backgroundColor = '#ffeb3b';
        closeButton.style.color = '#000';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        closeButton.style.cursor = 'pointer';

        // Add event listener to close the modal when the button is clicked
        closeButton.addEventListener('click', function() {
            document.body.removeChild(modal);
        });

        // Append the close button to the modal and the modal to the body
        modal.appendChild(closeButton);
        document.body.appendChild(modal);
    }

    // Function to validate the form fields
    function validateForm() {
        // Select the form fields
        const fullName = document.getElementById('full-name');
        const email = document.getElementById('email');
        const address = document.getElementById('address');
        const city = document.getElementById('city');
        const state = document.getElementById('state');
        const zipCode = document.getElementById('zip-code');
        const cardName = document.getElementById('name-on-card');
        const cardNumber = document.getElementById('card-number');
        const expMonth = document.getElementById('exp-month');
        const expYear = document.getElementById('exp-year');
        const cvv = document.getElementById('cvv');

        // Array of fields to validate
        const fields = [fullName, email, address, city, state, zipCode, cardName, cardNumber, expMonth, expYear, cvv];
        let allFilled = true;

        // Loop through each field to check if it's filled
        fields.forEach(field => {
            if (!field.value) {
                allFilled = false;
                // Highlight the field with a red border if not filled
                field.style.border = '1px solid red';
                alert('Please fill out all fields correctly.');
            } else {
                // Reset the border style if filled
                field.style.border = '1px solid #ccc';
            }
        });

        return allFilled; // Return the validation result
    }

    // Function to calculate the total price of the order
    function calculateTotalPrice() {
        // Retrieve the order summary from local storage
        const orderSummary = JSON.parse(localStorage.getItem('orderSummary')) || [];
        let totalPrice = 0;

        // Loop through each item in the order summary to calculate the total price
        orderSummary.forEach(item => {
            const itemPrice = parseFloat(item.itemPrice.replace('Rs. ', ''));
            totalPrice += itemPrice;
        });

        return totalPrice.toFixed(2); // Return the total price
    }

    // Function to populate the order summary on the checkout page
    function populateOrderSummary() {
        const orderSummary = JSON.parse(localStorage.getItem('orderSummary')) || [];
        const orderItemsContainer = document.getElementById('order-items');
        const totalPriceElement = document.getElementById('total-price');

        orderItemsContainer.innerHTML = ''; // Clear existing order items
        let totalPrice = 0;

        // Loop through each item in the order summary to display it
        orderSummary.forEach(item => {
            const orderRow = document.createElement('tr');

            // Create and append the item cell with product image and name
            const itemCell = document.createElement('td');
            itemCell.classList.add('item');
            const img = document.createElement('img');
            img.src = item.imageSrc;
            img.alt = item.itemName;
            itemCell.appendChild(img);

            const itemName = document.createElement('span');
            itemName.innerText = item.itemName;
            itemCell.appendChild(itemName);

            // Create and append the quantity cell
            const quantityCell = document.createElement('td');
            quantityCell.classList.add('quantity');
            quantityCell.innerText = item.itemQuantity;

            // Create and append the price cell
            const priceCell = document.createElement('td');
            priceCell.classList.add('price');
            priceCell.innerText = item.itemPrice;

            // Append all cells to the order row
            orderRow.appendChild(itemCell);
            orderRow.appendChild(quantityCell);
            orderRow.appendChild(priceCell);

            // Append the order row to the order items container
            orderItemsContainer.appendChild(orderRow);

            // Update the total price
            totalPrice += parseFloat(item.itemPrice.replace('Rs. ', ''));
        });

        // Update the total price element with the calculated total price
        totalPriceElement.innerText = `Rs. ${totalPrice.toFixed(2)}`;
    }

    // Populate the order summary when the page loads
    populateOrderSummary();
});
