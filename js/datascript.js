document.addEventListener("DOMContentLoaded", loadproductdata());
document.addEventListener("DOMContentLoaded", loadcurrencydata());

class category {
    constructor(name, type, description) {
        this.name = name;
        this.type = type;
        this.description = "The description is created dynamically for the product -" + " " + this.name + " " + "which is of category type - " + this.type;
    }
}

function createobject(name, type) {
    return new category(name, type);
}

var convertcurrencydata = (amount, rate) => {
    return (amount * rate).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function loadproductdata() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let products = JSON.parse(this.responseText);
            localStorage.setItem('products', JSON.stringify(products));
            let ele = document.getElementById('productoption');
            Object.keys(products).forEach((key) => {
                for (let i = 0; i < products[key].length; i++) {
                    ele.innerHTML = ele.innerHTML + '<option>' + products[key][i].productName + '</option>';
                }
            });
        }
    }
    xhttp.open("GET", "../js/productdata.json", true);
    xhttp.send();
}

function loadcurrencydata() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let currencies = JSON.parse(this.responseText);
            localStorage.setItem('currencies', JSON.stringify(currencies));
            let ele = document.getElementById('currencyoption');
            Object.keys(currencies).forEach((key) => {
                for (let i = 0; i < currencies[key].length; i++) {
                    ele.innerHTML = ele.innerHTML + '<option>' + currencies[key][i].currency_ISO + '</option>';
                }
            });
        }
    }
    xhttp.open("GET", "../js/currencydata.json", true);
    xhttp.send();
}

function display() {
    document.getElementById('sale-container').style.display = "none";
    document.getElementById('saledescription').value = "";
    var products = JSON.parse(localStorage.getItem('products'));
    let ele = document.getElementById('productoption');
    let element = document.getElementById('main-container');
    if (ele.options[ele.selectedIndex].text == "---Select Product---") {
        element.style.display = "none";
        document.getElementById('section4').style.textAlign = "center";
    } else {
        element.style.display = "block";
        Object.keys(products).forEach((key) => {
            for (let i = 0; i < products[key].length; i++) {
                if (products[key][i].productName == ele.options[ele.selectedIndex].text) {
                    document.getElementById('productid').value = products[key][i].productID;
                    document.getElementById('productname').value = products[key][i].productName;
                    document.getElementById('productcategory').value = products[key][i].productcategory;
                    document.getElementById('productprice').value = products[key][i].productPrice.toFixed(2).toString()
                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");;
                    document.getElementById('product-image').src = products[key][i].productimage;
                    document.getElementById('product-image').alt = products[key][i].productimagetext;
                    var product_object = createobject(products[key][i].productName, products[key][i].productcategory);
                    Object.assign(product_object, products[key][i]);
                    localStorage.setItem('product_object', JSON.stringify(product_object));
                    document.getElementById('productcategory1').value = products[key][i].productcategory;
                    document.getElementById('productcategorydesc').value = product_object.description;
                    document.getElementById('productpricebaseccy').value = products[key][i].productPrice.toFixed(2)
                        .toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");;
                    if (products[key][i].productsalecode) {
                        document.getElementById('sale-button').disabled = false;
                    } else {
                        document.getElementById('sale-button').disabled = true;
                        document.getElementById('sale-container').style.display = "block";
                        document.getElementById('saledescription').value =
                            "This product is currently not available for sales!";
                    }
                }
            }
        });
    }
}

function calculate() {
    var product_object = JSON.parse(localStorage.getItem('product_object'));
    let ccyele = document.getElementById('currencyoption');
    var currencies = JSON.parse(localStorage.getItem('currencies'));
    Object.keys(currencies).forEach((key) => {
        for (let j = 0; j < currencies[key].length; j++) {
            if (ccyele.options[ccyele.selectedIndex].text == "---Select Currency---") {
                document.getElementById('ccy-container').style.display = "none";
            } else {
                document.getElementById('ccy-container').style.display = "block";
                if (currencies[key][j].currency_ISO == ccyele.options[ccyele.selectedIndex].text) {
                    document.getElementById('convertccy').value = currencies[key][j].currency;
                    document.getElementById('convertrate').value = currencies[key][j].rate.toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");;
                    document.getElementById('convertedprice').value = convertcurrencydata(product_object.productPrice.toFixed(2), currencies[key][j].rate.toFixed(2));
                    resetcheck = true;
                    break;
                }
            }
        }
    });
}

function mysales() {
    document.getElementById('sale-container').style.display = "block";
    document.getElementById('sale-button').disabled = true;
    document.getElementById('saledescription').value = "Thank you for the purchase! We will get in touch with you on the next steps :)";
}

function reset() {
    document.getElementById('currencyoption').selectedIndex = 0;
    document.getElementById('ccy-container').style.display = "none";
}