(function() {
    var board_id,
        _this = this;

    board_id = window.board.model.id;

    

    if (window.board.model.users.get(KanbanTool.Board.current_user_id).can('move_tasks', window.board.model)) {
        
        $.ajax({
            type: 'GET',
            url: '/boards/' + parseInt(board_id + 20) + '/schema.json',
            async: false,
            dataType: 'json',
            success: function(schema) {
                
                var myShippedColumnID;
                
                var columns, max_width;
                max_width = 120;

                $(schema.workflow_stages).each(function(i, e) {
                    var width;

                    width = e.full_name.length * 6 + 30;
                    if (width > max_width) {
                        return max_width = width;
                    }
                    
                    if (e.full_name == "Shipped"){
                        myShippedColumnID = e.id;
                    }
                    
                });


                $('#task_context_menu .change_board').after('<li><a href="#extension:email-tracking-number:' + myShippedColumnID + '">Ship & Email</a></li>');
                
            }
        });
        $(window).bind('extensionContextMenuAction', function(event, action, el, pos) {
            var current_ws_id, task_id, ws_id;
            if (/extension:email-tracking-number:([0-9])/.test(action)) {
                ws_id = action.replace(/extension:email-tracking-number:/, '');
                current_ws_id = $(el).parent()[0].id.split('_')[1];
                task_id = $(el)[0].id.split('_')[1];
                
                
                
                if (ws_id !== current_ws_id) {
                    // Sending email - START
                        
                        
                        var myTrackingNumber = "";
                        var myEmailAddress = "";
                        
                        var myCardContent = $(el)[0].innerHTML;
                        
                        var a = myCardContent.split("<li>"), i;
                        
                        for (i = 1; i < a.length; i++) {
                            
                            var myInnerCardContent = a[i].split("</li>");
                            
                            if (i==a.length-2){
                                myTrackingNumber = myInnerCardContent[0];
                            }
                            
                            if (i== a.length-1){
                                myEmailAddress = myInnerCardContent[0];
                            }
                            
                            
                        }
                        
                        var subject = "We sent your shipment";
                        var body = "Your tracking code is: " + myTrackingNumber;
                        window.location.href = "mailto:" + myEmailAddress + "?subject=" + subject + "&body=" + body;
                        
                    // Sending email - END
                }
                
                
                if (ws_id !== current_ws_id) {
                    return $.ajax({
                        type: 'POST',
                        url: '/boards/' + parseInt(board_id + 20) + '/tasks/' + task_id + '/change_board',
                        dataType: 'script',
                        async: false,
                        data: {
                            b_id: parseInt(board_id + 20),
                            ws_id: ws_id,
                            sl_id: $(el).parent()[0].id.split('_')[2],
                            copy: false
                        }
                    });
                }
                
                
            }
        });
    }

}).call(this);
