import { FcUpload } from "react-icons/fc";
import { AiOutlineCloseCircle } from "react-icons/ai";
import React, { useRef, useState } from "react";

import shortId from "shortid";
import getBase64 from "./base64";

const UpdateGallery = ({
  images,
  handlingRemove,
  setImages,
  setAddingUpdateImages,
}) => {
  const imageRef = useRef();
  const handleImageChange = async (e) => {
    const files = e.target.files;
    for (let file of files) {
      const dataUrl = await getBase64(file);
      const _id = shortId.generate();
      setAddingUpdateImages((prev) => {
        return [...prev, { file, _id }];
      });

      setImages((prev) => {
        if (prev.length === 0) {
          return [
            ...prev,
            {
              file: file,
              img: dataUrl,
              active: true,
              status: "new",
              _id,
              url: dataUrl,
            },
          ];
        }
        return [
          ...prev,
          {
            file: file,
            img: dataUrl,
            active: false,
            status: "new",
            _id,
            url: dataUrl,
          },
        ];
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
  return (
    <div className="image-gallery-container">
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
                  key={index}
                  alt={`gallery view ${image._id}`}
                  src={image.img}
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
          <FcUpload size={20} /> <span> Upload new image</span>
        </p>
      </div>
      <div className="image-gallery-lists">
        {Array.isArray(images) && images.length > 0
          ? images
              .slice(0)
              .reverse()
              .map((data, index) => {
                return (
                  <div className="image-gallery-list" key={index}>
                    <img
                      onMouseEnter={() =>
                        handleShowImage(images.length - 1 - index)
                      }
                      onClick={() => handleShowImage(images.length - 1 - index)}
                      className={`${
                        data.active ? "image-active" : "image-unactive"
                      }`}
                      alt={`gallery view ${index}`}
                      src={data.img}
                    />
                    <AiOutlineCloseCircle
                      onClick={() => handlingRemove(data)}
                      size={25}
                      className="text-danger image-gallery-remove"
                    />
                    {data.status === "new" ? (
                      <span className="update-badge-info">New Upload</span>
                    ) : null}
                  </div>
                );
              })
          : null}
      </div>
    </div>
  );
};

export default UpdateGallery;
