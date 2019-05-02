/* jshint esversion: 6 */

/*globals $:false */

function displayOrderList(data) {
    let cost_counter = 0;
    let disp = $('.display-list');
    disp.html("");
    let formatHTML = "";


    for (let i = 0; i < data.order.length; i++) {
        let currentOrder = data.order[i];
        formatHTML += `<li><ul>
                <li>Time Sent: ${currentOrder.sendTime}</li>
                <li>Order ID: ${currentOrder._id}
                <div>- - -</div></li>`;
        for (let j = 0; j < currentOrder.selectedProducts.length; j++) {
            let currentProduct = currentOrder.selectedProducts[j];
            formatHTML +=
                `<li>
                <div>- Product Name: ${currentProduct.productname}</div>
                <div>- ID: ${currentProduct.id}</div>
                <div>- Price: ${currentProduct.price}</div>
                <div>- Category: ${currentProduct.category}</div>
                <div>- Quantity: ${currentProduct.numSelected}</div>
                <div>- - -</div>
            </li>`;
            cost_counter += currentProduct.price * currentProduct.numSelected;
        }
        formatHTML += `<li>Total Order Cost: ${cost_counter}</li></ul></li>`;
    }
    disp.append(formatHTML);
}

function displayProductList(data) {
    let disp = $('.display-list');
    disp.html("");

    for (let i = 0; i < data.product.length; i++) {
        console.log(data.product[i]);
        disp.append(
            `<li>
                <div>Product Name: ${data.product[i].productname}</div>
                <div>ID: ${data.product[i].id}</div>
                <div>Price: ${data.product[i].price}</div>
                <div>Category: ${data.product[i].category}</div>
                <div>imageURL: ${data.product[i].imageURL}</div>
                <div><img src=${data.product[i].imageURL} alt=${data.product[i].productname} /></div>
            </li>`);
    }
}

$('.observeOrdersButton').on("click", function() {
    event.preventDefault();

    $('.display-list').html("");
    let elementsToToggle = $('.toggle');

    $('.observeOrdersButton')[0].classList.toggle("disabled");
    $('.manageMenuButton')[0].classList.toggle("disabled");

    for (let i = 0; i< elementsToToggle.length; i++)
    {elementsToToggle[i].classList.toggle("hide");}
});

$('.manageMenuButton').on("click", function() {
    event.preventDefault();

    $('.display-list').html("");
    let elementsToToggle = $('.toggle');

    $('.observeOrdersButton')[0].classList.toggle("disabled");
    $('.manageMenuButton')[0].classList.toggle("disabled");

    for (let i = 0; i< elementsToToggle.length; i++)
    {elementsToToggle[i].classList.toggle("hide");}
});

$('.getAllOrdersButton').on("click", function () {
    event.preventDefault();

    let url = "./order";
    let settings = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    };

    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            displayOrderList(responseJSON);
        })
        .catch(err => {
            console.log(err);
        });
});

$('.getAllFoodButton').on("click", function () {
    event.preventDefault();

    let url = "./product";
    let settings = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    };

    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            displayProductList(responseJSON);
        })
        .catch(err => {
            console.log(err);
        });
});

$('.new-productForm').on("submit", function () {
    event.preventDefault();

    let objectToAdd = {
        productname: $('.new-productForm.productname').val(),
        id: $('.new-productForm.id').val(),
        price: $('.new-productForm.price').val(),
        category: $('.new-productForm.category').val(),
        imageURL: $('.new-productForm.imageURL').val(),
    };

    let url = "./product";
    let settings = {
        method: "POST",
        body: JSON.stringify(objectToAdd),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    $('.display-list').html("");

    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            console.log(responseJSON);
        })
        .catch(err => {
            console.log(err);
        });
});

$('.update-productForm').on("submit", function () {
    event.preventDefault();

    let id = $('.update-productForm.id').val();
    let objectToAdd = {
        productname: $('.update-productForm.productname').val(),
        price: $('.update-productForm.price').val(),
        category: $('.update-productForm.category').val(),
        imageURL: $('.update-productForm.imageURL').val(),
    };

    let url = `./product/${id}`;

    let settings = {
        method: "PUT",
        body: JSON.stringify(objectToAdd, function (key, value) {
            return value === "" ? undefined : value
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    $('.display-list').html("");

    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            console.log(responseJSON);
        })
        .catch(err => {
            console.log(err);
        });
});

$('.complete-orderForm').on("submit", function () {
    event.preventDefault();

    let uid = $(".complete-orderForm.uidIn").val();
    let url = `./order/one/${uid}`;

    let body = {
        id: uid,
    };

    let settings = {
        method: "DELETE",
        body: JSON.stringify(body, function (key, value) {
            return value === "" ? undefined : value
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    };


    $('.display-list').html("");

    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            console.log(responseJSON);
        })
        .catch(err => {
            console.log(err);
        });
});

$('.delete-productForm').on("submit", function () {
    event.preventDefault();

    let id = $(".delete-productForm.uidIn").val();
    let url = `./product/${id}`;

    let body = {
        id: id,
    };

    let settings = {
        method: "DELETE",
        body: JSON.stringify(body, function (key, value) {
            return value === "" ? undefined : value
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    };


    $('.display-list').html("");

    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            console.log(responseJSON);
        })
        .catch(err => {
            console.log(err);
        });
});

$('.completeAllButton').on("click", function () {
    event.preventDefault();

    let url = `./order/all/`;

    let settings = {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        }
    };


    $('.display-list').html("");

    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            console.log(responseJSON);
        })
        .catch(err => {
            console.log(err);
        });
});