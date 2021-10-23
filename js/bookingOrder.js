class BookingView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let orders = [];

    for (const [key, value] of Object.entries(this.props.bookings)) {
      orders.unshift(
        <div class="booking_item" id={key}>
          <h2 class="booking_item_title">{value.Name}</h2>
          <h3 class="booking_item_subtitle">{key}</h3>
          {value.Status == 1 && <h2 class="booking_item_new">new</h2>}
        </div>
      );
    }

    if (orders.length > 0) {
      return orders;
    } else {
      return <h3 class="booking_item_nothing">No bookings yet.</h3>;
    }
  }
}

class BookingInfoView extends React.Component {
  constructor(props) {
    super(props);
  }

  rejectBooking() {
    $.ajax({
      type: "POST",
      url: "admin.php",
      async: false,
      cache: false,
      data: { status: "reject_booking", admin: localStorage.getItem("accessid"), accessid: this.props.booking.accessid },
      success: function (result) {
        if (result != "error") {
          location.reload();
        }
      },
    });
  }

  acceptBooking() {
    $.ajax({
      type: "POST",
      url: "admin.php",
      async: false,
      cache: false,
      data: { status: "confirm_booking", admin: localStorage.getItem("accessid"), accessid: this.props.booking.accessid },
      success: function (result) {
        if (result != "error") {
          $("#status_1").fadeOut(300);
          $("#status_2").delay(300).fadeIn(300);
        }
      },
    });
  }

  confirmPaid() {
    $.ajax({
      type: "POST",
      url: "admin.php",
      async: false,
      cache: false,
      data: { status: "confirm_paid", admin: localStorage.getItem("accessid"), accessid: this.props.booking.accessid },
      success: function (result) {
        if (result != "error") {
          $("#status_2").fadeOut(300);
          $("#status_3").delay(300).fadeIn(300);
        }
      },
    });
  }

  releasePictures() {
    $.ajax({
      type: "POST",
      url: "admin.php",
      async: false,
      cache: false,
      dataType: "json",
      data: { status: "pictures_ready", admin: localStorage.getItem("accessid"), accessid: this.props.booking.accessid },
      success: function (result) {
        if (result != "error") {
          ReactDOM.render(<BookingInfoView booking={result} />, document.querySelector("#popup_info"));
        }
      },
    });
  }

  releaseEditedPictures() {
    $.ajax({
      type: "POST",
      url: "admin.php",
      async: false,
      cache: false,
      dataType: "json",
      data: { status: "edited_pictures_ready", admin: localStorage.getItem("accessid"), accessid: this.props.booking.accessid },
      success: function (result) {
        if (result != "error") {
          ReactDOM.render(<BookingInfoView booking={result} />, document.querySelector("#popup_info"));
        }
      },
    });
  }

