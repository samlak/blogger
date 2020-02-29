const saveCategory = async (req, Category) => {
    const category = new Category({
        name: req.body.name,
        description: req.body.description,
    });

    await category.save().then((result) => {
        req.flash('categoryCreated', "Your category has been created successfully");
    }, (erro) => {
        req.flash('categoryCreated', "There is problem creating a new category");
    });
};

const deleteCategory = async (req, Category, Article) => {
    await Category.findById(req.params.id).then( async (result) => {
        const generalId = '5e59d6621c4a961bd4cd92ba';
        if(result._id == generalId){
            req.flash('categoryDeleted', "You can not delete this category");
        }else{
            await Article.findAndUpdate(
                {category: result._id},
                {$set: {article: generalId}},
                {useFindAndModify: false}
            ).then((result) => {
                console.log(result);
            }, (erro) => {
                req.flash('categoryDeleted', "Error deleting your category");
            });

            await Category.findById(req.params.id).then((result) => {
                req.flash('categoryDeleted', "Your category has been deleted successfully");
            }, (erro) => {
                req.flash('categoryDeleted', "Error deleting your category");
            });
        }
    }, (error) => {
        req.flash('categoryDeleted', "Error deleting your category");
    });

//     await Category.findByIdAndRemove(req.params.id).then((result) => {
//         req.flash('categoryDeleted', "Your category has been deleted successfully");
//     }, (erro) => {
//         req.flash('categoryDeleted', "Error deleting your category");
//     });
};

const updateCategory = async (_, req, Category) => {
    const category = _.pick(req.body, ['name', 'description']);
    category.name = req.body.name;
    category.description = req.body.description;

    await Category.findByIdAndUpdate(
            req.params.id,
            {$set: category},
            {useFindAndModify: false}
        ).then((result) => {
        req.flash('categoryUpdated', "Your category has been updated successfully");
    }, (e) => {
        req.flash('categoryUpdated', "Error updating your category");
    });
};


module.exports = {saveCategory, deleteCategory, updateCategory};