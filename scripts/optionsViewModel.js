var OptionsViewModel = function(subscribeCallback) {
    var self = this;
    
    self.supportColor = ko.observable("white");
    self.supportColor.subscribe(function() {
        subscribeCallback();
    });
    
    self.borderColor = ko.observable("black");
    self.borderColor.subscribe(function() {
        subscribeCallback();
    });
    
    self.opacity = ko.observable(50);
    self.opacity.subscribe(function() {
        subscribeCallback();
    });
    
    self.horizontalFormat = ko.observable(false);
    self.horizontalFormat.subscribe(function() {
        subscribeCallback();
    });
    
    self.horizontalJoin =  ko.observable(true);
    self.horizontalJoin.subscribe(function() {
        subscribeCallback();
    });
    
    self.withSupport = ko.observable(true);
    self.withSupport.subscribe(function() {
        subscribeCallback();
    });

    self.fileName = ko.observable("ma-miniature.jpg");
};
