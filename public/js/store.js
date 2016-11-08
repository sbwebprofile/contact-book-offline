(function(PouchDB) {

    function Store(name) {
        this.db = new PouchDB(name);
    }

    Store.prototype.getAll = function() {
        return this.db.allDocs({ include_docs: true })
            .then(function(db) {
                return db.rows.map(function(row) {
                    return row.doc;
                });
            });
    };

    Store.prototype.get = function(id) {
        return this.db.get(id);
    };

    Store.prototype.save = function(item) {
        var db = this.db;

        if(!item._id)
            return db.post(item);

        return db.get(item._id)
            .then(function(updatingItem) {
                db.extend(updatingItem, item);
                return db.put(updatingItem);
            });
    };

    Store.prototype.remove = function(id) {
        var db = this.db;

        return db.get(id)
            .then(function(item) {
                return db.remove(item);
            });
    };

    Store.prototype.extend = function(target, source) {
        for(var key in source) {
            if(source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
    };

    window.Store = Store;

}(PouchDB));