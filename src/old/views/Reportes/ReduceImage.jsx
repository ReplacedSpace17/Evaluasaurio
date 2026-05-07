// ReduceImage.jsx
const reduceImage = (file, maxWidth = 1024, maxHeight = 1024, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    if (!file) return reject("No file provided");

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        let { width, height } = img;

        // Mantener proporción
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: "image/jpeg" }));
            } else {
              reject("Error generating blob");
            }
          },
          "image/jpeg",
          quality
        );
      };

      img.onerror = () => reject("Error loading image");
    };

    reader.onerror = () => reject("Error reading file");
  });
};

export default reduceImage;
