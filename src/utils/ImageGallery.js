import React, { useRef, useState } from "react";

import Carousel, {
  Modal as ReactImagesModal,
  ModalGateway,
} from "react-images";

import { FcUpload } from "react-icons/fc";
import { AiOutlineCloseCircle } from "react-icons/ai";

import getBase64 from "./base64";

const ImageGallery = ({ images, setImages }) => {
  const imageRef = useRef();

  const handleImageChange = async (e) => {
    const files = e.target.files;
    for (let file of files) {
      const dataUrl = await getBase64(file);
      setImages((prev) => {
        if (prev.length === 0) {
          return [...prev, { file: file, dataUrl, active: true }];
        }
        return [...prev, { file: file, dataUrl, active: false }];
      });
    }
  };

  const handleShowImage = (index) => {
    const updated = images.map((data, breakpoint) => {
      if (breakpoint === index) {
        return { ...data, active: true };
      }
      return { ...data, active: false };
    });
    setImages(updated);
  };
  const removeImageFromGallery = (index) => {
    const toBeRemove = images.filter(
      (data, breakpoint) => breakpoint !== index
    );
    const update = toBeRemove.map((data, breakpoint) => {
      if (breakpoint === 0) {
        return { ...data, active: true };
      } else {
        return { ...data, active: false };
      }
    });

    setImages(update);
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
                  source: image.dataUrl,
                };
              })}
            />
          </ReactImagesModal>
        ) : null}
      </ModalGateway>

      <input
        onChange={handleImageChange}
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
                  src={image.dataUrl}
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
        >
          <FcUpload color="#710000" size={24} /> <span> Upload new image</span>
        </p>
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
                  src={data.dataUrl}
                />
                <AiOutlineCloseCircle
                  onClick={() => removeImageFromGallery(index)}
                  size={25}
                  className="text-danger image-gallery-remove"
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

export default ImageGallery;
