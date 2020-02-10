var Engine = function (options, canvas) {
  var self = this;

  self.options = options;
  self.image = new Image();
  self.canvas = canvas;

  self.createToken = (file, reader, pattern, supportPattern) => new Promise(resolve => {
    reader.onload = () => resolve((() => {
      self.image.src = reader.result;
      
      self.options.horizontalFormat(self.image.naturalWidth > self.image.naturalHeight);

      var width = !self.options.horizontalFormat()
        ? pattern.clientWidth
        : pattern.clientHeight;

      var height = !self.options.horizontalFormat()
        ? pattern.clientHeight
        : pattern.clientWidth;

      if (self.options.horizontalJoin())
        self.loadTokenWithHorizontalJoin(supportPattern.clientHeight, height, width);
      else
        self.loadTokenWithVerticalJoin(supportPattern.clientHeight, height, width);
    })());

    reader.readAsDataURL(file);
  });

  self.loadTokenWithHorizontalJoin = function (supportHeight, height, width) {
    var ctx = self.canvas.getContext('2d');

    self.canvas.width = width;
    self.canvas.height = (height + supportHeight) * 2;
    ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);

    //background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);

    //images
    ctx.scale(1, -1);
    ctx.drawImage(self.image, 0, -supportHeight, width, -height);
    ctx.scale(1, -1);
    ctx.globalAlpha = self.options.opacity() / 100;
    ctx.drawImage(self.image, 0, height + supportHeight, width, height);

    //borders
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.rect(0, 0, self.canvas.width, self.canvas.height);
    ctx.rect(0, 0, width, supportHeight);
    ctx.rect(0, height + supportHeight, width, height);

    ctx.lineWidth = 1;
    ctx.strokeStyle = self.options.borderColor();

    //support color
    ctx.fillStyle = self.options.supportColor();
    ctx.fillRect(ctx.lineWidth, ctx.lineWidth, width - ctx.lineWidth, supportHeight - ctx.lineWidth);
    ctx.fillRect(ctx.lineWidth, height * 2 + supportHeight + ctx.lineWidth, width - ctx.lineWidth, supportHeight - ctx.lineWidth);

    ctx.stroke();
  }

  self.loadTokenWithVerticalJoin = function (supportHeight, height, width) {
    var ctx = self.canvas.getContext('2d');

    self.canvas.width = width * 2;
    self.canvas.height = height + supportHeight;

    //background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);

    //images
    ctx.scale(-1, 1);
    ctx.drawImage(self.image, 0, 0, -width, height);
    ctx.scale(-1, 1);
    ctx.globalAlpha = self.options.opacity() / 100;
    ctx.drawImage(self.image, width, 0, width, height);

    //borders
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.rect(0, 0, self.canvas.width, self.canvas.height);
    ctx.rect(0, 0, width, height);
    ctx.rect(0, height, width, supportHeight);
    ctx.rect(width, height, width, height);

    ctx.lineWidth = 1;
    ctx.strokeStyle = self.options.borderColor();

    //support color
    ctx.fillStyle = self.options.supportColor();
    ctx.fillRect(ctx.lineWidth, height + ctx.lineWidth, width - ctx.lineWidth, supportHeight - ctx.lineWidth);
    ctx.fillRect(width + ctx.lineWidth, height + ctx.lineWidth, width - ctx.lineWidth, supportHeight - ctx.lineWidth);

    ctx.stroke();
  }

  // Based on: https://stackoverflow.com/a/46814952/283851
  self.readOrientation = (file) => new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve((() => {
      const view = new DataView(/** @type {ArrayBuffer} */(reader.result));
      if (view.getUint16(0, false) != 0xFFD8) {
        return;
      }
      const length = view.byteLength;
      let offset = 2;
      while (offset < length) {
        const marker = view.getUint16(offset, false);
        offset += 2;
        if (marker == 0xFFE1) {
          offset += 2;
          if (view.getUint32(offset, false) != 0x45786966) {
            return;
          }
          offset += 6;
          const little = view.getUint16(offset, false) == 0x4949;
          offset += view.getUint32(offset + 4, little);
          const tags = view.getUint16(offset, little);
          offset += 2;
          for (let i = 0; i < tags; i++) {
            if (view.getUint16(offset + (i * 12), little) == 0x0112) {
              return view.getUint16(offset + (i * 12) + 8, little);
            }
          }
        }
        else if ((marker & 0xFF00) != 0xFF00) {
          break;
        }
        else {
          offset += view.getUint16(offset, false);
        }
      }
    })());
    reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
  });

  self.applyRotation = (file, orientation) => new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result;
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        let { width, height } = image;
        const [outputWidth, outputHeight] = orientation >= 5 && orientation <= 8
          ? [height, width]
          : [width, height];

        // to rotate rectangular image, we need enough space so square canvas is used
        const wh = Math.max(width, height);
        // set proper canvas dimensions before transform & export
        canvas.width = wh;
        canvas.height = wh;
        // for some transformations output image will be aligned to the right of square canvas
        let rightAligned = false;
        // transform context before drawing image
        switch (orientation) {
          case 2:
            context.transform(-1, 0, 0, 1, wh, 0);
            rightAligned = true;
            break;
          case 3:
            context.transform(-1, 0, 0, -1, wh, wh);
            rightAligned = true;
            break;
          case 4:
            context.transform(1, 0, 0, -1, 0, wh);
            break;
          case 5:
            context.transform(0, 1, 1, 0, 0, 0);
            break;
          case 6:
            context.transform(0, 1, -1, 0, wh, 0);
            rightAligned = true;
            break;
          case 7:
            context.transform(0, -1, -1, 0, wh, wh);
            rightAligned = true;
            break;
          case 8:
            context.transform(0, -1, 1, 0, 0, wh);
            break;
          default: break;
        }
        // draw image
        context.drawImage(image, 0, 0, width, height);
        // copy rotated image to output dimensions and export it
        const canvas2 = document.createElement("canvas");
        canvas2.width = outputWidth;
        canvas2.height = outputHeight;
        const ctx2 = canvas2.getContext("2d");
        const sx = rightAligned ? canvas.width - canvas2.width : 0;
        ctx2.drawImage(canvas, sx, 0, canvas2.width, canvas2.height, 0, 0, canvas2.width, canvas2.height);
        // export base64
        resolve(canvas2.toDataURL(file.type));
      };
      image.src = url;
    };
    reader.readAsDataURL(file);
  });
};