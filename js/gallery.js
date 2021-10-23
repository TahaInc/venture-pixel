class GalleryView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let gallery = [];

    for (let i = 0; i < this.props.pictures; i++) {
      gallery.push(
        <div class="gallery_img_wrapper">
          <img class="gallery_img" src={`data/${this.props.accessid}/${this.props.preview ? "preview" : "pictures"}/${i}.jpg`} />
        </div>
      );
    }

    return gallery;
  }
}
