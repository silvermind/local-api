/**
 * A utility for automatically toggling ip switches in the hosts file
 * the hosts dictionary has entries of type
 *      hostname: fakeIP
 */
module.exports = function(path,hosts,newline){

    if(newline == null) {
        newline = '\n';
    }
    var fs = require('fs');
    var file = '';

    return {
        init: function() {

            file = fs.readFileSync(path).toString();
            var lines = file.split('\n');
            lines = lines.map(function (l) {
                //remove trailing whitespace and initial #// strings left after previous execution errors
                l = l.replace(/(\s+$)|(^#\/\/ )/,'');
                if (l.match(/^#/) || l == '') {
                    //leave normal comments and empty lines untouched
                    return l;
                } else {
                    //for other entries
                    var words = l.split(/\s+/);
                    if (words.length == 2) {
                        var ip = words[0],
                            hostname = words[1];
                        //if the hostname matches one of the substitution rules
                        if (hostname in hosts) {
                            //if the current entry is what we want to have
                            if(ip == hosts[hostname].ip){
                                //leave it
                                return l;
                            }
                            //otherwise comment the line with '#//'
                            return '#// ' + l;
                        }
                    }
                }
                return l;
            });

            for(var hostname in hosts){
                if(hosts.hasOwnProperty(hostname)){
                    lines.push(hosts[hostname]+' '+hostname+' #//');
                }
            }

            file = lines.join(newline);
//            console.log('CHANGING HOSTS FILE');
//            console.log(file);
            if(file.length>0){
                fs.writeFileSync(path,file);
            }
        },

        /*FIXME there is some undefined behavior in the code below that I couldn't fix -
          when revert() is called on process end, sometimes the IO functions fail and e.g. writeFileSync()
          leaves the hosts file erased, which makes this utility unusable
          It occurred mainly when there were console.log calls in this code. Could have something to do
          with the way node handles shutdown (some timeout etc).
         */
        revert: function(){
            file = fs.readFileSync(path).toString();
            var lines = file.split(newline);
            var newLines = [];
            var i = 0,
                len = lines.length,
                l;
            for (; i < len; i++) {
                l = lines[i];
                if (l.match('^#// ')) {
                    // uncomment original entries
                    newLines.push(l.slice(4));
                } else if (l.match('^#') || l == '') {
                    // leave normal comments and empty lines untouched
                    newLines.push(l);
                } else if (l.slice(-3) === '#//') {
                    // delete added lines
                } else {
                    //leave all other entries untouched
                    newLines.push(l);
                }
            }
            file = newLines.join(newline);
            if (file.length>5) {
                fs.writeFileSync(path, file);
            }
        }
    };
};