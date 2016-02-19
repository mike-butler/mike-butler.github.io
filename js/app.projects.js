(function(win, $){
    var app = win.app = typeof (win.app) !== 'undefined' ? win.app : {};
    
    (app.projects = function(){
        //private properties
        //TODO: put this in a file and use getAuthCode to get it.
        var authCode = '',
            baseUrl = 'http://api.pexels.com/v1/popular?per_page=15&page=1',
            collection = {
                page: 1,
                perPage: 0,
                totalResults: 0,
                images: []
            };
        
        //private methods
        var getAuthCode = function() {
            return ($.getJSON('../data/authcode.json', function(data){
                authCode = data.authcode;    
            })).promise();
        };
                
        var getPageImages = function(criteria, count, page ) {
            $.when(
                getAuthCode()
            ).then(function(){               
                $.ajax({
                    url: baseUrl,
                    crossOrigin: true,
                    beforeSend: function(xhr){
                        xhr.setRequestHeader('Authorization', authCode);
                    },
                    type: 'GET',
                    dataType: 'jsonp'
                }).done(function(data) {
                    data.each(function(i, item){
                        collection.page = item.page;
                        collection.perPage = item.perPage;
                        collection.totalResults = item.totalResults;
                        collection.images = item.photos;
                    }); 
                });
            })
            .fail(function(error){
                console.log('error.message');
            });
        };
        
        //public methods
        return {
            init: function() {
	           //getPageImages();                            
            },
            getImageByIndex: function(index) {
                return collection.images[index];
            }
        }
    }());
})(window, jQuery);