  render() {
    let picture = [];

    if (this.props.booking.Current_pictures > 0) {
      for (let i = 0; i < this.props.booking.Current_pictures; i++) {
        picture.push(
          <div class="booking_info_pictures_wrapper">
            <img src={`data/${this.props.booking.accessid}/${this.props.booking.Status >= 5 ? "pictures" : "preview"}/${i}.jpg?${new Date().getTime()}`} class="booking_info_pictures" />
          </div>
        );
      }
    } else {
      picture.push(<h3 id="no_picture_message">No pictures uploaded</h3>);
    }

    return (
      <div class="booking_info_popup_wrapper">
        <div class="booking_info_popup">
          <div class="booking_info_popup_section">
            <h2 class="booking_info_popup_title">Contact information</h2>
            <h3 class="booking_info_popup_subtitle">
              <b>Name:</b> {this.props.booking.Name}
            </h3>
            <h3 class="booking_info_popup_subtitle">
              <b>Email:</b> {this.props.booking.Email}
            </h3>
            <h3 class="booking_info_popup_subtitle">
              <b>Phone:</b> {this.props.booking.Phone}
            </h3>
          </div>

          <div class="booking_info_popup_section">
            <h2 class="booking_info_popup_title">Booking information</h2>
            <h3 class="booking_info_popup_subtitle">
              <b>Date:</b> {this.props.booking.Date} @{this.props.booking.Time}
            </h3>
            <h3 class="booking_info_popup_subtitle">
              <b>Location:</b> {this.props.booking.Location}
            </h3>
            <h3 class="booking_info_popup_subtitle">
              <b>Event type:</b> {this.props.booking.Event}
            </h3>
          </div>

          <div class="booking_info_popup_section">
            <h2 class="booking_info_popup_title">Pricing information</h2>
            <h3 class="booking_info_popup_subtitle">
              <b>Package:</b> {this.props.booking.Total} ({this.props.booking.Pictures} pictures)
            </h3>
            <h3 class="booking_info_popup_subtitle">
              <b>Photo editing:</b> {this.props.booking.Photo_editing == "true" ? "Yes" : "No"}
            </h3>
          </div>
        </div>
        {this.props.booking.Comment != "" && (
          <div>
            <h3 class="booking_info_comment_title">
              <b>Comments:</b> {this.props.booking.Comment}
            </h3>
          </div>
        )}

        <div id="booking_info_status_section">
          <div id="status_1" style={this.props.booking.Status == 1 ? { display: "block" } : { display: "none" }}>
            <div id="booking_info_status_1">
              <button class="button btn_reject" onClick={() => this.rejectBooking()}>
                Reject
              </button>
              <button class="button btn_accept" onClick={() => this.acceptBooking()}>
                Accept
              </button>
            </div>
          </div>

          <div id="status_2" style={this.props.booking.Status == 2 ? { display: "block" } : { display: "none" }}>
            <div id="booking_info_status_2">
              {this.props.booking.payment_type == "" ? (
                <h3>{this.props.booking.Name.split(" ")[0]} hasn't picked a payment method yet</h3>
              ) : (
                <h3>
                  {this.props.booking.Name.split(" ")[0]} will pay with {this.props.booking.payment_type}
                </h3>
              )}
              <button class="button btn_confirmPay" onClick={() => this.confirmPaid()}>
                Confirm paid
              </button>
            </div>
          </div>

          <div id="status_3" style={this.props.booking.Status == 3 || this.props.booking.Status == 4 ? { display: "block" } : { display: "none" }}>
            <div id="booking_info_status_3_wrapper">
              {!(new Date(this.props.booking.Date.split("-")[0], this.props.booking.Date.split("-")[1] - 1, this.props.booking.Date.split("-")[2]) <= new Date(new Date().toDateString())) ? (
                <h3>
                  The booking is scheduled for {this.props.booking.Date.replaceAll("-", "/")} at {this.props.booking.Time}.
                </h3>
              ) : (
                <div id="booking_info_status_3">
                  <div>
                    <form id="upload_form" method="post" action="" enctype="multipart/form-data">
                      <div id="upload_button_wrapper">
                        <input type="file" id="files" name="files[]" multiple />
                        <input type="button" class="button btn_upload" value="Choose files" />
                      </div>
                      <input type="button" class="button btn_upload" id="submit" value="Upload" />
                    </form>
                    {this.props.booking.Status == 3 ? (
                      <div>
                        <hr id="hr_line" />
                        <button class="button btn_releasePictures" onClick={() => this.releasePictures()}>
                          Release pictures
                        </button>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                  <div id="booking_info_pictures_grid" className={`${this.props.booking.Current_pictures > 0 ? "dual_grid" : ""}`}>
                    {picture}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div id="status_5" style={this.props.booking.Status == 5 || this.props.booking.Status == 6 ? { display: "block" } : { display: "none" }}>
            <div id="booking_info_status_3_wrapper">
              <div id="booking_info_status_3">
                <div>
                  <form id="upload_form" method="post" action="" enctype="multipart/form-data">
                    <div id="upload_button_wrapper">
                      <input type="file" id="files" name="files[]" multiple />
                      <input type="button" class="button btn_upload" value="Choose files" />
                    </div>
                    <input type="button" class="button btn_upload" id="submit" value="Upload" />
                  </form>
                  {this.props.booking.Status == 5 ? (
                    <div>
                      <hr id="hr_line" />
                      <button class="button btn_releasePictures" onClick={() => this.releaseEditedPictures()}>
                        Release edited pictures
                      </button>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
                <div id="booking_info_pictures_grid" className={`${this.props.booking.Current_pictures > 0 ? "dual_grid" : ""}`}>
                  {picture}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
