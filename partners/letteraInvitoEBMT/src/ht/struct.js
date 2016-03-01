window.dyn_modules = {};

function solveDynModules($node){

    if ( $node.find('[data-h-modules-role="dyn_module"]').size() != 0 )
        $node.find('[data-h-modules-role="dyn_module"]').each(function(){
            var $node = $(this);
            var module_id = $node.attr("data-h-module-id");
            var template_name = $node.attr("data-h-template-name");

            var opts = ( _.is($node.attr("data-h-opts")) )? $node.attr("data-h-opts") : '{}';



            //$node.removeAttr("data-h-module-id").removeAttr("data-h-template-name").removeAttr("data-h-opts");

            $.get("templates/"+template_name+".html", function(data) {
                var $html = $("<div data-h-template-name='"+template_name+"' data-h-module-id='"+module_id+"'>"+data+"</div>");



                    var jsonOpts = jQuery.parseJSON(opts);






                $node.append($html);
                addModule(template_name,module_id,moduleFunctions);

                // creo la funzione che mi ritorna il nodo html del modulo
                window.dyn_modules[template_name][module_id].$ = function(){return $html;}

                // creo la funzione che mi ritorna le opts del modulo
                window.dyn_modules[template_name][module_id].opts = function(){return jsonOpts;}

                // creo la funzione che mi ritorna l'id del modulo
                window.dyn_modules[template_name][module_id].getId = function(){return module_id;}

                // creo la funzione che mi ritorna il nome delle template
                window.dyn_modules[template_name][module_id].getTemplate = function(){return template_name;}

                // creo la funzione che crea lo scroller interno al modulo
                window.dyn_modules[template_name][module_id].createScroller = function(){
                    // TODO: qui invece del setTimeout, il createScroller va invocato quando tutti i sottomoduli del modulo sono stati printati e hanno occupato i loro ingombri
                    var that = this;
                    var $that = that.$();

                    if( _.is(that.$scroll) )
                        that.$scroll = null;

                    setTimeout(function(){
                        var $wrapper = $that.find(".wrapper");
                        $wrapper_id = _.id("wrapper");
                        $wrapper.attr("id",$wrapper_id);
                        var $scroll = new iScroll($wrapper_id);

                        $wrapper.resize(function(){
                            console.log("refesh");
                            $scroll.refresh();
                        });

                    },300);

                };



                // creo la funzione che mi ritorna l'array degli id dei mooduli figli di primo livello
                var arr = [];
                $node.find('[data-h-modules-role="dyn_module"]').each(function(){
                    arr.push($(this).attr("data-h-module-id"));
                });

                window.dyn_modules[template_name][module_id].getChildModules =function(){
                    return arr;
                };




                try{
                    // invoco l'on del modulo
                    window.dyn_modules[template_name][module_id].js_on(jsonOpts);

                }
                catch(err){
                    txt="Problema nell'on del template:" +template_name+ "\n";
                    txt+="Error description: " + err.message;
                    console.log(txt);
                }

                // rimuovo il tag script per non affollare il DOM
                $html.find("script").remove();

                // verifico se nel modulo ci siano altri moduli dinamici
                if( $html.find('[data-h-modules-role="dyn_module"]').size() != 0 ){
                    solveDynModules($html);
                }
            });
        });
}



function addModule(template_name,module_id,moduleFunctions){
    if(window.dyn_modules[template_name] == undefined)
        window.dyn_modules[template_name] = {};
    if(window.dyn_modules[template_name][module_id] == undefined)
        window.dyn_modules[template_name][module_id] = {};
    window.dyn_modules[template_name][module_id] = moduleFunctions;
}

                                                                                                                                                       
function getModule(module_idOrModuleOr$moduleOrSome$elem){
    if(is$Module(module_idOrModuleOr$moduleOrSome$elem)){

        var t_name =  module_idOrModuleOr$moduleOrSome$elem.closest('[data-h-modules-role="dyn_module"]').attr("data-h-template-name");
        var m_id =  module_idOrModuleOr$moduleOrSome$elem.closest('[data-h-modules-role="dyn_module"]').attr("data-h-module-id");
    }
    else{

        var mod_id = ( _.isString(module_idOrModuleOr$moduleOrSome$elem) ) ? module_idOrModuleOr$moduleOrSome$elem
                                                                : module_idOrModuleOr$moduleOrSome$elem.$().closest('[data-h-modules-role="dyn_module"]').attr("data-h-module-id");

        _.each(_.keys(window.dyn_modules),function(template_name){
            _.each(_.keys(window.dyn_modules[template_name]),function(module_id){
                if(module_id == mod_id){
                    t_name = template_name;
                    m_id = module_id;
                }
            })
        })
    }

    return window.dyn_modules[t_name][m_id];
}



function getParentModule(elem){
   var current_module = getModule(elem);
   var parent_module_id= current_module.$().parents('[data-h-modules-role="dyn_module"]').eq(1).attr("data-h-module-id");
   return getModule(parent_module_id);
}


function getAllModule(template_name){
    var arr = [];
    _.each(window.dyn_modules[template_name],function(module){
       arr.push(module);
    });
    return arr;
};

function isLever(module){
   if( module.$().attr("data-h-template-name") == "levers_group_widget" )
        return true;
   return false;
}

function is$Module(elem){

     if(_.isString(elem))
        return false;
     else{
         if(elem.js_on == undefined)
            return true;
         else
            return false;
     }

}



/*

 window.dyn_modules = {

        "template_name" : {
            "module_id" :  moduleFunctions,
            "module_id" :  moduleFunctions
        },

        "template_name" : {
            "module_id" :  moduleFunctions
        }
        .
        .
        .
        .

 }

*/



