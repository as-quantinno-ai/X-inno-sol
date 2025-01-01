class CustomFormDTO {
    constructor(id, name, width, missing, columns, align, measure, parent, values, role, category, description, conditions) {
        this.id = id;
        this.name = name;
        this.width = width;
        this.missing = missing;
        this.columns = columns;
        this.align = align;
        this.measure = measure;
        this.parent = parent;
        this.values = values;
        this.role = role;
        this.category = category;
        this.description = description;
        this.conditions = conditions;
    }
}

export default CustomFormDTO;
