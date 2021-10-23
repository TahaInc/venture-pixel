class CartView extends React.Component {
  constructor(props) {
    super(props);
  }

  deleteItem(src, size) {
    cart.splice(cart.indexOf(cart.filter((i) => i.picture == src && i.size == size)[0]), 1);
    setCart(cart, accessid);
    $("#cart_amount").html(cart.reduce((total, i) => total + parseInt(i.quantity), 0));
    $("#total_price").html(cart.reduce((total, i) => total + parseInt(i.quantity) * parseInt(i.price), 0) + "$");
    ReactDOM.render(<CartView cart={cart} />, document.querySelector("#cart_items_list"));
  }

  reduceQty(src, size) {
    var item = cart.filter((i) => i.picture == src && i.size == size)[0];
    if (item.quantity > 1) {
      item.quantity -= 1;
      setCart(cart, accessid);
      $("#cart_amount").html(cart.reduce((total, i) => total + parseInt(i.quantity), 0));
      $("#total_price").html(cart.reduce((total, i) => total + parseInt(i.quantity) * parseInt(i.price), 0) + "$");
      ReactDOM.render(<CartView cart={cart} />, document.querySelector("#cart_items_list"));
    } else if (item.quantity == 1) {
      cart.splice(cart.indexOf(cart.filter((i) => i.picture == src && i.size == size)[0]), 1);
      setCart(cart, accessid);
      $("#cart_amount").html(cart.reduce((total, i) => total + parseInt(i.quantity), 0));
      $("#total_price").html(cart.reduce((total, i) => total + parseInt(i.quantity) * parseInt(i.price), 0) + "$");
      ReactDOM.render(<CartView cart={cart} />, document.querySelector("#cart_items_list"));
    }
  }

  addQty(src, size) {
    var quantity = parseInt(cart.filter((i) => i.picture == src && i.size == size)[0].quantity);
    cart.filter((i) => i.picture == src && i.size == size)[0].quantity = quantity + 1;
    setCart(cart, accessid);
    $("#cart_amount").html(cart.reduce((total, i) => total + parseInt(i.quantity), 0));
    $("#total_price").html(cart.reduce((total, i) => total + parseInt(i.quantity) * parseInt(i.price), 0) + "$");
    ReactDOM.render(<CartView cart={cart} />, document.querySelector("#cart_items_list"));
  }

  render() {
    let items = [];

    for (let i = 0; i < this.props.cart.length; i++) {
      items.push(
        <div class="cart_item">
          <img class="cart_picture_preview" src={this.props.cart[i].picture} />
          <div class="cart_item_info">
            <h2 class="item_number">#{parseInt(this.props.cart[i].picture.split("/").pop().split(".")[0])}</h2>
            <h3 class="item_size">
              <span data-language="size">Size</span>: {this.props.cart[i].size}
            </h3>
          </div>
          <div class="cart_item_amount">
            <h3 class="item_price" data-language={this.props.cart[i].size}>
              {this.props.cart[i].price}
            </h3>
            <div class="quantity_counter">
              <h3 class="counter_button" onClick={(e) => this.reduceQty(this.props.cart[i].picture, this.props.cart[i].size)}>
                -
              </h3>
              <h3 class="counter_amount">{this.props.cart[i].quantity}</h3>
              <h3 class="counter_button" onClick={(e) => this.addQty(this.props.cart[i].picture, this.props.cart[i].size)}>
                +
              </h3>
            </div>
          </div>
          <div class="delete_item" onClick={(e) => this.deleteItem(this.props.cart[i].picture, this.props.cart[i].size)}>
            <h3 class="delete_text">&times;</h3>
          </div>
        </div>
      );
    }

    return items;
  }
}
