var OptionsViewModel = function(callback) {
    var self = this;
    
    self.supportColor = ko.observable("#ffffff");
    self.supportColor.subscribe(function(){
        callback();
    });

    self.borderColor = ko.observable("#c8c8c8");
    self.borderColor.subscribe(function(){
        callback();
    });

    self.opacity = ko.observable(50);
    self.opacity.subscribe(function(){
        callback();
    });
    self.horizontalFormat = ko.observable(false);
    
    self.horizontalJoin =  ko.observable(true);
    self.horizontalJoin.subscribe(function(){
        callback();
    });
    self.withSupport = ko.observable(true);
    self.withSupport.subscribe(function(){
        callback();
    });

    self.fileName = ko.observable(null);
};
