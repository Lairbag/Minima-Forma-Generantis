var Engine = function (options, image, canvas) {
    var self = this;

    self.options = options;
    self.image = image;
    self.canvas = canvas;

    self.createToken = (file, image, reader, pattern, supportPattern) => new Promise(resolve =>{
        reader.onload = () => resolve((() => {
            image.src = reader.result;

            self.options.horizontalFormat(self.image.naturalWidth > self.image.naturalHeight);

            var width = !self.options.horizontalFormat()
                ? pattern.clientWidth
                : pattern.clientHeight;
            
            var height = !self.options.horizontalFormat()
                ? pattern.clientHeight
                : pattern.clientWidth;

            if(self.options.horizontalJoin())
                self.loadTokenWithHorizontalJoin(supportPattern.clientHeight, height, width);	
            else
                self.loadTokenWithVerticalJoin(supportPattern.clientHeight, height, width);
        })());
        reader.readAsArrayBuffer(file);
    })
    
    self.loadTokenWithHorizontalJoin = function (supportHeight, height, width){
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
        ctx.globalAlpha = self.options.opacity()/100;
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
        ctx.fillRect(ctx.lineWidth, ctx.lineWidth, width-ctx.lineWidth, supportHeight-ctx.lineWidth);
        ctx.fillRect(ctx.lineWidth, height * 2 + supportHeight + ctx.lineWidth, width-ctx.lineWidth, supportHeight-ctx.lineWidth);
    
        ctx.stroke();
    }
    
    self.loadTokenWithVerticalJoin = function(supportHeight, height, width){
        var ctx = self.canvas.getContext('2d');

        self.canvas.width = width*2;
        self.canvas.height = height + supportHeight;
    
        //background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);
    
        //images
        ctx.scale(-1, 1);						
        ctx.drawImage(self.image, 0, 0, -width, height);
        ctx.scale(-1, 1);
        ctx.globalAlpha = self.options.opacity()/100;
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
};