class OrderView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let orders = [];

    for (const [key, value] of Object.entries(this.props.orders)) {
      console.log(key, value);

      orders.unshift(
        <div class="order_item" id={key}>
          <h2 class="order_item_title">{value.name}</h2>
          <h3 class="order_item_subtitle">#{key}</h3>
          {value.new && <h2 class="order_item_new">new</h2>}
        </div>
      );
    }

    if (orders.length > 0) {
      return orders;
    } else {
      return <h3 class="booking_item_nothing">No unfulfilled orders</h3>;
    }
  }
}

class OrderInfoView extends React.Component {
  constructor(props) {
    super(props);
  }

  confirmPaid(id) {
    $.ajax({
      type: "POST",
      url: "admin.php",
      async: false,
      cache: false,
      dataType: "json",
      data: { status: "confirm_order_paid", admin: localStorage.getItem("accessid"), orderid: this.props.orderId },
      success: function (result) {
        if (result != "error") {
          ReactDOM.render(<OrderInfoView order={result[id]} orderId={id} />, document.querySelector("#popup_info"));
        }
      },
    });
  }

  fulfillOrder() {
    $.ajax({
      type: "POST",
      url: "admin.php",
      async: false,
      cache: false,
      data: { status: "fulfill_order", admin: localStorage.getItem("accessid"), orderid: this.props.orderId },
      success: function (result) {
        if (result != "error") {
          location.reload();
        }
      },
    });
  }

  render() {
    let picture = [];

    for (const [key, value] of Object.entries(this.props.order.cart)) {
      picture.unshift(
        <div class="order_picture_wrapper">
          <img src={value.picture} class="order_picture" />
          <div class="order_picture_pricing_info">
            <h3 class="order_picture_text">
              <b>Price:</b> {value.price}
            </h3>
            <h3 class="order_picture_text">
              <b>Quantity:</b> &times;{value.quantity}
            </h3>
          </div>
          <h3 class="order_picture_text">
            <b>Size:</b> {value.size}
          </h3>
          <a class="button btn_download" href={value.picture} download>
            Download
          </a>
        </div>
      );
    }

    return (
      <div id="order_view">
        <div id="order_view_top">
          <div>
            <h2 class="order_info_popup_title">Contact information</h2>
            <h3 class="order_info_popup_subtitle">
              <b>Name:</b> {this.props.order.name}
            </h3>
            <h3 class="order_info_popup_subtitle">
              <b>Email:</b> {this.props.order.email}
            </h3>
            <h3 class="order_info_popup_subtitle">
              <b>Address:</b> {this.props.order.address}
            </h3>
          </div>
          <div id="order_paid_info">
            {this.props.order.paid ? (
              <div>
                <h3>{this.props.order.name.split(" ")[0]} has already paid</h3>
                <button class="button btn_confirmPay" onClick={() => this.fulfillOrder()}>
                  Fullfill order
                </button>
              </div>
            ) : (
              <div>
                <h3>
                  {this.props.order.name.split(" ")[0]} will pay with {this.props.order.payment_type}
                </h3>
                <button class="button btn_confirmPay" onClick={() => this.confirmPaid(this.props.orderId)}>
                  Confirm paid
                </button>
              </div>
            )}
          </div>
        </div>
        <div id="order_image_view">{picture}</div>
      </div>
    );
  }
}
