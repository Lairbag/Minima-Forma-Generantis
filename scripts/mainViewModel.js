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
            self.tmpDataUrl = f;
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
            reader.readAsDataURL(f);
        //}
    }
};
