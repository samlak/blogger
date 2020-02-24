const saveAuthor = async (req, Author) => {
    try {
        const image = req.files.picture;
        const modifiedName = new Date().getTime() + image.name ;
        const path = __dirname + '/../../public/upload/' + modifiedName;
        
        await image.mv(path);
        
        const author = new Author({
            name: req.body.name,
            email: req.body.email,
            bio: req.body.bio,
            role: req.body.role,
            password: req.body.password,
            picture: modifiedName
        });
    
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

const deleteAuthor = async (req, Author) => {
    await Author.findByIdAndRemove(req.params.id).then((result) => {
        req.flash('authorDeleted', "Author deleted successfully");
    }, (e) => {
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