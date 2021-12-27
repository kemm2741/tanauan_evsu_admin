import React, { useRef, useState } from "react";

import Carousel, {
  Modal as ReactImagesModal,
  ModalGateway,
} from "react-images";

const ImageViewer = ({ images, setImages }) => {
  const imageRef = useRef();

  const handleShowImage = (index) => {
    const updated = images.map((data, breakpoint) => {
      if (breakpoint === index) {
        return { ...data, active: true };
      }
      return { ...data, active: false };
    });
    setImages(updated);
  };

  const closeLightbox = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  return (
    <div className="image-gallery-container">
      <ModalGateway>
        {isViewerOpen ? (
          <ReactImagesModal onClose={closeLightbox}>
            <Carousel
              currentIndex={currentImage}
              views={images.map((image) => {
                return {
                  source: image.url,
                };
              })}
            />
          </ReactImagesModal>
        ) : null}
      </ModalGateway>

      <input
        // onChange={handleImageChange}
        type={"file"}
        hidden={true}
        ref={imageRef}
        accept="image/*"
        multiple={true}
      />
      <div className="image-gallery-view">
        {Array.isArray(images) && images.length > 0 ? (
          images.map((image, index) => {
            if (image.active) {
              return (
                <img
                  onClick={() => {
                    setIsViewerOpen(true);
                    setCurrentImage(index);
                  }}
                  key={index}
                  alt="gallery view"
                  src={image.url}
                />
              );
            }
            return null;
          })
        ) : (
          <img
            alt="block img"
            src="https://cdn1.iconfinder.com/data/icons/image-1-0/1024/image_block-512.png"
          />
        )}

        <p
          className="mt-2  upload "
          onClick={() => {
            imageRef.current.click();
          }}
        ></p>
      </div>
      <div className="image-gallery-lists">
        {Array.isArray(images) && images.length > 0 ? (
          images.map((data, index) => {
            return (
              <div className="image-gallery-list" key={index}>
                <img
                  onMouseEnter={() => handleShowImage(index)}
                  onClick={() => handleShowImage(index)}
                  className={`${
                    data.active ? "image-active" : "image-unactive"
                  }`}
                  alt={`gallery view ${index}`}
                  src={data.url}
                />
              </div>
            );
          })
        ) : (
          <div className="image-gallery-list">
            <img
              className="image-block"
              alt={`block gallery view `}
              src="https://cdn1.iconfinder.com/data/icons/image-1-0/1024/image_block-512.png"
            />
            <p className="no-image-selected">
              <span>No Image Selected</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageViewer;
