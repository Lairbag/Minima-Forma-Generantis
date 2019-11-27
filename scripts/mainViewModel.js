var MainViewModel = function(canvas) {
    var self = this;

    self.canvas = canvas;
    self.downloadHref = ko.observable(null);
    self.options = new OptionsViewModel(function(){self.refreshCanvas();});

    self.imageLoaded = ko.observable(false);
    self.currentSize = ko.observable(null);

    self.sizes = ko.observableArray([
        "minuscule",
        "standard",
        "grand",
        "colossale",
        "gigantesque"
    ]);
    
    self.setSize = function(size){
        self.currentSize(size);				
        self.refreshCanvas();					
    }

    self.refreshCanvas = function(){
        if(!self.imageLoaded() || self.tmpReader == null || self.tmpDataUrl == null)
            return;
        self.tmpReader.readAsDataURL(self.tmpDataUrl);
        
        var ctx = self.canvas.getContext('2d');
        ctx.restore();
    
    };

    self.tmpDataUrl = null;
    self.tmpReader = null;
    self.fileSelect = function(element, event){
        self.imageLoaded(false);
        self.options.fileName(null);

        var files =  event.target.files;// FileList object

        // Loop through the FileList and render image files as thumbnails.
        //for (var i = 0, f; f = files[i]; i++) {
            var f = files[0];
            // Only process image files.
            if (!f.type.match('image.*')) {
                alert(escape(f.name)+' n\'est pas une image !');
                return;
            }

            var reader = new FileReader();
            self.tmpReader = reader;
            // Closure to capture the file information.
            reader.onload = (function(theFile) {
                return function(e) {                           
                    
                    var image = new Image();
                    image.src = e.target.result;
                    
                    if(self.options.fileName() === null)
                        self.options.fileName(escape(theFile.name));
                    
                    if(self.currentSize() == null)
                        self.setSize("standard");
                    
                    var engine = new Engine(self.options, image);
                    engine.loadImage(self.canvas);

                    var dt = self.canvas.toDataURL('image/jpeg');//todo récupérer le type de l'image
                    if(dt != self.downloadHref())
                        self.downloadHref(dt);

                    self.imageLoaded(true);
                };                            
            })(f);
            
            // Read in the image file as a data URL.
            
            //https://stackoverflow.com/questions/35940290/how-to-convert-base64-string-to-javascript-file-object-like-as-from-file-input-f
            getImageUrl(f, null)
                .then(imageUrl => fetch(imageUrl))
                .then(res => res.arrayBuffer())
                .then(buf => new File([buf], f.name,{type:f.type}))
                .then(newFile => 
                    { 
                        self.tmpDataUrl = newFile;
                        return reader.readAsDataURL(newFile);
                    });
            //reader.readAsDataURL(f);
    }





//https://gist.githubusercontent.com/scf37/6b4bf47dce4d78be92216323b12f2d21/raw/0d1bc88bb2f523425ea6cf8ab77e79f6b040a284/imageOrientation.ts
    function getImageUrl(file, maxWidth) {
        return readOrientation(file).then(orientation => applyRotation(file, orientation || 1, maxWidth || 999999));
    }
    
    // Based on: https://stackoverflow.com/a/46814952/283851

    const readOrientation = (file) => new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve((() => {
            const view = new DataView(/** @type {ArrayBuffer} */ (reader.result));
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


    const applyRotation = (file, orientation, maxWidth) => new Promise(resolve => {
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
                const scale = outputWidth > maxWidth ? maxWidth / outputWidth : 1;
                width = Math.floor(width * scale);
                height = Math.floor(height * scale);
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
                canvas2.width = Math.floor(outputWidth * scale);
                canvas2.height = Math.floor(outputHeight * scale);
                const ctx2 = canvas2.getContext("2d");
                const sx = rightAligned ? canvas.width - canvas2.width : 0;
                ctx2.drawImage(canvas, sx, 0, canvas2.width, canvas2.height, 0, 0, canvas2.width, canvas2.height);
                // export base64
                resolve(canvas2.toDataURL("image/jpeg"));
            };
            image.src = url;
        };
        reader.readAsDataURL(file);
    });
};
