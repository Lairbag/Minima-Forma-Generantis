var MainViewModel = function(canvas, pattern, supportPattern) {
    var self = this;

    self.canvas = canvas;
    self.pattern = pattern;
    self.supportPattern = supportPattern;

    self.tmpDataUrl = null;
    self.tmpReader = null;    

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

    self.fileSelect = function(element, event){
        self.imageLoaded(false);
        self.options.fileName(null);

        var file = event.target.files[0];

        // Only process image files.
        if (!file.type.match('image.*')) {
            alert(escape(file.name)+' n\'est pas une image !');
            return;
        }
        
        if(self.currentSize() == null)
            self.setSize("standard");

        var image = new Image();
        var engine = new Engine(self.options, image, self.canvas);
        //https://gist.githubusercontent.com/scf37/6b4bf47dce4d78be92216323b12f2d21/raw/0d1bc88bb2f523425ea6cf8ab77e79f6b040a284/imageOrientation.ts
        //https://stackoverflow.com/questions/35940290/how-to-convert-base64-string-to-javascript-file-object-like-as-from-file-input-f        
        engine.readOrientation(file)
            .then(orientation => engine.applyRotation(file, orientation || 1))
            .then(imageUrl => fetch(imageUrl))
            .then(res => res.arrayBuffer())
            .then(buf => new File([buf], file.name, {type:file.type}))
            .then(newFile => { 
                const reader = new FileReader();
                self.tmpReader = reader;
                self.tmpDataUrl = newFile;

                if(self.options.fileName() === null)
                    self.options.fileName(escape(newFile.name));

                return engine.createToken(newFile, image, reader, pattern, supportPattern);
            })
            .then(() => {                
                var dt = self.canvas.toDataURL(file.type);
                
                if(dt != self.downloadHref())
                    self.downloadHref(dt);
                    
                self.imageLoaded(true);
            });
    }
};
