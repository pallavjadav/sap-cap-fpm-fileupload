using MyBooks as service from '../../srv/service';
annotate service.Books with @(
    UI.CreateHidden : true,
    UI.SelectionFields #filterBarMacro : [
        Genre,
        Title,
    ],
    UI.LineItem #tableMacro : [
        {
            $Type : 'UI.DataField',
            Value : ID,
            Label : '{i18n>Id}',
        },
        {
            $Type : 'UI.DataField',
            Value : Title,
            Label : '{i18n>Title}',
        },
        {
            $Type : 'UI.DataField',
            Value : Genre,
            Label : '{i18n>Genre}',
        },
        {
            $Type : 'UI.DataField',
            Value : Author,
            Label : '{i18n>Author}',
        },
        {
            $Type : 'UI.DataField',
            Value : Price,
            Label : '{i18n>Price}',
        },
    ],
);

annotate service.Books with {
    Genre @Common.Label : 'Genre'
};

annotate service.Books with {
    Title @Common.Label : 'Title'
};

annotate service.Files with @(
    UI.SelectionFields #filterBarMacro : [
    ],
    UI.LineItem #tableMacro : [
        {
            $Type : 'UI.DataField',
            Value : fileType,
            Label : 'fileType',
        },
        {
            $Type : 'UI.DataField',
            Value : fileName,
            Label : 'fileName',
        },
        {
            $Type : 'UI.DataField',
            Value : content,
            Label : 'content',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : ID,
            Label : 'ID',
        },
        {
            $Type : 'UI.DataField',
            Value : fileType,
            Label : 'fileType',
        },
        {
            $Type : 'UI.DataField',
            Value : fileName,
            Label : 'fileName',
        },
        {
            $Type : 'UI.DataField',
            Value : content,
            Label : 'content',
        },
    ],
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'General',
            ID : 'General',
            Target : '@UI.FieldGroup#General',
        },
    ],
    UI.FieldGroup #General : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : fileName,
                Label : 'fileName',
            },
            {
                $Type : 'UI.DataField',
                Value : content,
                Label : 'content',
            },
        ],
    },
);

