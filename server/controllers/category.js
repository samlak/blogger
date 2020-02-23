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

const deleteCategory = async (req, Category) => {
    await Category.findByIdAndRemove(req.params.id).then((result) => {
        req.flash('categoryDeleted', "Your category has been deleted successfully");
    }, (erro) => {
        req.flash('categoryDeleted', "Error deleting your category");
    });
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