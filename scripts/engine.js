var Engine = function (options, image) {
    var self = this;

    self.options = options;
    self.image = image;

    self.loadImage = function(canvas){
        var pattern = document.getElementById('pattern');
        var supportPattern = document.getElementById('support-pattern');
        
        self.options.horizontalFormat(self.image.naturalWidth > self.image.naturalHeight);

        var width = !self.options.horizontalFormat()
            ? pattern.clientWidth
            : pattern.clientHeight;
        
        var height = !self.options.horizontalFormat()
            ? pattern.clientHeight
            : pattern.clientWidth;

        if(self.options.horizontalJoin())
            self.loadTokenWithHorizontalJoin(supportPattern.clientHeight, height, width, canvas);	
        else
            self.loadTokenWithVerticalJoin(supportPattern.clientHeight, height, width, canvas);
    }

    self.loadTokenWithHorizontalJoin = function (supportHeight, height, width, canvas){
        var ctx = canvas.getContext('2d');
        
        canvas.width = width;
        canvas.height = (height + supportHeight) * 2;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        //images
        ctx.scale(1, -1);
        ctx.drawImage(self.image, 0, -supportHeight, width, -height);
        ctx.scale(1, -1);
        ctx.globalAlpha = self.options.opacity()/100;
        ctx.drawImage(self.image, 0, height + supportHeight, width, height);
    
        //borders
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
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
    
    self.loadTokenWithVerticalJoin = function(supportHeight, height, width, canvas){
        var ctx = canvas.getContext('2d');

        canvas.width = width*2;
        canvas.height = height + supportHeight;
    
        //background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        //images
        ctx.scale(-1, 1);						
        ctx.drawImage(self.image, 0, 0, -width, height);
        ctx.scale(-1, 1);
        ctx.globalAlpha = self.options.opacity()/100;
        ctx.drawImage(self.image, width, 0, width, height);
    
        //borders
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
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