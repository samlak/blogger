const saveAuthor = async (req, Author) => {
    try {
        if(req.files){
            var image = req.files.picture;
            var modifiedName = new Date().getTime() + image.name ;
            var path = __dirname + '/../../public/upload/' + modifiedName;
            
            await image.mv(path);
            
            var author = new Author({
                name: req.body.name,
                email: req.body.email,
                bio: req.body.bio,
                role: req.body.role,
                password: req.body.password,
                picture: modifiedName
            });
        }else{
            var author = new Author({
                name: req.body.name,
                email: req.body.email,
                bio: req.body.bio,
                role: req.body.role,
                password: req.body.password,
                picture: modifiedName
            });
        }

        await author.save().then((result) => {
            req.flash('authorCreated', "Author created successfully");
        }, (e) => {
            req.flash('authorCreated', "Error creating a new author");
        });

    } catch (error) {
        req.flash('authorCreated', "There is problem uploading picture");
        console.log(error);
    }
};

const deleteAuthor = async (req, fs, Author, Article) => {
    await Author.findById(req.params.id).then( async (author) => {
        const editorId = '5e59d76f1c4a961bd4cd92bb';
        if(author._id == editorId){
            req.flash('authorDeleted', "You can not delete this author");
        }else{
            const articles = await Article.find({author: author._id});
            articles.forEach(async (article) => {
                await Article.findByIdAndUpdate(
                    article._id, 
                    {$set: {author: editorId}},
                    {useFindAndModify: false}
                ).then((result) => {
                }, (error) => {
                    req.flash('authorDeleted', "Error encounter when updating associated article");
                });
            });
            
            if(typeof author.picture != 'undefined' && author.picture != ''){
                fs.unlinkSync(__dirname + '/../../public/upload/' + author.picture);
            }

            await Author.findByIdAndRemove(req.params.id, {useFindAndModify: false}).then((result) => {
                req.flash('authorDeleted', "Author deleted successfully");
            }, (e) => {
                req.flash('authorDeleted', "Error deleting your author");
            });

        }
    }, (error) => {
        req.flash('authorDeleted', "Error deleting your author");
    });

};

const updateAuthor = async (_, fs, req, Author) => {
    // const author = _.pick(req.body, ['name', 'email', 'bio', 'role']);
    // author.name = req.body.name;
    // author.email = req.body.email;
    // author.bio = req.body.bio;
    // author.role = req.body.role;
    // // author.password = req.body.password;

    // await Author.findByIdAndUpdate(
    //         req.params.id,
    //         {$set: author},
    //         {useFindAndModify: false}
    //     ).then((result) => {
    //     req.flash('authorUpdated', "Your author has been updated successfully");
    // }, (e) => {
    //     req.flash('authorUpdated', "Error updating your author");
    // });

    try {
        const thisAuthor = await Author.findById(req.params.id);

        const author = _.pick(req.body, ['name', 'email', 'bio', 'role', 'picture']);
        author.name = req.body.name;
        author.email = req.body.email;
        author.bio = req.body.bio;
        author.role = req.body.role;
        // author.password = req.body.password;

        if(req.files){
            if(typeof thisAuthor.picture != 'undefined' && thisAuthor.picture != ''){
                fs.unlinkSync(__dirname + '/../../public/upload/' + thisAuthor.picture);
            }

            const image = req.files.picture;
            const modifiedName = new Date().getTime() + image.name ;
            const path = __dirname + '/../../public/upload/' + modifiedName;

            await image.mv(path);
            author.picture = modifiedName;
        }

        await Author.findByIdAndUpdate(
            req.params.id,
            {$set: author},
            {useFindAndModify: false}
        ).then((result) => {
            req.flash('authorUpdated', "Your author has been updated successfully");
        }, (e) => {
            req.flash('authorUpdated', "Error updating your author");
        });

    } catch (error) {
        req.flash('authorUpdated', "There is problem updating your author image");
        console.log(error);
    }
};

module.exports = {saveAuthor, deleteAuthor, updateAuthor};