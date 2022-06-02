import { ServerHttpService } from './../Services/server-http.service';
import { CommonService } from './../Services/common.service';
import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { ICartItem } from '../models/cartItem';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, AfterContentChecked {
  public cartList: ICartItem[] = localStorage.length > 0 ? JSON.parse(localStorage.getItem("cartItem") || '[]') : [];

  public totalPrice: number = 0;

  constructor(private router: Router, private _commonService: CommonService, private _serverHttp: ServerHttpService) {}

  ngOnInit(): void {
    this.totalPrice = this.cartList.reduce(function(previousValue, currentValue) {
      return previousValue += currentValue.price * currentValue.quanlity
    }, 0);   
  }

  ngAfterContentChecked(): void {
    this.totalPrice = this.cartList.reduce(function(previousValue, currentValue) {
      return previousValue += currentValue.price * currentValue.quanlity
    }, 0);   

  }

  changeQuanlity(event: any) {
    const currentProduct = event.target.parentElement.parentElement.parentElement;  // Get product item on DOM
    const product = [...this.cartList].find(item => item.id === parseInt(currentProduct.dataset.id)); // Get product item on localStorage
    const quanlityOfProduct = product?.quanlity ?? 1; // Get product item quanlity
    const itemIndex = [...this.cartList].findIndex(item => item.id === parseInt(currentProduct.dataset.id)); // Get product item index on localStorage


    const currentInput = event.target.parentElement.querySelector('input');
    let num = parseInt(currentInput.value);
    

    if (event.target.dataset.quanlity === 'descrease') {
      if (num > 1) {
        // Update DOM
        num--;
        (currentInput as HTMLInputElement).value = String(num);
        
        // Update localStorage items
        this.cartList[itemIndex].quanlity = quanlityOfProduct - 1;
        this._commonService.descreamentItemCart();
      }
    } else if (event.target.dataset.quanlity === 'increase') {
      // Update DOM
      num++;
      (currentInput as HTMLInputElement).value = String(num);

      // Update localStorage items
      this.cartList[itemIndex].quanlity = quanlityOfProduct + 1;
      this._commonService.increamentItemCart();
    }
    localStorage.setItem("cartItem", JSON.stringify(this.cartList)); // Update array localStorage
  }

  activePayment(event: any) {
    const paymentItems = document.querySelectorAll('.payment_item');
    paymentItems.forEach(item => item.classList.remove('active'));
    event.currentTarget.classList.add('active');
    const inputChecked = document.querySelectorAll('.checkbox-round');
    inputChecked.forEach(item => {
      const inputI = item as HTMLInputElement;
      inputI.checked = false;
    });
    const currentChecked = event.currentTarget.querySelector('.checkbox-round') as HTMLInputElement;
    currentChecked.checked = true;
  }

  deteleProductInCart(event: any) {
    // Detele product item on DOM
    const currentProduct = event.currentTarget.parentElement;
    const listItemCart = document.querySelector(".list_cart");
    listItemCart?.removeChild(currentProduct);



    // Detele product item on localStorage
    const itemIndex = [...this.cartList].findIndex(item => item.id === parseInt(currentProduct.dataset.id)); // Get product item index on localStorage
    
    const quanlityOfProduct = this.cartList[itemIndex].quanlity; // Get product item quanlity
    console.log(quanlityOfProduct);
    this._commonService.deleteItemCart(quanlityOfProduct);

    this.cartList.splice(itemIndex, 1); // At index of product item got before, delete this product item
    localStorage.setItem("cartItem", JSON.stringify(this.cartList)); // Update array localStorage


  }

  public addOrderHTTP(data: any): void {
    this._serverHttp.addOrder(data).subscribe((data) => {
    });
  }

  submitForm() {
    const fullName = document.querySelector('input[name="name"]') as HTMLInputElement;
    const email = document.querySelector('input[name="email"]')  as HTMLInputElement;
    const phone =  document.querySelector('input[name="phone"]')  as HTMLInputElement;
    const address =  document.querySelector('input[name="address"]')  as HTMLInputElement;

    const infor = {
      orderer: fullName.value,
      phone: phone.value,
      address: address.value,
      email: email.value
    }
    const now = new Date();

    if(!fullName.value || !email.value || !phone.value || !address.value){
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (this.totalPrice === 0) {
      alert("Giỏ hàng rỗng");
      return;
    }
 
    this.addOrderHTTP({dayOrder: now.toLocaleString(), status: false, totalPrice: this.totalPrice, products: this.cartList, ...infor}); // Save order
    
    this.router.navigate(['success-order']);
    this._commonService.resetItemCart();
  }
}
